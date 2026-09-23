-- 000013_drop_tryout_total_questions.up.sql
-- Total soal tryout tidak lagi disimpan manual; dihitung dari jumlah soal pada
-- pool tryout_questions. Kolom total_questions pada tryouts dihapus.

ALTER TABLE tryouts DROP COLUMN IF EXISTS total_questions;
