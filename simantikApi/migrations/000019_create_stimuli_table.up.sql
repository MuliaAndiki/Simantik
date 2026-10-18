-- Shared reading passages (stimulus wacana): 1 stimulus -> 1-3 questions.
CREATE TABLE IF NOT EXISTS stimuli (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title      VARCHAR(200) NOT NULL,
    content    TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

ALTER TABLE questions ADD COLUMN IF NOT EXISTS stimulus_id UUID REFERENCES stimuli(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_questions_stimulus_id ON questions (stimulus_id);
