-- 000005_create_external_accounts_table.up.sql
-- Links SIMANTIK users to external OAuth/OIDC identities.
-- Using a separate table (not google_id on users) supports future providers
-- (GitHub, Microsoft, etc.) without schema changes.

CREATE TABLE IF NOT EXISTS external_accounts (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider         VARCHAR(30) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    email            VARCHAR(255),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Composite unique: a provider account can only link to one SIMANTIK user.
CREATE UNIQUE INDEX IF NOT EXISTS idx_external_accounts_provider_user
    ON external_accounts (provider, provider_user_id);

-- Supports finding all external accounts for a SIMANTIK user.
CREATE INDEX IF NOT EXISTS idx_external_accounts_user_id
    ON external_accounts (user_id);
