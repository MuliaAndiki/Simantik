-- 000010_add_school_id_to_student_profiles.up.sql
-- Students must select a school at registration; store the reference.

ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS school_id UUID;

CREATE INDEX IF NOT EXISTS idx_student_profiles_school_id ON student_profiles(school_id);
