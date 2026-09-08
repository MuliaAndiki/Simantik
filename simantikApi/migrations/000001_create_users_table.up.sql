-- 000001_create_users_table.up.sql
-- Creates the base users table for SIMANTIK.
-- Production deployments must apply this via golang-migrate.
-- Development uses GORM AutoMigrate (DB_AUTO_MIGRATE=true).

CREATE TABLE IF NOT EXISTS users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name     VARCHAR(150) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL DEFAULT '',
    avatar_url    VARCHAR(500),
    role          VARCHAR(30)  NOT NULL DEFAULT 'student',
    status        VARCHAR(20)  NOT NULL DEFAULT 'active',
    last_login_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ
);

-- Unique index on email for login lookups and collision detection.
-- Partial index excludes soft-deleted records so the same email can be
-- re-used after a soft-delete (rare, but avoids hard locks).
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email
    ON users (email)
    WHERE deleted_at IS NULL;

-- Index supporting soft-delete filtering on deleted_at.
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users (deleted_at);
