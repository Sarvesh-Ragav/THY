import type { PoolClient } from 'pg';
import { env } from '../config/env.js';
import { pool } from '../db/pool.js';
import { generateOtp, hashValue, valuesMatch } from '../utils/crypto.js';
import { ApiError } from '../utils/api-error.js';

export interface AuthUser { id: string; phoneNumber: string; role: 'customer' | 'tailor' | null; }
interface ChallengeRow { id: string; phone_number: string; otp_hash: string; expires_at: Date; attempt_count: number; max_attempts: number; }

function toUser(row: { id: string; phone_number: string; role: 'customer' | 'tailor' | null }): AuthUser {
  return { id: row.id, phoneNumber: row.phone_number, role: row.role };
}

export async function createOtpChallenge(phoneNumber: string, requestIp?: string): Promise<{ challengeId: string; expiresAt: Date; mockOtp?: string }> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const recent = await client.query<{ created_at: Date }>(
      `SELECT created_at FROM otp_challenges WHERE phone_number = $1 AND consumed_at IS NULL ORDER BY created_at DESC LIMIT 1 FOR UPDATE`,
      [phoneNumber],
    );
    if (recent.rowCount && Date.now() - recent.rows[0].created_at.getTime() < env.OTP_RESEND_COOLDOWN_SECONDS * 1000) {
      throw new ApiError(429, 'Please wait before requesting another verification code.', 'OTP_COOLDOWN');
    }
    await client.query('UPDATE otp_challenges SET consumed_at = NOW() WHERE phone_number = $1 AND consumed_at IS NULL', [phoneNumber]);
    const otp = generateOtp();
    const inserted = await client.query<{ id: string; expires_at: Date }>(
      `INSERT INTO otp_challenges (phone_number, otp_hash, expires_at, max_attempts, request_ip)
       VALUES ($1, $2, NOW() + ($3 * INTERVAL '1 minute'), $4, NULLIF($5, '')::inet)
       RETURNING id, expires_at`,
      [phoneNumber, hashValue(otp), env.OTP_TTL_MINUTES, env.OTP_MAX_ATTEMPTS, requestIp ?? ''],
    );
    await client.query('COMMIT');
    const result: { challengeId: string; expiresAt: Date; mockOtp?: string } = { challengeId: inserted.rows[0].id, expiresAt: inserted.rows[0].expires_at };
    if (env.NODE_ENV !== 'production' && env.EXPOSE_MOCK_OTP) result.mockOtp = otp;
    else if (env.NODE_ENV !== 'production') console.info(`[mock-otp] Verification code generated for ${phoneNumber}`);
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}

export async function verifyOtp(phoneNumber: string, challengeId: string, otp: string): Promise<AuthUser> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query<ChallengeRow>(
      `SELECT id, phone_number, otp_hash, expires_at, attempt_count, max_attempts
       FROM otp_challenges WHERE id = $1 AND phone_number = $2 AND consumed_at IS NULL FOR UPDATE`,
      [challengeId, phoneNumber],
    );
    const challenge = result.rows[0];
    if (!challenge) throw new ApiError(400, 'This verification code is invalid or has already been used.', 'OTP_INVALID');
    if (challenge.expires_at.getTime() <= Date.now()) {
      await client.query('UPDATE otp_challenges SET consumed_at = NOW() WHERE id = $1', [challenge.id]);
      throw new ApiError(400, 'This verification code has expired. Request a new code.', 'OTP_EXPIRED');
    }
    if (challenge.attempt_count >= challenge.max_attempts) {
      await client.query('UPDATE otp_challenges SET consumed_at = NOW() WHERE id = $1', [challenge.id]);
      throw new ApiError(429, 'Too many incorrect attempts. Request a new code.', 'OTP_ATTEMPTS_EXCEEDED');
    }
    if (!valuesMatch(otp, challenge.otp_hash)) {
      const nextAttempt = challenge.attempt_count + 1;
      await client.query('UPDATE otp_challenges SET attempt_count = $2, consumed_at = CASE WHEN $2 >= max_attempts THEN NOW() ELSE NULL END WHERE id = $1', [challenge.id, nextAttempt]);
      throw new ApiError(400, 'The verification code is incorrect.', 'OTP_INVALID');
    }
    await client.query('UPDATE otp_challenges SET consumed_at = NOW() WHERE id = $1', [challenge.id]);
    const user = await client.query<{ id: string; phone_number: string; role: 'customer' | 'tailor' | null }>(
      `INSERT INTO users (phone_number, last_login_at) VALUES ($1, NOW())
       ON CONFLICT (phone_number) DO UPDATE SET last_login_at = NOW(), updated_at = NOW()
       RETURNING id, phone_number, role`, [phoneNumber],
    );
    await client.query('COMMIT');
    return toUser(user.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}

export async function findUserById(id: string): Promise<AuthUser> {
  const result = await pool.query<{ id: string; phone_number: string; role: 'customer' | 'tailor' | null }>(
    'SELECT id, phone_number, role FROM users WHERE id = $1 AND is_active = TRUE', [id],
  );
  if (!result.rowCount) throw new ApiError(401, 'Authentication is no longer valid.', 'UNAUTHENTICATED');
  return toUser(result.rows[0]);
}

export async function storeRefreshToken(client: PoolClient, userId: string, tokenHash: string, expiresAt: Date, requestIp?: string, userAgent?: string): Promise<string> {
  const result = await client.query<{ id: string }>(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, request_ip, user_agent)
     VALUES ($1, $2, $3, NULLIF($4, '')::inet, $5) RETURNING id`,
    [userId, tokenHash, expiresAt, requestIp ?? '', userAgent ?? null],
  );
  return result.rows[0].id;
}

export async function createRefreshSession(userId: string, tokenHash: string, expiresAt: Date, requestIp?: string, userAgent?: string): Promise<void> {
  const client = await pool.connect();
  try { await storeRefreshToken(client, userId, tokenHash, expiresAt, requestIp, userAgent); } finally { client.release(); }
}

export async function rotateRefreshSession(userId: string, currentTokenHash: string, nextTokenHash: string, expiresAt: Date, requestIp?: string, userAgent?: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const current = await client.query<{ id: string }>(
      `SELECT id FROM refresh_tokens WHERE user_id = $1 AND token_hash = $2 AND revoked_at IS NULL AND expires_at > NOW() FOR UPDATE`, [userId, currentTokenHash],
    );
    if (!current.rowCount) throw new ApiError(401, 'Refresh session is invalid or expired.', 'REFRESH_INVALID');
    const newId = await storeRefreshToken(client, userId, nextTokenHash, expiresAt, requestIp, userAgent);
    await client.query('UPDATE refresh_tokens SET revoked_at = NOW(), replaced_by_token_id = $2 WHERE id = $1', [current.rows[0].id, newId]);
    await client.query('COMMIT');
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

export async function revokeRefreshSession(tokenHash: string): Promise<void> {
  await pool.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL', [tokenHash]);
}
