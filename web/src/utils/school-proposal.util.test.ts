import { describe, expect, it } from 'bun:test';
import type { GeoPlace, SchoolResponse } from '@/types/service';
import {
  buildSchoolProposalInitialForm,
  EMPTY_SCHOOL_FORM,
  guessSchoolLevel,
  guessSchoolStatus,
  placeToFormPatch,
  validateAdminSchoolForm,
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

    it('pre-populates fields and coordinates from a rejected SchoolResponse for resubmission', () => {
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
        latitude: -6.89021,
        longitude: 107.61314,
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
        latitude: -6.89021,
        longitude: 107.61314,
      });
    });
  });

  describe('guessSchoolLevel & guessSchoolStatus', () => {
    it('detects SD/MI, SMP/MTs, SMK, and SMA levels accurately', () => {
      expect(guessSchoolLevel('SDN 01 Menteng')).toBe('sd');
      expect(guessSchoolLevel('MIN 1 Jakarta')).toBe('sd');
      expect(guessSchoolLevel('SMPN 2 Surabaya')).toBe('smp');
      expect(guessSchoolLevel('MTsN 1 Malang')).toBe('smp');
      expect(guessSchoolLevel('SMKN 4 Yogyakarta')).toBe('smk');
      expect(guessSchoolLevel('SMAN 1 Bandung')).toBe('sma');
      expect(guessSchoolLevel('SMA Kristen Penabur')).toBe('sma');
    });

    it('detects Negeri vs Swasta status accurately', () => {
      expect(guessSchoolStatus('SMAN 1 Bandung')).toBe('negeri');
      expect(guessSchoolStatus('SMA Negeri 3 Jakarta')).toBe('negeri');
      expect(guessSchoolStatus('SMKN 2 Depok')).toBe('negeri');
      expect(guessSchoolStatus('SMA Kristen Penabur')).toBe('swasta');
      expect(guessSchoolStatus('SMK Swasta Nusantara')).toBe('swasta');
    });
  });

  describe('placeToFormPatch', () => {
    const samplePlace: GeoPlace = {
      name: 'SMAN 1 Bandung',
      displayName: 'SMAN 1 Bandung, Jalan Ir. H. Djuanda, Coblong, Kota Bandung, Jawa Barat',
      latitude: -6.89021234,
      longitude: 107.61314567,
      provinsi: 'Jawa Barat',
      kabupaten: 'Kota Bandung',
      kecamatan: 'Coblong',
    };

    it('fills name, inferred level/status, coords, and regions when fillName is true', () => {
      const patch = placeToFormPatch(samplePlace, { fillName: true });
      expect(patch).toEqual({
        nama: 'SMAN 1 Bandung',
        jenjang: 'sma',
        status: 'negeri',
        latitude: -6.890212,
        longitude: 107.613146,
        provinsi: 'Jawa Barat',
        kabupaten: 'Kota Bandung',
        kecamatan: 'Coblong',
      });
      expect(patch.alamat).toBeUndefined();
      expect(patch.npsn).toBeUndefined();
    });

    it('keeps nama untouched during reverse geocoding free map click', () => {
      const patch = placeToFormPatch(samplePlace, { fillName: false });
      expect(patch).toEqual({
        latitude: -6.890212,
        longitude: 107.613146,
        provinsi: 'Jawa Barat',
        kabupaten: 'Kota Bandung',
        kecamatan: 'Coblong',
      });
      expect(patch.nama).toBeUndefined();
    });
  });

  describe('validateProposeSchoolForm', () => {
    it('returns sanitized ProposeSchoolRequest with coordinates when valid', () => {
      const result = validateProposeSchoolForm({
        npsn: ' 20219876 ',
        nama: ' SMA Negeri 1 Uji ',
        jenjang: 'sma',
        status: 'negeri',
        alamat: ' Jl. Pendidikan No. 1 ',
        provinsi: '  ',
        kabupaten: ' Kota Bandung ',
        kecamatan: '',
        latitude: -6.890212,
        longitude: 107.613146,
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
        latitude: -6.890212,
        longitude: 107.613146,
      });
    });

    it('returns field-level validation errors including missing or out-of-Indonesia coordinates', () => {
      const missingCoords = validateProposeSchoolForm({
        ...EMPTY_SCHOOL_FORM,
        npsn: '12',
        nama: 'A',
        alamat: 'Jl.',
      });

      expect(missingCoords.data).toBeUndefined();
      expect(missingCoords.errors?.npsn).toBeDefined();
      expect(missingCoords.errors?.nama).toBeDefined();
      expect(missingCoords.errors?.alamat).toBeDefined();
      expect(missingCoords.errors?.latitude).toBeDefined();
      expect(missingCoords.errors?.longitude).toBeDefined();

      const outsideId = validateProposeSchoolForm({
        ...EMPTY_SCHOOL_FORM,
        npsn: '20219876',
        nama: 'Paris School',
        alamat: 'Jl. Luar Wilayah',
        latitude: 48.8566,
        longitude: 2.3522,
      });

      expect(outsideId.data).toBeUndefined();
      expect(outsideId.errors?.latitude).toBeDefined();
      expect(outsideId.errors?.longitude).toBeDefined();
    });
  });

  describe('validateAdminSchoolForm', () => {
    it('passes without coordinates for Admin manual entry', () => {
      const result = validateAdminSchoolForm({
        ...EMPTY_SCHOOL_FORM,
        npsn: ' 20219876 ',
        nama: ' SMA Negeri 1 Uji ',
        alamat: ' Jl. Pendidikan No. 1 ',
        provinsi: ' Jawa Barat ',
      });

      expect(result.errors).toBeUndefined();
      expect(result.data).toEqual({
        npsn: '20219876',
        nama: 'SMA Negeri 1 Uji',
        jenjang: 'sma',
        status: 'negeri',
        alamat: 'Jl. Pendidikan No. 1',
        provinsi: 'Jawa Barat',
        kabupaten: undefined,
        kecamatan: undefined,
        latitude: undefined,
        longitude: undefined,
      });
    });

    it('rejects half-pair coordinates when only latitude or longitude is provided', () => {
      const onlyLat = validateAdminSchoolForm({
        ...EMPTY_SCHOOL_FORM,
        npsn: '20219876',
        nama: 'SMA Negeri 1 Uji',
        alamat: 'Jl. Pendidikan No. 1',
        latitude: -6.890212,
        longitude: null,
      });

      expect(onlyLat.data).toBeUndefined();
      expect(onlyLat.errors?.longitude).toBeDefined();

      const onlyLng = validateAdminSchoolForm({
        ...EMPTY_SCHOOL_FORM,
        npsn: '20219876',
        nama: 'SMA Negeri 1 Uji',
        alamat: 'Jl. Pendidikan No. 1',
        latitude: null,
        longitude: 107.613146,
      });

      expect(onlyLng.data).toBeUndefined();
      expect(onlyLng.errors?.latitude).toBeDefined();
    });

    it('rejects out-of-Indonesia coordinates and accepts a valid Indonesia coordinate pair', () => {
      const outsideId = validateAdminSchoolForm({
        ...EMPTY_SCHOOL_FORM,
        npsn: '20219876',
        nama: 'Paris School',
        alamat: 'Jl. Luar Wilayah',
        latitude: 48.8566,
        longitude: 2.3522,
      });

      expect(outsideId.data).toBeUndefined();
      expect(outsideId.errors?.latitude).toBeDefined();
      expect(outsideId.errors?.longitude).toBeDefined();

      const validPair = validateAdminSchoolForm({
        ...EMPTY_SCHOOL_FORM,
        npsn: '20219876',
        nama: 'SMAN 1 Bandung',
        alamat: 'Jl. Ir. H. Juanda No. 93',
        latitude: -6.8859,
        longitude: 107.6131,
      });

      expect(validPair.errors).toBeUndefined();
      expect(validPair.data?.latitude).toBe(-6.8859);
      expect(validPair.data?.longitude).toBe(107.6131);
    });
  });
});
