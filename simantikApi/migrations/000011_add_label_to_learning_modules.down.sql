-- 000011_add_label_to_learning_modules.down.sql

DROP INDEX IF EXISTS idx_learning_modules_label;
ALTER TABLE learning_modules DROP COLUMN IF EXISTS label;
