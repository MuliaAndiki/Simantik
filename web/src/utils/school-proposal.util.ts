import type {
  SchoolFormErrors,
  SchoolFormState,
} from '@/components/molecules/school/SchoolFormFields';
import { adminSchoolSchema, proposeSchoolSchema } from '@/schemas/school/school.schema';
import type {
  CreateSchoolRequest,
  GeoPlace,
  ProposeSchoolRequest,
  SchoolLevel,
  SchoolResponse,
  SchoolStatusType,
} from '@/types/service';

export const EMPTY_SCHOOL_FORM: SchoolFormState = {
  npsn: '',
  nama: '',
  jenjang: 'sma',
  status: 'negeri',
  alamat: '',
  provinsi: '',
  kabupaten: '',
  kecamatan: '',
  latitude: null,
  longitude: null,
};

/**
 * Menebak jenjang pendidikan dari nama sekolah (tetap dapat diubah manual oleh user).
 */
export function guessSchoolLevel(name: string): SchoolLevel {
  const normalized = name.toLowerCase();
  if (/\bsmk[a-z0-9]*\b|\bsekolah menengah kejuruan\b/.test(normalized)) {
    return 'smk';
  }
  if (/\b(smp[a-z0-9]*|mts[a-z0-9]*)\b|\bsekolah menengah pertama\b/.test(normalized)) {
    return 'smp';
  }
  if (/\b(sd[a-z0-9]*|min|mis|mi)\b|\b(sekolah dasar|madrasah ibtidaiyah)\b/.test(normalized)) {
    return 'sd';
  }
  return 'sma';
}

/**
 * Menebak status negeri/swasta dari nama sekolah (tetap dapat diubah manual oleh user).
 */
export function guessSchoolStatus(name: string): SchoolStatusType {
  const normalized = name.toLowerCase();
  if (/\bswasta\b/.test(normalized)) {
    return 'swasta';
  }
  if (
    /\b(negeri|sman|smpn|sdn|smkn|man|mtsn|min)\b|\bsma\s+n\b|\bsmp\s+n\b|\bsd\s+n\b|\bsmk\s+n\b/.test(
      normalized
    )
  ) {
    return 'negeri';
  }
  return 'swasta';
}

/**
 * Mengonversi hasil Nominatim/geo menjadi patch form pengajuan sekolah.
 * Alamat lengkap & NPSN sengaja tidak diisi otomatis agar tetap diverifikasi user.
 */
export function placeToFormPatch(
  place: GeoPlace,
  options?: { fillName?: boolean }
): Partial<SchoolFormState> {
  const patch: Partial<SchoolFormState> = {
    latitude: Number(place.latitude.toFixed(6)),
    longitude: Number(place.longitude.toFixed(6)),
    provinsi: place.provinsi || '',
    kabupaten: place.kabupaten || '',
    kecamatan: place.kecamatan || '',
  };

  if (options?.fillName && place.name?.trim()) {
    const cleanName = place.name.trim();
    patch.nama = cleanName;
    patch.jenjang = guessSchoolLevel(cleanName);
    patch.status = guessSchoolStatus(cleanName);
  }

  return patch;
}

/**
 * Membangun initial form state pengajuan sekolah dari query pencarian
 * atau data pengajuan sebelumnya yang ditolak (untuk ajukan ulang).
 */
export function buildSchoolProposalInitialForm(seed?: string | SchoolResponse): SchoolFormState {
  if (!seed) {
    return { ...EMPTY_SCHOOL_FORM };
  }

  if (typeof seed !== 'string') {
    const jenjang = (
      ['sd', 'smp', 'sma', 'smk'].includes(seed.jenjang?.toLowerCase())
        ? seed.jenjang.toLowerCase()
        : 'sma'
    ) as SchoolLevel;
    const status = (
      seed.status?.toLowerCase() === 'swasta' ? 'swasta' : 'negeri'
    ) as SchoolStatusType;

    return {
      npsn: seed.npsn || '',
      nama: seed.nama || '',
      jenjang,
      status,
      alamat: seed.alamat || '',
      provinsi: seed.provinsi || '',
      kabupaten: seed.kabupaten || '',
      kecamatan: seed.kecamatan || '',
      latitude: typeof seed.latitude === 'number' ? seed.latitude : null,
      longitude: typeof seed.longitude === 'number' ? seed.longitude : null,
    };
  }

  const trimmed = seed.trim();
  if (/^\d{3,}$/.test(trimmed)) {
    return { ...EMPTY_SCHOOL_FORM, npsn: trimmed };
  }
  return { ...EMPTY_SCHOOL_FORM, nama: trimmed };
}

function extractSchoolFieldErrors(
  issues: ReadonlyArray<{ path: (string | number)[]; message: string }>
): SchoolFormErrors {
  const errors: SchoolFormErrors = {};
  for (const issue of issues) {
    const field = issue.path[0] as keyof SchoolFormState | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

/**
 * Validasi payload pengajuan sekolah siswa menggunakan Zod schema terpusat (wajib koordinat).
 */
export function validateProposeSchoolForm(form: SchoolFormState): {
  data?: ProposeSchoolRequest;
  errors?: SchoolFormErrors;
} {
  const parsed = proposeSchoolSchema.safeParse(form);
  if (!parsed.success) {
    return { errors: extractSchoolFieldErrors(parsed.error.issues) };
  }

  const val = parsed.data;
  return {
    data: {
      npsn: val.npsn,
      nama: val.nama,
      jenjang: val.jenjang,
      status: val.status,
      alamat: val.alamat,
      provinsi: val.provinsi || undefined,
      kabupaten: val.kabupaten || undefined,
      kecamatan: val.kecamatan || undefined,
      latitude: val.latitude,
      longitude: val.longitude,
    },
  };
}

/**
 * Validasi payload form sekolah Admin menggunakan Zod schema (koordinat opsional berpasangan).
 */
export function validateAdminSchoolForm(form: SchoolFormState): {
  data?: CreateSchoolRequest;
  errors?: SchoolFormErrors;
} {
  const parsed = adminSchoolSchema.safeParse(form);
  if (!parsed.success) {
    return { errors: extractSchoolFieldErrors(parsed.error.issues) };
  }

  const val = parsed.data;
  return {
    data: {
      npsn: val.npsn,
      nama: val.nama,
      jenjang: val.jenjang,
      status: val.status,
      alamat: val.alamat,
      provinsi: val.provinsi || undefined,
      kabupaten: val.kabupaten || undefined,
      kecamatan: val.kecamatan || undefined,
      latitude: typeof val.latitude === 'number' ? val.latitude : undefined,
      longitude: typeof val.longitude === 'number' ? val.longitude : undefined,
    },
  };
}
