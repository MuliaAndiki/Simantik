import { describe, expect, it } from 'bun:test';
import type { SchoolResponse } from '@/types/service';
import {
  buildProposeSchoolHref,
  formatSchoolLevelLabel,
  mergeSelectableSchools,
  normalizeSchoolLevel,
  resolveJenjangChangeState,
} from './school-picker.util';

const makeSchool = (overrides: Partial<SchoolResponse>): SchoolResponse => ({
  id: 'sch-default',
  npsn: '20200001',
  nama: 'SMA Negeri Default',
  jenjang: 'sma',
  status: 'negeri',
  logo: null,
  alamat: 'Jl. Pendidikan No. 1',
  provinsi: 'Jawa Barat',
  kabupaten: 'Bandung',
  kecamatan: 'Coblong',
  latitude: -6.89,
  longitude: 107.61,
  verificationStatus: 'verified',
  createdAt: '2026-11-13T00:00:00Z',
  updatedAt: '2026-11-13T00:00:00Z',
  ...overrides,
});

describe('school-picker.util', () => {
  describe('mergeSelectableSchools', () => {
    it('merges non-rejected personal submissions and deduplicates public schools', () => {
      const publicList = [
        makeSchool({ id: 'pub-1', nama: 'SMAN 1 Bandung', npsn: '20219271', jenjang: 'sma' }),
        makeSchool({ id: 'shared-1', nama: 'SMKN 1 Cimahi', npsn: '20224136', jenjang: 'smk' }),
      ];
      const submissions = [
        makeSchool({
          id: 'pending-1',
          nama: 'SMP Harapan Kita',
          npsn: '20299999',
          jenjang: 'smp',
          verificationStatus: 'pending',
        }),
        makeSchool({
          id: 'rejected-1',
          nama: 'SD Ditolak',
          npsn: '20288888',
          jenjang: 'sd',
          verificationStatus: 'rejected',
        }),
        makeSchool({
          id: 'shared-1',
          nama: 'SMKN 1 Cimahi',
          npsn: '20224136',
          jenjang: 'smk',
          verificationStatus: 'verified',
        }),
      ];

      const merged = mergeSelectableSchools(publicList, submissions, {
        jenjang: 'all',
        search: '',
      });
      expect(merged.map((item) => item.id)).toEqual(['pending-1', 'shared-1', 'pub-1']);
    });

    it('filters personal submissions by active jenjang and search keyword', () => {
      const submissions = [
        makeSchool({
          id: 'sub-sma',
          nama: 'SMA Mandiri Bangsa',
          npsn: '20270001',
          jenjang: 'sma',
          verificationStatus: 'pending',
        }),
        makeSchool({
          id: 'sub-smp',
          nama: 'SMP Mandiri Bangsa',
          npsn: '20270002',
          jenjang: 'smp',
          verificationStatus: 'pending',
        }),
      ];

      const onlySma = mergeSelectableSchools([], submissions, {
        jenjang: 'sma',
        search: 'mandiri',
      });
      expect(onlySma.map((s) => s.id)).toEqual(['sub-sma']);

      const byNpsn = mergeSelectableSchools([], submissions, {
        jenjang: 'all',
        search: '20270002',
      });
      expect(byNpsn.map((s) => s.id)).toEqual(['sub-smp']);
    });
  });

  describe('buildProposeSchoolHref', () => {
    it('builds proposal URL with query, jenjang, and safe returnTo', () => {
      expect(
        buildProposeSchoolHref({
          query: ' SMAN 99 ',
          jenjang: 'sma',
          returnTo: '/student/profile',
        })
      ).toBe('/pilih-sekolah/ajukan?q=SMAN+99&jenjang=sma&returnTo=%2Fstudent%2Fprofile');
    });

    it('omits jenjang=all and ignores protocol-relative unsafe returnTo', () => {
      expect(
        buildProposeSchoolHref({
          query: '',
          jenjang: 'all',
          returnTo: '//evil.example',
        })
      ).toBe('/pilih-sekolah/ajukan');
    });

    it('uses resubmit id instead of q/jenjang when resubmitting rejected school', () => {
      expect(
        buildProposeSchoolHref({
          resubmitId: 'sch-rejected',
          query: 'ignored',
          jenjang: 'smk',
          returnTo: '/student/profile',
        })
      ).toBe('/pilih-sekolah/ajukan?resubmit=sch-rejected&returnTo=%2Fstudent%2Fprofile');
    });
  });

  describe('normalizeSchoolLevel & formatSchoolLevelLabel', () => {
    it('normalizes valid school levels case-insensitively and rejects invalid values', () => {
      expect(normalizeSchoolLevel(' SMA ')).toBe('sma');
      expect(normalizeSchoolLevel('smk')).toBe('smk');
      expect(normalizeSchoolLevel('invalid')).toBeUndefined();
      expect(normalizeSchoolLevel(null)).toBeUndefined();
    });

    it('formats valid and empty school levels cleanly', () => {
      expect(formatSchoolLevelLabel('smp')).toBe('SMP');
      expect(formatSchoolLevelLabel('Smk')).toBe('SMK');
      expect(formatSchoolLevelLabel('')).toBe('');
      expect(formatSchoolLevelLabel(undefined)).toBe('');
    });
  });

  describe('resolveJenjangChangeState', () => {
    it('detects when student switches between two valid levels', () => {
      expect(
        resolveJenjangChangeState({
          baselineJenjang: 'sma',
          targetJenjang: 'smp',
        })
      ).toEqual({
        previousJenjang: 'sma',
        nextJenjang: 'smp',
        isChangingJenjang: true,
      });
    });

    it('returns isChangingJenjang=false when case differs only or first-time setup', () => {
      expect(
        resolveJenjangChangeState({
          baselineJenjang: 'sma',
          targetJenjang: 'SMA',
        })
      ).toEqual({
        previousJenjang: 'sma',
        nextJenjang: 'sma',
        isChangingJenjang: false,
      });

      expect(
        resolveJenjangChangeState({
          baselineJenjang: undefined,
          targetJenjang: 'sma',
        })
      ).toEqual({
        previousJenjang: undefined,
        nextJenjang: 'sma',
        isChangingJenjang: false,
      });
    });
  });
});
