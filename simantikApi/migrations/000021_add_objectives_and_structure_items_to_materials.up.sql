ALTER TABLE materials
ADD COLUMN IF NOT EXISTS learning_objectives JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS structure_items JSONB DEFAULT '[]'::jsonb;
