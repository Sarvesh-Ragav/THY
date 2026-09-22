import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env.js';
import { User, type IUser } from '../models/User.js';
import { AuthSession } from '../models/AuthSession.js';
import { CustomerProfile } from '../models/CustomerProfile.js';
import { TailorProfile } from '../models/TailorProfile.js';
import { generateOtp, generateResetToken, hashPassword, hashValue, valuesMatch, verifyPassword } from '../utils/crypto.js';
import { ApiError } from '../utils/api-error.js';

export interface AuthUser {
  id: string;
  phoneNumber?: string | null;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  authProvider: 'phone' | 'google' | 'both';
  role: 'customer' | 'tailor' | 'admin' | null;
  hasPassword: boolean;
}

const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

export interface AuthCustomerProfile {
  fullName: string;
  email: string;
  city: string;
  address: string;
  phone: string | null;
  avatarUrl: string | null;
  preferences?: {
    shoppingFor?: string;
    contactMethod?: string;
    services?: string[];
    garmentTypes?: string[];
  } | null;
}

export interface AuthTailorPortfolioItem {
  id: string;
  title: string;
  image: string;
  category: string;
  isFeatured?: boolean;
}

export interface AuthTailorProfile {
  fullName: string;
  shopName: string;
  yearsOfExperience: string;
  shopAddress: string;
  city: string;
  phone: string | null;
  portfolio: AuthTailorPortfolioItem[];
  verification?: {
    status: 'pending' | 'approved' | 'rejected';
    idType?: string;
    documentName?: string;
    submitted: boolean;
  } | null;
}

export interface AccountBundle {
  user: AuthUser;
  customerProfile: AuthCustomerProfile | null;
  tailorProfile: AuthTailorProfile | null;
}

function toUser(doc: IUser): AuthUser {
  return {
    id: doc._id.toString(),
    phoneNumber: doc.phoneNumber ?? null,
    email: doc.email ?? null,
    name: doc.name ?? null,
    avatarUrl: doc.avatarUrl ?? null,
    authProvider: doc.authProvider,
    role: doc.role ?? null,
    hasPassword: Boolean(doc.hasPassword),
  };
}

export async function getAccountBundle(user: AuthUser): Promise<AccountBundle> {
  const [customer, tailor] = await Promise.all([
    CustomerProfile.findOne({ userId: user.id }),
    TailorProfile.findOne({ userId: user.id }),
  ]);

  const defaultAddress = customer?.addresses?.find((entry) => entry.isDefault) ?? customer?.addresses?.[0];

  return {
    user,
    customerProfile: customer
      ? {
          fullName: customer.fullName,
          email: customer.email || user.email || '',
          city: customer.city,
          address: defaultAddress?.addressLine1 || '',
          phone: user.phoneNumber ?? null,
          avatarUrl: customer.avatarUrl ?? user.avatarUrl ?? null,
          preferences: customer.preferences
            ? {
                shoppingFor: customer.preferences.shoppingFor,
                contactMethod: customer.preferences.contactMethod,
                services: customer.preferences.services || [],
                garmentTypes: customer.preferences.garmentTypes || [],
              }
            : null,
        }
      : null,
    tailorProfile: tailor
      ? {
          fullName: tailor.fullName,
          shopName: tailor.shopName,
          yearsOfExperience: String(tailor.yearsOfExperience ?? ''),
          shopAddress: tailor.shopAddress,
          city: tailor.city,
          phone: user.phoneNumber ?? null,
          portfolio: (tailor.portfolio ?? [])
            .filter((item) => item.isActive !== false)
            .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
            .map((item, index) => ({
              id: item._id?.toString?.() || `${item.title}-${item.imageUrl}`,
              title: item.title,
              image: item.imageUrl,
              category: item.category || 'general',
              isFeatured: Boolean(item.isFeatured) || index < 2,
            })),
          verification: tailor.verification?.documentName || tailor.verification?.idNumberHash
            ? {
                status: tailor.verification.status || 'pending',
                idType: tailor.verification.idType,
                documentName: tailor.verification.documentName,
                submitted: true,
              }
            : null,
        }
      : null,
  };
}

export async function requestPasswordReset(email: string): Promise<{ sent: true; resetToken?: string }> {
  const user = await User.findOne({ email: email.toLowerCase(), isActive: true });
  if (!user?.hasPassword) {
    return { sent: true };
  }

  const token = generateResetToken();
  user.passwordResetTokenHash = hashValue(token);
  user.passwordResetExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await user.save();

  return {
    sent: true,
    ...(env.NODE_ENV !== 'production' ? { resetToken: token } : {}),
  };
}

