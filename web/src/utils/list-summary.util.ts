/**
 * Helper bersama daftar paket (practice/tryout/materi).
 *
 * Pola yang sama muncul di PracticeListContainer, TryoutListContainer,
 * dan dashboard content_manager — dikumpulkan di sini agar beda
 * practice vs tryout hanya di query/mutasi/Page, bukan logika hitung.
 */

export type PackageUiStatus = 'PUBLISHED' | 'UNPUBLISHED' | 'DRAFT';

/** Status API (published/archived/draft/...) -> label UI. */
export function mapApiStatusToUi(status?: string | null): PackageUiStatus {
  const s = (status || '').toUpperCase();
  if (s === 'PUBLISHED') return 'PUBLISHED';
  if (s === 'UNPUBLISHED' || s === 'ARCHIVED') return 'UNPUBLISHED';
  return 'DRAFT';
}

/** Filter status UI ("Published"/"Draft"/"Unpublished") -> param API. */
export function mapStatusFilterToApi(filter: string): string | undefined {
  switch (filter) {
    case 'Published':
      return 'published';
    case 'Draft':
      return 'draft';
    case 'Unpublished':
      return 'archived';
    default:
      return undefined;
  }
}

export interface StatusCounts {
  draft: number;
  published: number;
  unpublished: number;
  total: number;
}

/** Hitung draft/published/unpublished dari list (loop identik di 3 kontainer). */
export function countByStatus<T>(
  items: readonly T[],
  getStatus: (item: T) => string | undefined | null,
  extraPublished: readonly string[] = []
): StatusCounts {
  let draft = 0;
  let published = 0;
  let unpublished = 0;
  const extra = new Set(extraPublished.map((s) => s.toLowerCase()));
  for (const item of items) {
    const s = (getStatus(item) || '').toLowerCase();
    if (s === 'published' || extra.has(s)) published++;
    else if (s === 'unpublished' || s === 'archived') unpublished++;
    else draft++;
  }
  return { draft, published, unpublished, total: items.length };
}

/** Persentase published dari total (0 bila total 0). */
export function publishedPct(published: number, total: number, digits = 1): number {
  if (total <= 0) return 0;
  return Number(((published / total) * 100).toFixed(digits));
}

/** Format tanggal id-ID + jam, dengan fallback bila kosong. */
export function formatDateTimeId(value?: string | null, fallback = 'Baru saja'): string {
  if (!value) return fallback;
  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Nomor urut 2-digit lintas halaman (page/perPage/idx). */
export function formatItemNumber(page: number, perPage: number, idx: number): string {
  return String((page - 1) * perPage + idx + 1).padStart(2, '0');
}

/** Unduh teks sebagai file (pola export ringkasan identik di 2 kontainer). */
export function downloadTextFile(filename: string, text: string): void {
  if (typeof document === 'undefined') return;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
