-- 000018_create_tutorials_table.up.sql
-- Tutorial: video pembelajaran via URL YouTube yang di-embed.

CREATE TABLE IF NOT EXISTS tutorials (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            VARCHAR(255) NOT NULL,
    slug             VARCHAR(255) NOT NULL UNIQUE,
    description      TEXT,
    youtube_url      VARCHAR(500) NOT NULL,
    duration_seconds INT NOT NULL DEFAULT 0,
    category         VARCHAR(100) NOT NULL,
    jenjang          VARCHAR(20) NOT NULL DEFAULT 'sma',
    status           VARCHAR(20) NOT NULL DEFAULT 'draft',
    published_at     TIMESTAMPTZ,
    created_by       UUID NOT NULL REFERENCES users(id),
    updated_by       UUID REFERENCES users(id),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at       TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tutorials_category ON tutorials (category);
CREATE INDEX IF NOT EXISTS idx_tutorials_status ON tutorials (status);
