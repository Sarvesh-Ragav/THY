CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(16) NOT NULL UNIQUE,
  role VARCHAR(20),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_phone_number_e164 CHECK (phone_number ~ '^\\+[1-9][0-9]{7,14}$'),
  CONSTRAINT users_role_valid CHECK (role IS NULL OR role IN ('customer', 'tailor'))
);

CREATE TABLE IF NOT EXISTS otp_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(16) NOT NULL,
  otp_hash VARCHAR(128) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  request_ip INET,
  CONSTRAINT otp_challenges_attempts_valid CHECK (attempt_count >= 0 AND max_attempts > 0)
);
CREATE INDEX IF NOT EXISTS otp_challenges_phone_active_idx ON otp_challenges (phone_number, created_at DESC) WHERE consumed_at IS NULL;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  replaced_by_token_id UUID REFERENCES refresh_tokens(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  request_ip INET
);
CREATE INDEX IF NOT EXISTS refresh_tokens_user_active_idx ON refresh_tokens (user_id, expires_at DESC) WHERE revoked_at IS NULL;
