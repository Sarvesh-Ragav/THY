import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env.js';
import { User, type IUser } from '../models/User.js';
import { AuthSession } from '../models/AuthSession.js';
import { CustomerProfile } from '../models/CustomerProfile.js';
import { generateOtp, hashValue, valuesMatch } from '../utils/crypto.js';
import { ApiError } from '../utils/api-error.js';

export interface AuthUser {
  id: string;
  phoneNumber?: string | null;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  authProvider: 'phone' | 'google' | 'both';
  role: 'customer' | 'tailor' | 'admin' | null;
}

const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

function toUser(doc: IUser): AuthUser {
  return {
    id: doc._id.toString(),
    phoneNumber: doc.phoneNumber ?? null,
    email: doc.email ?? null,
    name: doc.name ?? null,
    avatarUrl: doc.avatarUrl ?? null,
    authProvider: doc.authProvider,
    role: doc.role ?? null,
  };
}

/**
 * 1. Create a 6-digit OTP challenge stored in MongoDB with TTL
 */
export async function createOtpChallenge(
  phoneNumber: string,
  requestIp?: string
): Promise<{ challengeId: string; expiresAt: Date; mockOtp?: string }> {
  // Check cooldown from latest unconsumed challenge
  const recentChallenge = await AuthSession.findOne({
    phoneNumber,
    type: 'otp_challenge',
    consumedAt: null,
  }).sort({ createdAt: -1 });

  if (
    recentChallenge &&
    Date.now() - (recentChallenge as any).createdAt.getTime() < env.OTP_RESEND_COOLDOWN_SECONDS * 1000
  ) {
    throw new ApiError(429, 'Please wait before requesting another verification code.', 'OTP_COOLDOWN');
  }

  // Consume any previous pending challenges for this number
  await AuthSession.updateMany(
    { phoneNumber, type: 'otp_challenge', consumedAt: null },
    { consumedAt: new Date() }
  );

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + env.OTP_TTL_MINUTES * 60_000);

  const challenge = await AuthSession.create({
    type: 'otp_challenge',
    phoneNumber,
    otpHash: hashValue(otp),
    attemptCount: 0,
    maxAttempts: env.OTP_MAX_ATTEMPTS,
    requestIp: requestIp ?? null,
    expiresAt,
  });

  const result: { challengeId: string; expiresAt: Date; mockOtp?: string } = {
    challengeId: challenge._id.toString(),
    expiresAt,
  };

  if (env.NODE_ENV !== 'production' && env.EXPOSE_MOCK_OTP) {
    result.mockOtp = otp;
  } else if (env.NODE_ENV !== 'production') {
    console.info(`[mock-otp] Verification code generated for ${phoneNumber}: ${otp}`);
  }

  return result;
}

/**
 * 2. Verify OTP challenge and find/create User in MongoDB
 */
export async function verifyOtp(phoneNumber: string, challengeId: string, otp: string): Promise<AuthUser> {
  const challenge = await AuthSession.findOne({
    _id: challengeId,
    phoneNumber,
    type: 'otp_challenge',
    consumedAt: null,
  });

  if (!challenge) {
    throw new ApiError(400, 'This verification code is invalid or has already been used.', 'OTP_INVALID');
  }

  if (challenge.expiresAt.getTime() <= Date.now()) {
    challenge.consumedAt = new Date();
    await challenge.save();
    throw new ApiError(400, 'This verification code has expired. Request a new code.', 'OTP_EXPIRED');
  }

  if (challenge.attemptCount >= challenge.maxAttempts) {
    challenge.consumedAt = new Date();
    await challenge.save();
    throw new ApiError(429, 'Too many incorrect attempts. Request a new code.', 'OTP_ATTEMPTS_EXCEEDED');
  }

  if (!valuesMatch(otp, challenge.otpHash ?? '')) {
    challenge.attemptCount += 1;
    if (challenge.attemptCount >= challenge.maxAttempts) {
      challenge.consumedAt = new Date();
    }
    await challenge.save();
    throw new ApiError(400, 'The verification code is incorrect.', 'OTP_INVALID');
  }

  challenge.consumedAt = new Date();
  await challenge.save();

  // Find or create user by phone number
  let user = await User.findOne({ phoneNumber });
  if (!user) {
    user = await User.create({
      phoneNumber,
      authProvider: 'phone',
      role: null,
      lastLoginAt: new Date(),
    });
  } else {
    user.lastLoginAt = new Date();
    await user.save();
  }

  return toUser(user);
}

/**
 * 3. Verify Google Credential (ID Token) and find/create/link User in MongoDB
 */
