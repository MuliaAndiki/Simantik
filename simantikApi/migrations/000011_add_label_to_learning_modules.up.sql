-- 000011_add_label_to_learning_modules.up.sql
-- Add label column to learning_modules for module categorization

ALTER TABLE learning_modules ADD COLUMN IF NOT EXISTS label VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_learning_modules_label ON learning_modules(label);
