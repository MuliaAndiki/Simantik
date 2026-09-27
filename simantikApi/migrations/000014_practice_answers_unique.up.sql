-- Ensure bulk upsert / idempotent answer writes have a composite unique key.
-- The original domain migration declared UNIQUE (practice_id, question_id),
-- but databases provisioned via GORM AutoMigrate may be missing it.
CREATE UNIQUE INDEX IF NOT EXISTS idx_practice_answers_practice_question
    ON practice_answers (practice_id, question_id);
