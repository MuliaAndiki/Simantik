DROP INDEX IF EXISTS idx_competencies_code_active;

CREATE UNIQUE INDEX IF NOT EXISTS idx_competencies_code
    ON competencies (code);
