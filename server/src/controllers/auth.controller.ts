import type { RequestHandler } from 'express';
import { env } from '../config/env.js';
import {
  findUserById,
  createOtpChallenge,
  createRefreshSession,
  revokeRefreshSession,
  rotateRefreshSession,
  verifyOtp,
  verifyGoogleCredential,
  updateUserRole,
  type AuthUser,
} from '../services/auth.service.js';
import { createAccessToken, createRefreshToken, verifyRefreshToken, type TokenPayload } from '../services/token.service.js';
import { hashValue } from '../utils/crypto.js';
import { ApiError } from '../utils/api-error.js';
import {
  normalizePhoneNumber,
  requestOtpSchema,
  verifyOtpSchema,
  googleAuthSchema,
  updateRoleSchema,
} from '../validators/auth.schemas.js';

const refreshCookieName = 'thy_refresh_token';
const refreshCookie = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/v1/auth',
  maxAge: env.REFRESH_TOKEN_TTL_DAYS * 86_400_000,
};

const requestMetadata = (request: Parameters<RequestHandler>[0]) => ({
  requestIp: request.ip,
  userAgent: request.get('user-agent'),
});

function refreshExpiry(): Date {
  return new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 86_400_000);
}

function validatedPhoneNumber(value: string): string {
  try {
    return normalizePhoneNumber(value);
  } catch (error) {
    throw new ApiError(400, error instanceof Error ? error.message : 'Invalid phone number.', 'VALIDATION_ERROR');
  }
}

async function issueTokens(
  user: AuthUser,
  request: Parameters<RequestHandler>[0],
  response: Parameters<RequestHandler>[1],
  rotateFrom?: string
): Promise<string> {
  const payload: TokenPayload = {
    userId: user.id,
    phoneNumber: user.phoneNumber ?? null,
    email: user.email ?? null,
    role: user.role ?? null,
  };
  const refreshToken = createRefreshToken(payload);
  const metadata = requestMetadata(request);

  if (rotateFrom) {
    await rotateRefreshSession(
      user.id,
      hashValue(rotateFrom),
      hashValue(refreshToken),
      refreshExpiry(),
      metadata.requestIp,
      metadata.userAgent
    );
  } else {
    await createRefreshSession(
      user.id,
      hashValue(refreshToken),
      refreshExpiry(),
      metadata.requestIp,
      metadata.userAgent
    );
  }

  response.cookie(refreshCookieName, refreshToken, refreshCookie);
  return createAccessToken(payload);
}

export const requestOtp: RequestHandler = async (request, response, next) => {
  try {
    const { phoneNumber: rawPhone } = requestOtpSchema.parse(request.body);
    const phoneNumber = validatedPhoneNumber(rawPhone);
    const result = await createOtpChallenge(phoneNumber, request.ip);
    response.status(202).json({
      success: true,
      message: 'Verification code sent.',
      data: {
        challengeId: result.challengeId,
        expiresAt: result.expiresAt.toISOString(),
        ...(result.mockOtp ? { mockOtp: result.mockOtp } : {}),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resendOtp: RequestHandler = requestOtp;

export const confirmOtp: RequestHandler = async (request, response, next) => {
  try {
    const body = verifyOtpSchema.parse(request.body);
    const user = await verifyOtp(validatedPhoneNumber(body.phoneNumber), body.challengeId, body.otp);
    const accessToken = await issueTokens(user, request, response);
    response.status(200).json({ success: true, data: { accessToken, user } });
  } catch (error) {
    next(error);
  }
};

export const googleAuth: RequestHandler = async (request, response, next) => {
  try {
    const body = googleAuthSchema.parse(request.body);
    const user = await verifyGoogleCredential(body.credential);
    const accessToken = await issueTokens(user, request, response);
    response.status(200).json({ success: true, data: { accessToken, user } });
  } catch (error) {
    next(error);
  }
};

export const updateRole: RequestHandler = async (request, response, next) => {
  try {
    const body = updateRoleSchema.parse(request.body);
    const user = await updateUserRole(request.auth!.userId, body.role);
    response.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const refresh: RequestHandler = async (request, response, next) => {
  try {
    const currentToken = request.cookies?.[refreshCookieName] as string | undefined;
    if (!currentToken) {
      return response.status(401).json({
        success: false,
        error: { code: 'REFRESH_INVALID', message: 'Refresh session is missing.' },
      });
    }
    const payload = verifyRefreshToken(currentToken);
    const user = await findUserById(payload.userId);
    const accessToken = await issueTokens(user, request, response, currentToken);
    return response.status(200).json({ success: true, data: { accessToken, user } });
  } catch (error) {
    return next(error);
  }
};

export const logout: RequestHandler = async (request, response, next) => {
  try {
    const token = request.cookies?.[refreshCookieName] as string | undefined;
    if (token) await revokeRefreshSession(hashValue(token));
    response.clearCookie(refreshCookieName, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth',
    });
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = async (request, response, next) => {
  try {
    const user = await findUserById(request.auth!.userId);
    response.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};
