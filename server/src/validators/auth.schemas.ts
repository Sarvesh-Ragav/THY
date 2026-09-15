import { z } from 'zod';
import { env } from '../config/env.js';

const phoneInput = z.string().trim().min(1).max(32);

export function normalizePhoneNumber(input: string): string {
  const trimmed = input.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (/^\+\d+$/.test(trimmed)) return `+${digits}`;
  if (digits.length === 10) return `${env.DEFAULT_PHONE_COUNTRY_CODE}${digits}`;
  throw new Error('Enter a valid 10-digit phone number or an E.164 phone number.');
}

export const requestOtpSchema = z.object({ phoneNumber: phoneInput });
export const verifyOtpSchema = z.object({
  phoneNumber: phoneInput,
  challengeId: z.string().min(1),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits.'),
});

export const googleAuthSchema = z.object({
  credential: z.string().min(1, 'Google credential token is required.'),
});

const passwordFields = {
  password: z.string().min(8, 'Password must be at least 8 characters.').max(128),
  confirmPassword: z.string().min(1, 'Please confirm your password.').max(128),
};

const passwordsMatch = <T extends { password: string; confirmPassword: string }>(value: T) =>
  value.password === value.confirmPassword;

export const loginPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').max(254),
  password: z.string().min(1, 'Password is required.').max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').max(254),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().trim().email('Enter a valid email address.').max(254),
    token: z.string().trim().min(16).max(128),
    ...passwordFields,
  })
  .refine(passwordsMatch, { message: 'Passwords do not match.', path: ['confirmPassword'] });

export const updateRoleSchema = z.object({
  role: z.enum(['customer', 'tailor']),
});

export const registerCustomerSchema = z.object({
  role: z.literal('customer'),
  fullName: z.string().trim().min(1).max(120),
  phone: phoneInput,
  email: z.string().trim().email().max(254),
  city: z.string().trim().min(1).max(120),
  address: z.string().trim().min(1).max(500),
  ...passwordFields,
});

export const registerTailorSchema = z.object({
  role: z.literal('tailor'),
  fullName: z.string().trim().min(1).max(120),
  phone: phoneInput,
  email: z.string().trim().email().max(254),
  shopName: z.string().trim().min(1).max(160),
  yearsOfExperience: z.coerce.number().int().min(0).max(80),
  shopAddress: z.string().trim().min(1).max(1_000),
  ...passwordFields,
});

export const registerAccountSchema = z
  .discriminatedUnion('role', [registerCustomerSchema, registerTailorSchema])
  .refine(passwordsMatch, { message: 'Passwords do not match.', path: ['confirmPassword'] });
