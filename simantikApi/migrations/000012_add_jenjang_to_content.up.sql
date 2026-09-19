-- 000012_add_jenjang_to_content.up.sql
-- Pisahkan paket induk (modul pembelajaran, paket latihan, paket tryout) berdasarkan jenjang pendidikan.
-- Materi dan soal tidak diberi label jenjang karena mengikuti paket/modul induknya.
-- Nilai jenjang: sd | smp | sma | smk. Default 'sma'.

ALTER TABLE learning_modules ADD COLUMN IF NOT EXISTS jenjang VARCHAR(20) NOT NULL DEFAULT 'sma';
ALTER TABLE practice_packages ADD COLUMN IF NOT EXISTS jenjang VARCHAR(20) NOT NULL DEFAULT 'sma';
ALTER TABLE tryouts ADD COLUMN IF NOT EXISTS jenjang VARCHAR(20) NOT NULL DEFAULT 'sma';

-- Override jenjang eksplisit siswa (misal gap year) di student_profiles.
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS jenjang VARCHAR(20);

-- Bersihkan jika sebelumnya sempat terbuat di materials / questions
ALTER TABLE materials DROP COLUMN IF EXISTS jenjang;
ALTER TABLE questions DROP COLUMN IF EXISTS jenjang;

CREATE INDEX IF NOT EXISTS idx_learning_modules_jenjang ON learning_modules(jenjang);
CREATE INDEX IF NOT EXISTS idx_practice_packages_jenjang ON practice_packages(jenjang);
CREATE INDEX IF NOT EXISTS idx_tryouts_jenjang ON tryouts(jenjang);