export async function resetPasswordWithToken(email: string, token: string, password: string): Promise<AuthUser> {
  const user = await User.findOne({ email: email.toLowerCase(), isActive: true }).select(
    '+passwordHash +passwordResetTokenHash'
  );
  if (
    !user?.passwordResetTokenHash ||
    !user.passwordResetExpiresAt ||
    user.passwordResetExpiresAt.getTime() < Date.now() ||
    !valuesMatch(token, user.passwordResetTokenHash)
  ) {
    throw new ApiError(400, 'This reset link is invalid or has expired.', 'RESET_INVALID');
  }

  user.passwordHash = await hashPassword(password);
  user.hasPassword = true;
  user.passwordResetTokenHash = null;
  user.passwordResetExpiresAt = null;
  await user.save();
  return toUser(user);
}

function cityFromAddress(address: string): string {
  const parts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.at(-1) || 'India';
}

export type RegisterCustomerInput = {
  role: 'customer';
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  address: string;
  password: string;
};

export type RegisterTailorInput = {
  role: 'tailor';
  fullName: string;
  phoneNumber: string;
  email: string;
  shopName: string;
  yearsOfExperience: number;
  shopAddress: string;
  password: string;
};

/**
 * Create or complete a password-backed account during registration.
 */
export async function registerWithPassword(
  input: RegisterCustomerInput | RegisterTailorInput
): Promise<AuthUser> {
  try {
    const passwordHash = await hashPassword(input.password);
    let user = await User.findOne({ phoneNumber: input.phoneNumber });

    const emailOwner = await User.findOne({ email: input.email });
    if (emailOwner && (!user || emailOwner._id.toString() !== user._id.toString())) {
      throw new ApiError(409, 'An account with this email already exists.', 'EMAIL_IN_USE');
    }

    if (user) {
      if (user.role && user.role !== input.role) {
        throw new ApiError(403, 'This phone number is already registered with a different role.', 'ROLE_CONFLICT');
      }
      if (user.hasPassword) {
        throw new ApiError(409, 'An account with this phone number already exists. Please log in.', 'ACCOUNT_EXISTS');
      }
      user.role = input.role;
      user.name = input.fullName;
      user.email = input.email;
      user.passwordHash = passwordHash;
      user.hasPassword = true;
      user.lastLoginAt = new Date();
      if (user.authProvider === 'google') {
        user.authProvider = 'both';
      }
      await user.save();
    } else {
      user = await User.create({
        phoneNumber: input.phoneNumber,
        email: input.email,
        name: input.fullName,
        authProvider: 'phone',
        role: input.role,
        passwordHash,
        hasPassword: true,
        lastLoginAt: new Date(),
      });
    }

    if (input.role === 'customer') {
      await CustomerProfile.findOneAndUpdate(
        { userId: user._id },
        {
          $set: {
            fullName: input.fullName,
            email: input.email,
            city: input.city,
            addresses: [
              {
                label: 'Home',
                addressLine1: input.address,
                city: input.city,
                isDefault: true,
              },
            ],
          },
        },
        { upsert: true, new: true }
      );
    } else {
      await TailorProfile.findOneAndUpdate(
        { userId: user._id },
        {
          $set: {
            fullName: input.fullName,
            shopName: input.shopName,
            yearsOfExperience: input.yearsOfExperience,
            shopAddress: input.shopAddress,
            city: cityFromAddress(input.shopAddress),
            isDirectoryActive: true,
          },
          $setOnInsert: {
            publicId: `t-${user._id.toString()}`,
            specialties: ['Custom stitching'],
          },
        },
        { upsert: true, new: true }
      );
    }

    return toUser(user);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (typeof error === 'object' && error && 'code' in error && (error as { code: number }).code === 11000) {
      throw new ApiError(409, 'An account with these details already exists. Please log in.', 'ACCOUNT_EXISTS');
    }
    throw error;
  }
}

/**
 * Sign in with email and password stored on the User document.
 */
export async function loginWithPassword(email: string, password: string): Promise<AuthUser> {
  const user = await User.findOne({ email: email.toLowerCase(), isActive: true }).select('+passwordHash');
  if (!user?.passwordHash || !user.hasPassword) {
    throw new ApiError(401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
  }

  const matches = await verifyPassword(password, user.passwordHash);
  if (!matches) {
    throw new ApiError(401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
  }

  user.lastLoginAt = new Date();
  await user.save();
  return toUser(user);
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