export async function verifyGoogleCredential(credential: string): Promise<AuthUser> {
  let googleId: string;
  let email: string;
  let name: string | null = null;
  let picture: string | null = null;

  // Dev-mock fallback: short-circuit BEFORE real verification, works even with GOOGLE_CLIENT_ID set
  if (env.NODE_ENV !== 'production' && credential.startsWith('dev-mock:')) {
    const parts = credential.split(':');
    email = (parts[1] || 'customer@thy.local').toLowerCase();
    googleId = `mock-google-${email.replace(/[^a-z0-9]/g, '')}`;
    name = parts[2] || 'THY Customer';
    picture = null;
    console.info(`[dev-mock-google] Signing in as ${email}`);
  } else if (googleClient && env.GOOGLE_CLIENT_ID) {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new ApiError(400, 'Unable to retrieve Google email payload.', 'GOOGLE_AUTH_FAILED');
      }
      googleId = payload.sub;
      email = payload.email.toLowerCase().trim();
      name = payload.name ?? null;
      picture = payload.picture ?? null;
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      console.error('Google token verification error:', error);
      throw new ApiError(401, 'Google authentication failed. Invalid token.', 'GOOGLE_AUTH_INVALID');
    }
  } else {
    throw new ApiError(500, 'Google Client ID is not configured on the server.', 'GOOGLE_CONFIG_MISSING');
  }

  // Find existing user by googleId or email to link accounts
  let user = await User.findOne({
    $or: [{ googleId }, { email }],
  });

  if (user) {
    user.googleId = googleId;
    user.email = email;
    if (name && !user.name) user.name = name;
    if (picture && !user.avatarUrl) user.avatarUrl = picture;
    if (user.authProvider === 'phone') {
      user.authProvider = 'both';
    }
    user.lastLoginAt = new Date();
    await user.save();
  } else {
    user = await User.create({
      googleId,
      email,
      name,
      avatarUrl: picture,
      authProvider: 'google',
      role: null,
      lastLoginAt: new Date(),
    });
  }

  // Pre-seed or sync CustomerProfile if not present
  try {
    const existingProfile = await CustomerProfile.findOne({ userId: user._id });
    if (!existingProfile && name) {
      await CustomerProfile.create({
        userId: user._id,
        fullName: name,
        email,
        city: 'Bengaluru',
        avatarUrl: picture,
      });
    }
  } catch (profileErr) {
    // Non-blocking for auth
    console.warn('Auto profile provisioning notice:', profileErr);
  }

  return toUser(user);
}

/**
 * 4. Update user role during onboarding
 */
export async function updateUserRole(userId: string, role: 'customer' | 'tailor'): Promise<AuthUser> {
  const user = await User.findOne({ _id: userId, isActive: true });
  if (!user) {
    throw new ApiError(404, 'User account not found.', 'USER_NOT_FOUND');
  }
  user.role = role;
  await user.save();
  return toUser(user);
}

/**
 * 5. Find user by ID
 */
export async function findUserById(id: string): Promise<AuthUser> {
  const user = await User.findOne({ _id: id, isActive: true });
  if (!user) {
    throw new ApiError(401, 'Authentication is no longer valid.', 'UNAUTHENTICATED');
  }
  return toUser(user);
}

/**
 * 6. Store Refresh Token Session in MongoDB
 */
export async function createRefreshSession(
  userId: string,
  tokenHash: string,
  expiresAt: Date,
  requestIp?: string,
  userAgent?: string
): Promise<void> {
  await AuthSession.create({
    type: 'refresh_token',
    userId,
    tokenHash,
    expiresAt,
    requestIp: requestIp ?? null,
    userAgent: userAgent ?? null,
  });
}

/**
 * 7. Rotate Refresh Token Session in MongoDB
 */
export async function rotateRefreshSession(
  userId: string,
  currentTokenHash: string,
  nextTokenHash: string,
  expiresAt: Date,
  requestIp?: string,
  userAgent?: string
): Promise<void> {
  const current = await AuthSession.findOne({
    userId,
    tokenHash: currentTokenHash,
    type: 'refresh_token',
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!current) {
    throw new ApiError(401, 'Refresh session is invalid or expired.', 'REFRESH_INVALID');
  }

  const newSession = await AuthSession.create({
    type: 'refresh_token',
    userId,
    tokenHash: nextTokenHash,
    expiresAt,
    requestIp: requestIp ?? null,
    userAgent: userAgent ?? null,
  });

  current.revokedAt = new Date();
  current.replacedByTokenId = newSession._id as any;
  await current.save();
}

/**
 * 8. Revoke Refresh Token Session in MongoDB
 */
export async function revokeRefreshSession(tokenHash: string): Promise<void> {
  await AuthSession.updateOne(
    { tokenHash, type: 'refresh_token', revokedAt: null },
    { revokedAt: new Date() }
  );
}
