-- Ensure learning progress upsert has a composite unique key.
-- The original domain migration declared UNIQUE (user_id, material_id),
-- but databases provisioned via GORM AutoMigrate may be missing it.
CREATE UNIQUE INDEX IF NOT EXISTS idx_learning_progress_user_material
    ON learning_progress (user_id, material_id);
