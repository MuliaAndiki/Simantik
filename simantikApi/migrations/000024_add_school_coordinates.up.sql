-- 000024_add_school_coordinates.up.sql
-- Adds optional latitude & longitude columns with range constraints to schools

ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

ALTER TABLE schools
    DROP CONSTRAINT IF EXISTS chk_schools_latitude,
    DROP CONSTRAINT IF EXISTS chk_schools_longitude,
    ADD CONSTRAINT chk_schools_latitude  CHECK (latitude  IS NULL OR (latitude  >= -90  AND latitude  <= 90)),
    ADD CONSTRAINT chk_schools_longitude CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180));
