import 'dotenv/config';
import { z } from 'zod';

const booleanFromString = z.enum(['true', 'false']).transform((value) => value === 'true');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().url().optional(),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/thy_db'),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:3000'),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().max(90).default(30),
  OTP_TTL_MINUTES: z.coerce.number().int().positive().max(30).default(10),
  OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().max(10).default(5),
  OTP_RESEND_COOLDOWN_SECONDS: z.coerce.number().int().nonnegative().max(600).default(60),
  DEFAULT_PHONE_COUNTRY_CODE: z.string().regex(/^\+[1-9]\d{0,2}$/).default('+91'),
  EXPOSE_MOCK_OTP: booleanFromString.default('false'),
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}

if (parsed.data.NODE_ENV === 'production' && parsed.data.EXPOSE_MOCK_OTP) {
  throw new Error('EXPOSE_MOCK_OTP must be false in production');
}

export const env = parsed.data;
