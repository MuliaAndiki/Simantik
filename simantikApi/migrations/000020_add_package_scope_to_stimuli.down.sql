DROP INDEX IF EXISTS idx_stimuli_package_scope;
ALTER TABLE stimuli DROP COLUMN IF EXISTS package_kind;
ALTER TABLE stimuli DROP COLUMN IF EXISTS package_id;
