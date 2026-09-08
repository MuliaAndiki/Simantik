-- Performance and Analytics Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_student_answers_question_opt ON student_answers (question_id, selected_option_id);
CREATE INDEX IF NOT EXISTS idx_student_answers_question_correct ON student_answers (question_id, is_correct);
CREATE INDEX IF NOT EXISTS idx_tryout_attempts_tryout_status ON tryout_attempts (tryout_id, status);
CREATE INDEX IF NOT EXISTS idx_tryout_attempts_score ON tryout_attempts (score);
CREATE INDEX IF NOT EXISTS idx_competency_evaluations_comp_level ON competency_evaluations (competency_id, level);
CREATE INDEX IF NOT EXISTS idx_competency_evaluations_user_comp ON competency_evaluations (user_id, competency_id);
CREATE INDEX IF NOT EXISTS idx_learning_progresses_user_completed ON learning_progresses (user_id, is_completed);
