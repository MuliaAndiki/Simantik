import type { StimulusData } from '@/types/ui/practice.types';

/**
 * Menghasilkan kunci unik untuk stimulus guna mengelompokkan soal-soal
 * yang menggunakan bacaan/wacana yang sama.
 */
export function getStimulusKey(stimulus?: StimulusData | null): string | null {
  if (!stimulus) return null;
  if (stimulus.id) return String(stimulus.id);

  const title = (stimulus.title || '').trim().toLowerCase();
  const rawContent = stimulus.content;
  const content = (
    typeof rawContent === 'string'
      ? rawContent
      : Array.isArray(rawContent)
        ? rawContent.join('')
        : stimulus.quote || ''
  ).trim();

  if (!title && !content) return null;
  return `${title}:::${content}`;
}

/**
 * Membangun pemetaan (map) dari kunci stimulus ke daftar nomor soal yang menggunakannya.
 * Digunakan untuk menghitung relasi nomor soal secara dinamis.
 */
export function buildStimulusQuestionMap(
  questions: Array<{ questionNumber: number; stimulus?: StimulusData | null }>
): Map<string, number[]> {
  const map = new Map<string, number[]>();

  for (const q of questions) {
    const key = getStimulusKey(q.stimulus);
    if (!key) continue;

    const existing = map.get(key) || [];
    if (!existing.includes(q.questionNumber)) {
      existing.push(q.questionNumber);
    }
    map.set(key, existing);
  }

  // Urutkan nomor soal di setiap grup
  for (const [key, numbers] of map.entries()) {
    map.set(
      key,
      numbers.sort((a, b) => a - b)
    );
  }

  return map;
}

/**
 * Format representasi nomor-nomor soal dalam Bahasa Indonesia yang ramah pengguna.
 *
 * Contoh:
 * - [1, 2, 3] -> shortRange: "1–3", fullList: "1, 2, dan 3", isMultiple: true
 * - [1, 2, 4] -> shortRange: "1, 2, & 4", fullList: "1, 2, dan 4", isMultiple: true
 * - [1, 5]    -> shortRange: "1 & 5", fullList: "1 dan 5", isMultiple: true
 * - [2]       -> shortRange: "2", fullList: "2", isMultiple: false
 * - []        -> shortRange: "", fullList: "", isMultiple: false
 */
export function formatQuestionNumbers(numbers?: number[]): {
  shortRange: string;
  fullList: string;
  isMultiple: boolean;
} {
  if (!numbers || numbers.length === 0) {
    return { shortRange: '', fullList: '', isMultiple: false };
  }

  const sorted = Array.from(new Set(numbers)).sort((a, b) => a - b);

  if (sorted.length === 1) {
    const single = String(sorted[0]);
    return { shortRange: single, fullList: single, isMultiple: false };
  }

  if (sorted.length === 2) {
    const isConsecutive = sorted[1] === sorted[0] + 1;
    return {
      shortRange: isConsecutive ? `${sorted[0]}–${sorted[1]}` : `${sorted[0]} & ${sorted[1]}`,
      fullList: `${sorted[0]} dan ${sorted[1]}`,
      isMultiple: true,
    };
  }

  // 3 atau lebih nomor soal
  const isConsecutive = sorted.every((num, idx) => num === sorted[0] + idx);

  const shortRange = isConsecutive
    ? `${sorted[0]}–${sorted[sorted.length - 1]}`
    : `${sorted.slice(0, -1).join(', ')}, & ${sorted[sorted.length - 1]}`;

  const fullList = `${sorted.slice(0, -1).join(', ')}, dan ${sorted[sorted.length - 1]}`;

  return { shortRange, fullList, isMultiple: true };
}
