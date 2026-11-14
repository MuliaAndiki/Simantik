import type { SchoolLevel, SchoolResponse, SchoolVerificationStatus } from '@/types/service';

export type SchoolLevelFilterValue = 'all' | SchoolLevel;

export interface SchoolLevelFilterOption {
  value: SchoolLevelFilterValue;
  label: string;
}

export interface SchoolLevelOption {
  value: SchoolLevel;
  label: string;
}

export const SCHOOL_LEVEL_OPTIONS: ReadonlyArray<SchoolLevelOption> = [
  { value: 'sd', label: 'SD' },
  { value: 'smp', label: 'SMP' },
  { value: 'sma', label: 'SMA' },
  { value: 'smk', label: 'SMK' },
];

export const SCHOOL_LEVEL_FILTER_OPTIONS: ReadonlyArray<SchoolLevelFilterOption> = [
  { value: 'all', label: 'Semua' },
  ...SCHOOL_LEVEL_OPTIONS,
];

export interface SelectableSchoolItem {
  id: string;
  nama: string;
  npsn: string;
  jenjang: string;
  verificationStatus?: SchoolVerificationStatus;
}

/** Mengubah response sekolah penuh menjadi item ringkas untuk komponen pemilih sekolah. */
export function toSelectableSchoolItem(school: SchoolResponse): SelectableSchoolItem {
  return {
    id: school.id,
    nama: school.nama,
    npsn: school.npsn,
    jenjang: school.jenjang,
    verificationStatus: school.verificationStatus,
  };
}

/**
 * Menggabungkan sekolah publik terverifikasi dengan pengajuan pribadi (non-rejected)
 * milik siswa tanpa duplikasi, sembari menghormati filter jenjang & kata kunci aktif.
 */
export function mergeSelectableSchools(
  publicSchools: ReadonlyArray<SchoolResponse> | undefined,
  mySubmissions: ReadonlyArray<SchoolResponse> | undefined,
  filter?: { search?: string; jenjang?: SchoolLevelFilterValue }
): SelectableSchoolItem[] {
  const normalizedSearch = filter?.search?.trim().toLowerCase() ?? '';
  const targetJenjang = filter?.jenjang && filter.jenjang !== 'all' ? filter.jenjang : undefined;

  const optionMap = new Map<string, SelectableSchoolItem>();

  for (const sub of mySubmissions ?? []) {
    if (sub.verificationStatus === 'rejected') continue;
    if (targetJenjang && sub.jenjang?.toLowerCase() !== targetJenjang) continue;
    if (
      normalizedSearch &&
      !sub.nama.toLowerCase().includes(normalizedSearch) &&
      !sub.npsn.toLowerCase().includes(normalizedSearch)
    ) {
      continue;
    }
    optionMap.set(sub.id, toSelectableSchoolItem(sub));
  }

  for (const school of publicSchools ?? []) {
    if (!optionMap.has(school.id)) {
      optionMap.set(school.id, toSelectableSchoolItem(school));
    }
  }

  return Array.from(optionMap.values());
}

/** Menyusun URL halaman pengajuan sekolah dengan membawa seed pencarian, jenjang, dan returnTo. */
export function buildProposeSchoolHref(params: {
  returnTo?: string;
  query?: string;
  jenjang?: SchoolLevelFilterValue;
  resubmitId?: string;
}): string {
  const sp = new URLSearchParams();

  if (params.resubmitId?.trim()) {
    sp.set('resubmit', params.resubmitId.trim());
  } else {
    if (params.query?.trim()) {
      sp.set('q', params.query.trim());
    }
    if (params.jenjang && params.jenjang !== 'all') {
      sp.set('jenjang', params.jenjang);
    }
  }

  if (params.returnTo?.startsWith('/') && !params.returnTo.startsWith('//')) {
    sp.set('returnTo', params.returnTo);
  }

  const qs = sp.toString();
  return qs ? `/pilih-sekolah/ajukan?${qs}` : '/pilih-sekolah/ajukan';
}

const VALID_SCHOOL_LEVELS = new Set<SchoolLevel>(SCHOOL_LEVEL_OPTIONS.map((opt) => opt.value));

/** Menormalisasi string jenjang ke union `SchoolLevel` yang valid bila tersedia. */
export function normalizeSchoolLevel(level?: string | null): SchoolLevel | undefined {
  const normalized = level?.trim().toLowerCase();
  if (!normalized) return undefined;
  return VALID_SCHOOL_LEVELS.has(normalized as SchoolLevel)
    ? (normalized as SchoolLevel)
    : undefined;
}

/** Mengubah kode jenjang menjadi label tampilan standar huruf kapital (mis. `SMA`). */
export function formatSchoolLevelLabel(level?: string | null): string {
  const normalized = normalizeSchoolLevel(level);
  if (normalized) return normalized.toUpperCase();
  return level?.trim().toUpperCase() ?? '';
}

/** Menentukan status transisi jenjang siswa antara kondisi tersimpan dan pilihan baru. */
export function resolveJenjangChangeState(params: {
  baselineJenjang?: string | null;
  targetJenjang?: string | null;
}): {
  previousJenjang: SchoolLevel | undefined;
  nextJenjang: SchoolLevel | undefined;
  isChangingJenjang: boolean;
} {
  const previousJenjang = normalizeSchoolLevel(params.baselineJenjang);
  const nextJenjang = normalizeSchoolLevel(params.targetJenjang);

  return {
    previousJenjang,
    nextJenjang,
    isChangingJenjang: Boolean(previousJenjang && nextJenjang && previousJenjang !== nextJenjang),
  };
}
