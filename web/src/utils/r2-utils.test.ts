import { describe, expect, it } from 'bun:test';
import { extractR2KeyFromUrl, getR2PublicBaseUrl } from './r2-url.util';

describe('r2-utils', () => {
  describe('getR2PublicBaseUrl', () => {
    it('cleans trailing slashes from domain url', () => {
      const originalEnv = process.env.NEXT_PUBLIC_R2_URL;
      try {
        process.env.NEXT_PUBLIC_R2_URL = 'https://simantik.id/';
        expect(getR2PublicBaseUrl()).toBe('https://simantik.id');

        process.env.NEXT_PUBLIC_R2_URL = 'https://simantik.id///';
        expect(getR2PublicBaseUrl()).toBe('https://simantik.id');

        process.env.NEXT_PUBLIC_R2_URL = 'https://simantik.id';
        expect(getR2PublicBaseUrl()).toBe('https://simantik.id');
      } finally {
        process.env.NEXT_PUBLIC_R2_URL = originalEnv;
      }
    });

    it('returns empty string when env is empty', () => {
      const originalEnv = process.env.NEXT_PUBLIC_R2_URL;
      try {
        process.env.NEXT_PUBLIC_R2_URL = '';
        expect(getR2PublicBaseUrl()).toBe('');
      } finally {
        process.env.NEXT_PUBLIC_R2_URL = originalEnv;
      }
    });
  });

  describe('extractR2KeyFromUrl', () => {
    it('extracts key from custom domain https://simantik.id', () => {
      const url = 'https://simantik.id/avatars/1741999999-avatar.webp';
      expect(extractR2KeyFromUrl(url)).toBe('avatars/1741999999-avatar.webp');
    });

    it('extracts key from R2 dev domain', () => {
      const url = 'https://pub-2f811af54c344a96ad45cb28d7493156.r2.dev/news/header.webp';
      expect(extractR2KeyFromUrl(url)).toBe('news/header.webp');
    });

    it('extracts key from direct cloudflarestorage url with bucket prefix', () => {
      const url =
        'https://myaccount.r2.cloudflarestorage.com/simantik/materials/soal-simulasi.webp';
      expect(extractR2KeyFromUrl(url, 'simantik')).toBe('materials/soal-simulasi.webp');
    });

    it('handles nested folder structures correctly', () => {
      const url = 'https://simantik.id/tryouts/questions/stimulus/chart.png';
      expect(extractR2KeyFromUrl(url)).toBe('tryouts/questions/stimulus/chart.png');
    });
  });
});
