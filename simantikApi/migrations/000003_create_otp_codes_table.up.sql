-- 000003_create_otp_codes_table.up.sql
-- Stores bcrypt-hashed OTP codes for password recovery.
-- The plaintext OTP is sent to the user's email only; it is never stored here.
-- One active OTP per (user_id, purpose) is enforced at the application layer
-- by invalidating previous records on each new request.

CREATE TABLE IF NOT EXISTS otp_codes (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    purpose      VARCHAR(30) NOT NULL,
    code_hash    VARCHAR(255) NOT NULL,
    expires_at   TIMESTAMPTZ NOT NULL,
    attempts     INT         NOT NULL DEFAULT 0,
    max_attempts INT         NOT NULL DEFAULT 5,
    verified_at  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Supports querying pending OTPs for a user+purpose pair.
CREATE INDEX IF NOT EXISTS idx_otp_codes_user_id ON otp_codes (user_id);

-- Supports cleanup jobs that remove expired OTPs.
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON otp_codes (expires_at);
