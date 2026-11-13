-- 000022_add_school_verification.up.sql
-- Adds submission & admin verification metadata to schools

ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS verification_status  VARCHAR(20)  NOT NULL DEFAULT 'verified',
    ADD COLUMN IF NOT EXISTS submitted_by_user_id UUID,
    ADD COLUMN IF NOT EXISTS submitted_by_name    VARCHAR(150),
    ADD COLUMN IF NOT EXISTS submitted_by_email   VARCHAR(150),
    ADD COLUMN IF NOT EXISTS verified_by          UUID,
    ADD COLUMN IF NOT EXISTS verified_at          TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS rejection_reason     TEXT;

CREATE INDEX IF NOT EXISTS idx_schools_verification_status ON schools(verification_status);
CREATE INDEX IF NOT EXISTS idx_schools_submitted_by_user_id ON schools(submitted_by_user_id);
