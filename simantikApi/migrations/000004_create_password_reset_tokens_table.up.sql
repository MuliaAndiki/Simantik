-- 000004_create_password_reset_tokens_table.up.sql
-- Short-lived, single-use tokens issued after successful OTP verification.
-- The holder is authorized to call resetPassword exactly once within 15 minutes.
-- The plaintext token is returned to the client; only the SHA-256 hash is stored.

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast lookup by hash when validating a reset request.
CREATE UNIQUE INDEX IF NOT EXISTS idx_password_reset_tokens_token_hash
    ON password_reset_tokens (token_hash);

-- Supports invalidating all pending reset tokens for a user (e.g. after successful reset).
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id
    ON password_reset_tokens (user_id);
