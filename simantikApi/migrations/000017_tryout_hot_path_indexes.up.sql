-- Hot-path indexes untuk tryout attempt/review (audit BE).
-- Sebelumnya full-pool scan + N+1 di review/submit/list.
CREATE INDEX IF NOT EXISTS idx_attempts_user_tryout_status ON tryout_attempts (user_id, tryout_id, status);
CREATE INDEX IF NOT EXISTS idx_attempts_user_started ON tryout_attempts (user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_aq_attempt_number ON attempt_questions (attempt_id, question_number);
CREATE INDEX IF NOT EXISTS idx_aq_attempt_question ON attempt_questions (attempt_id, question_id);
CREATE INDEX IF NOT EXISTS idx_evals_source ON evaluations (source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_qc_comp ON question_competencies (competency_id);
CREATE INDEX IF NOT EXISTS idx_tq_q ON tryout_questions (question_id);
CREATE INDEX IF NOT EXISTS idx_tryouts_status_jenjang ON tryouts (status, jenjang, created_at DESC);
