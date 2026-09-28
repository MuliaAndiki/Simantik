-- Ensure tryout answer upsert has a composite unique key.
-- The original domain migration declared UNIQUE (attempt_id, question_id),
-- but databases provisioned via GORM AutoMigrate may be missing it.
CREATE UNIQUE INDEX IF NOT EXISTS idx_student_answers_attempt_question
    ON student_answers (attempt_id, question_id);
