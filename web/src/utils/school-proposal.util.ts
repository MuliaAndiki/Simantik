import type {
  SchoolFormErrors,
  SchoolFormState,
} from '@/components/molecules/school/SchoolFormFields';
import { proposeSchoolSchema } from '@/schemas/school/school.schema';
import type {
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
};

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
    };
  }

  const trimmed = seed.trim();
  if (/^\d{3,}$/.test(trimmed)) {
    return { ...EMPTY_SCHOOL_FORM, npsn: trimmed };
  }
  return { ...EMPTY_SCHOOL_FORM, nama: trimmed };
}

/**
 * Validasi payload pengajuan sekolah menggunakan Zod schema terpusat.
 */
export function validateProposeSchoolForm(form: SchoolFormState): {
  data?: ProposeSchoolRequest;
  errors?: SchoolFormErrors;
} {
  const parsed = proposeSchoolSchema.safeParse(form);
  if (!parsed.success) {
    const errors: SchoolFormErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof SchoolFormState | undefined;
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    }
    return { errors };
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
    },
  };
}
