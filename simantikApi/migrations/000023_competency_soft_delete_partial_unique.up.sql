-- Allow re-creating competency codes after a previous competency with the same code is soft-deleted.
ALTER TABLE competencies
    DROP CONSTRAINT IF EXISTS competencies_code_key;

DROP INDEX IF EXISTS idx_competencies_code;

CREATE UNIQUE INDEX IF NOT EXISTS idx_competencies_code_active
    ON competencies (code)
    WHERE deleted_at IS NULL;
