-- 000022_add_school_verification.down.sql

DROP INDEX IF EXISTS idx_schools_submitted_by_user_id;
DROP INDEX IF EXISTS idx_schools_verification_status;

ALTER TABLE schools
    DROP COLUMN IF EXISTS rejection_reason,
    DROP COLUMN IF EXISTS verified_at,
    DROP COLUMN IF EXISTS verified_by,
    DROP COLUMN IF EXISTS submitted_by_email,
    DROP COLUMN IF EXISTS submitted_by_name,
    DROP COLUMN IF EXISTS submitted_by_user_id,
    DROP COLUMN IF EXISTS verification_status;
