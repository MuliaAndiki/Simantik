-- 000002_create_refresh_tokens_table.up.sql
-- Stores hashed refresh tokens for persistent login sessions.
-- The plaintext token is issued to the client via httpOnly cookie only.
-- Multiple concurrent sessions per user are supported (multi-device).

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash   VARCHAR(64)  NOT NULL,
    expires_at   TIMESTAMPTZ  NOT NULL,
    revoked_at   TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    user_agent   TEXT,
    ip_address   VARCHAR(45),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Fast lookup by hash on every request that carries a refresh token.
CREATE UNIQUE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash
    ON refresh_tokens (token_hash);

-- Supports "revoke all sessions for user" (logout all / password reset).
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id
    ON refresh_tokens (user_id);

-- Supports cleanup jobs that delete expired sessions.
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at
    ON refresh_tokens (expires_at);
