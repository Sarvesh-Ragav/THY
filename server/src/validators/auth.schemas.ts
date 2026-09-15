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

export const updateRoleSchema = z.object({
  role: z.enum(['customer', 'tailor']),
});
