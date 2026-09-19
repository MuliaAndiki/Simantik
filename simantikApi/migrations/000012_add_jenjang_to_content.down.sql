-- 000012_add_jenjang_to_content.down.sql

ALTER TABLE learning_modules DROP COLUMN IF EXISTS jenjang;
ALTER TABLE practice_packages DROP COLUMN IF EXISTS jenjang;
ALTER TABLE tryouts DROP COLUMN IF EXISTS jenjang;
ALTER TABLE student_profiles DROP COLUMN IF EXISTS jenjang;
