-- 000013_drop_tryout_total_questions.down.sql

ALTER TABLE tryouts ADD COLUMN IF NOT EXISTS total_questions INT NOT NULL DEFAULT 30;
