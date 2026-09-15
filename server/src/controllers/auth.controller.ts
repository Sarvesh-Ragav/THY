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
  registerWithPassword,
  loginWithPassword,
  getAccountBundle,
  requestPasswordReset,
  resetPasswordWithToken,
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
  registerAccountSchema,
  loginPasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
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
    const account = await getAccountBundle(user);
    response.status(200).json({ success: true, data: { accessToken, ...account } });
  } catch (error) {
    next(error);
  }
};

export const googleAuth: RequestHandler = async (request, response, next) => {
  try {
    const body = googleAuthSchema.parse(request.body);
    const user = await verifyGoogleCredential(body.credential);
    const accessToken = await issueTokens(user, request, response);
    const account = await getAccountBundle(user);
    response.status(200).json({ success: true, data: { accessToken, ...account } });
  } catch (error) {
    next(error);
  }
};

export const registerAccount: RequestHandler = async (request, response, next) => {
  try {
    const body = registerAccountSchema.parse(request.body);
    const phoneNumber = validatedPhoneNumber(body.phone);
    const user =
      body.role === 'customer'
        ? await registerWithPassword({
            role: 'customer',
            fullName: body.fullName,
            phoneNumber,
            email: body.email.toLowerCase(),
            city: body.city,
            address: body.address,
            password: body.password,
          })
        : await registerWithPassword({
            role: 'tailor',
            fullName: body.fullName,
            phoneNumber,
            email: body.email.toLowerCase(),
            shopName: body.shopName,
            yearsOfExperience: body.yearsOfExperience,
            shopAddress: body.shopAddress,
            password: body.password,
          });
    const accessToken = await issueTokens(user, request, response);
    const account = await getAccountBundle(user);
    response.status(201).json({ success: true, data: { accessToken, ...account } });
  } catch (error) {
    next(error);
  }
};

export const loginWithEmail: RequestHandler = async (request, response, next) => {
  try {
    const body = loginPasswordSchema.parse(request.body);
    const user = await loginWithPassword(body.email.toLowerCase(), body.password);
    const accessToken = await issueTokens(user, request, response);
    const account = await getAccountBundle(user);
    response.status(200).json({ success: true, data: { accessToken, ...account } });
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
    const account = await getAccountBundle(user);
    return response.status(200).json({ success: true, data: { accessToken, ...account } });
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
    const account = await getAccountBundle(user);
    response.json({ success: true, data: account });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword: RequestHandler = async (request, response, next) => {
  try {
    const body = forgotPasswordSchema.parse(request.body);
    const result = await requestPasswordReset(body.email.toLowerCase());
    response.status(200).json({
      success: true,
      message: 'If an account exists for that email, a reset link is available.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword: RequestHandler = async (request, response, next) => {
  try {
    const body = resetPasswordSchema.parse(request.body);
    await resetPasswordWithToken(body.email.toLowerCase(), body.token, body.password);
    response.status(200).json({
      success: true,
      message: 'Password updated. You can log in with your new password.',
      data: { reset: true },
    });
  } catch (error) {
    next(error);
  }
};
