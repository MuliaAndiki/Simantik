import { describe, expect, it } from 'bun:test';
import type { SchoolResponse } from '@/types/service';
import {
  buildSchoolProposalInitialForm,
  EMPTY_SCHOOL_FORM,
  validateProposeSchoolForm,
} from './school-proposal.util';

describe('school-proposal.util', () => {
  describe('buildSchoolProposalInitialForm', () => {
    it('returns empty default form when no seed is provided', () => {
      expect(buildSchoolProposalInitialForm()).toEqual(EMPTY_SCHOOL_FORM);
    });

    it('seeds npsn when search string is numeric (>= 3 digits)', () => {
      const form = buildSchoolProposalInitialForm(' 20219876 ');
      expect(form.npsn).toBe('20219876');
      expect(form.nama).toBe('');
    });

    it('seeds nama when search string is text', () => {
      const form = buildSchoolProposalInitialForm('SMA Nusantara 1');
      expect(form.nama).toBe('SMA Nusantara 1');
      expect(form.npsn).toBe('');
    });

    it('pre-populates fields from a rejected SchoolResponse for resubmission', () => {
      const rejectedSchool: SchoolResponse = {
        id: 'sch-1',
        npsn: '20219999',
        nama: 'SMK Harapan Bangsa',
        jenjang: 'SMK',
        status: 'Swasta',
        logo: null,
        alamat: 'Jl. Merdeka No. 10',
        provinsi: 'Jawa Barat',
        kabupaten: 'Bandung',
        kecamatan: 'Coblong',
        verificationStatus: 'rejected',
        rejectionReason: 'Alamat kurang lengkap',
        createdAt: '2026-11-13T00:00:00Z',
        updatedAt: '2026-11-13T00:00:00Z',
      };

      const form = buildSchoolProposalInitialForm(rejectedSchool);
      expect(form).toEqual({
        npsn: '20219999',
        nama: 'SMK Harapan Bangsa',
        jenjang: 'smk',
        status: 'swasta',
        alamat: 'Jl. Merdeka No. 10',
        provinsi: 'Jawa Barat',
        kabupaten: 'Bandung',
        kecamatan: 'Coblong',
      });
    });
  });

  describe('validateProposeSchoolForm', () => {
    it('returns sanitized ProposeSchoolRequest when valid', () => {
      const result = validateProposeSchoolForm({
        npsn: ' 20219876 ',
        nama: ' SMA Negeri 1 Uji ',
        jenjang: 'sma',
        status: 'negeri',
        alamat: ' Jl. Pendidikan No. 1 ',
        provinsi: '  ',
        kabupaten: ' Kota Bandung ',
        kecamatan: '',
      });

      expect(result.errors).toBeUndefined();
      expect(result.data).toEqual({
        npsn: '20219876',
        nama: 'SMA Negeri 1 Uji',
        jenjang: 'sma',
        status: 'negeri',
        alamat: 'Jl. Pendidikan No. 1',
        provinsi: undefined,
        kabupaten: 'Kota Bandung',
        kecamatan: undefined,
      });
    });

    it('returns field-level validation errors for invalid inputs', () => {
      const result = validateProposeSchoolForm({
        ...EMPTY_SCHOOL_FORM,
        npsn: '12',
        nama: 'A',
        alamat: 'Jl.',
      });

      expect(result.data).toBeUndefined();
      expect(result.errors?.npsn).toBeDefined();
      expect(result.errors?.nama).toBeDefined();
      expect(result.errors?.alamat).toBeDefined();
    });
  });
});
