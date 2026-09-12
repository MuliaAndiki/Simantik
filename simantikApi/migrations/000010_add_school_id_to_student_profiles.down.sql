-- 000010_add_school_id_to_student_profiles.down.sql

DROP INDEX IF EXISTS idx_student_profiles_school_id;
ALTER TABLE student_profiles DROP COLUMN IF EXISTS school_id;
