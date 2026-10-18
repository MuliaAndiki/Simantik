-- Add package scope columns to stimuli table
ALTER TABLE stimuli ADD COLUMN IF NOT EXISTS package_id UUID;
ALTER TABLE stimuli ADD COLUMN IF NOT EXISTS package_kind VARCHAR(20);

CREATE INDEX IF NOT EXISTS idx_stimuli_package_scope ON stimuli (package_id, package_kind);

-- Backfill stimuli that are already attached to tryout questions
UPDATE stimuli s
SET package_id = sub.tryout_id, package_kind = 'tryout'
FROM (
    SELECT DISTINCT q.stimulus_id, tq.tryout_id
    FROM questions q
    JOIN tryout_questions tq ON tq.question_id = q.id
    WHERE q.stimulus_id IS NOT NULL
) sub
WHERE s.id = sub.stimulus_id AND s.package_id IS NULL;

-- Backfill stimuli that are already attached to practice questions
UPDATE stimuli s
SET package_id = sub.package_id, package_kind = 'practice'
FROM (
    SELECT DISTINCT q.stimulus_id, pq.package_id
    FROM questions q
    JOIN practice_package_questions pq ON pq.question_id = q.id
    WHERE q.stimulus_id IS NOT NULL
) sub
WHERE s.id = sub.stimulus_id AND s.package_id IS NULL;
