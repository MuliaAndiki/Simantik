-- 000024_add_school_coordinates.down.sql

ALTER TABLE schools
    DROP CONSTRAINT IF EXISTS chk_schools_longitude,
    DROP CONSTRAINT IF EXISTS chk_schools_latitude;

ALTER TABLE schools
    DROP COLUMN IF EXISTS longitude,
    DROP COLUMN IF EXISTS latitude;
