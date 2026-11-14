import { z } from 'zod';

const baseSchoolFields = {
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
};

const createIndonesiaLatSchema = (missingMessage: string) =>
  z
    .number({
      required_error: missingMessage,
      invalid_type_error: missingMessage,
    })
    .min(-11, 'Koordinat lintang harus berada di wilayah Indonesia')
    .max(6, 'Koordinat lintang harus berada di wilayah Indonesia');

const createIndonesiaLngSchema = (missingMessage: string) =>
  z
    .number({
      required_error: missingMessage,
      invalid_type_error: missingMessage,
    })
    .min(95, 'Koordinat bujur harus berada di wilayah Indonesia')
    .max(141, 'Koordinat bujur harus berada di wilayah Indonesia');

export const proposeSchoolSchema = z.object({
  ...baseSchoolFields,
  latitude: createIndonesiaLatSchema('Pilih lokasi sekolah pada peta terlebih dahulu'),
  longitude: createIndonesiaLngSchema('Pilih lokasi sekolah pada peta terlebih dahulu'),
});

export const adminSchoolSchema = z
  .object({
    ...baseSchoolFields,
    latitude: createIndonesiaLatSchema('Latitude harus berupa angka yang valid').nullish(),
    longitude: createIndonesiaLngSchema('Longitude harus berupa angka yang valid').nullish(),
  })
  .superRefine((data, ctx) => {
    const hasLat = typeof data.latitude === 'number';
    const hasLng = typeof data.longitude === 'number';
    if (hasLat === hasLng) return;

    if (!hasLat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['latitude'],
        message: 'Latitude wajib diisi jika Longitude terisi',
      });
    }
    if (!hasLng) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['longitude'],
        message: 'Longitude wajib diisi jika Latitude terisi',
      });
    }
  });

export const rejectSchoolSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, 'Alasan penolakan minimal 5 karakter')
    .max(500, 'Alasan penolakan maksimal 500 karakter'),
});

export type ProposeSchoolFormData = z.infer<typeof proposeSchoolSchema>;
export type AdminSchoolFormData = z.infer<typeof adminSchoolSchema>;
export type RejectSchoolFormData = z.infer<typeof rejectSchoolSchema>;
