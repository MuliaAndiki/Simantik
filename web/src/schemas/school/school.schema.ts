import { z } from 'zod';

export const proposeSchoolSchema = z.object({
  npsn: z
    .string()
    .trim()
    .min(5, 'NPSN minimal 5 karakter')
    .max(20, 'NPSN maksimal 20 karakter')
    .regex(/^[A-Za-z0-9-]+$/, 'NPSN hanya boleh berisi huruf, angka, atau tanda hubung'),
  nama: z
    .string()
    .trim()
    .min(2, 'Nama sekolah minimal 2 karakter')
    .max(255, 'Nama sekolah maksimal 255 karakter'),
  jenjang: z.enum(['sd', 'smp', 'sma', 'smk']),
  status: z.enum(['negeri', 'swasta']),
  alamat: z
    .string()
    .trim()
    .min(5, 'Alamat lengkap minimal 5 karakter')
    .max(500, 'Alamat maksimal 500 karakter'),
  provinsi: z.string().trim().max(100, 'Provinsi maksimal 100 karakter').optional().default(''),
  kabupaten: z
    .string()
    .trim()
    .max(100, 'Kabupaten/Kota maksimal 100 karakter')
    .optional()
    .default(''),
  kecamatan: z.string().trim().max(100, 'Kecamatan maksimal 100 karakter').optional().default(''),
  latitude: z
    .number({
      required_error: 'Pilih lokasi sekolah pada peta terlebih dahulu',
      invalid_type_error: 'Pilih lokasi sekolah pada peta terlebih dahulu',
    })
    .min(-11, 'Koordinat lintang harus berada di wilayah Indonesia')
    .max(6, 'Koordinat lintang harus berada di wilayah Indonesia'),
  longitude: z
    .number({
      required_error: 'Pilih lokasi sekolah pada peta terlebih dahulu',
      invalid_type_error: 'Pilih lokasi sekolah pada peta terlebih dahulu',
    })
    .min(95, 'Koordinat bujur harus berada di wilayah Indonesia')
    .max(141, 'Koordinat bujur harus berada di wilayah Indonesia'),
});

export const rejectSchoolSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, 'Alasan penolakan minimal 5 karakter')
    .max(500, 'Alasan penolakan maksimal 500 karakter'),
});

export type ProposeSchoolFormData = z.infer<typeof proposeSchoolSchema>;
export type RejectSchoolFormData = z.infer<typeof rejectSchoolSchema>;
