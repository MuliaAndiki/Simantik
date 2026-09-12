-- 000009_create_schools_table.up.sql
-- School master data for admin CRUD (student school selection)

CREATE TABLE IF NOT EXISTS schools (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    npsn       VARCHAR(20) NOT NULL UNIQUE,
    nama       VARCHAR(255) NOT NULL,
    jenjang    VARCHAR(20) NOT NULL,
    status     VARCHAR(20) NOT NULL,
    logo       VARCHAR(500),
    alamat     VARCHAR(500) NOT NULL,
    provinsi   VARCHAR(100),
    kabupaten  VARCHAR(100),
    kecamatan  VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_schools_jenjang ON schools(jenjang);
CREATE INDEX IF NOT EXISTS idx_schools_deleted_at ON schools(deleted_at);
