import { describe, expect, it } from 'bun:test';
import {
  ALL_COMPETENCY_FILTER_VALUE,
  clearDeletedCompetencyFromQuestions,
  DEFAULT_COMPETENCY_FALLBACK,
  findCompetencyById,
  mapCompetencyFilterValue,
  resetIdIfDeleted,
  resolveCompetencyName,
  UNCATEGORIZED_COMPETENCY_FILTER_VALUE,
} from './competency.util';

describe('competency.util', () => {
  describe('resolveCompetencyName', () => {
    it('returns trimmed name when non-empty and fallback otherwise', () => {
      expect(resolveCompetencyName('  Literasi Sains  ')).toBe('Literasi Sains');
      expect(resolveCompetencyName('')).toBe(DEFAULT_COMPETENCY_FALLBACK);
      expect(resolveCompetencyName('   ')).toBe(DEFAULT_COMPETENCY_FALLBACK);
      expect(resolveCompetencyName(null)).toBe(DEFAULT_COMPETENCY_FALLBACK);
      expect(resolveCompetencyName(undefined, 'Tanpa Kompetensi')).toBe('Tanpa Kompetensi');
    });
  });

  describe('mapCompetencyFilterValue', () => {
    it('maps all, uncategorized, and specific competency IDs accurately', () => {
      expect(mapCompetencyFilterValue(ALL_COMPETENCY_FILTER_VALUE)).toEqual({});
      expect(mapCompetencyFilterValue('all')).toEqual({});
      expect(mapCompetencyFilterValue('')).toEqual({});
      expect(mapCompetencyFilterValue(UNCATEGORIZED_COMPETENCY_FILTER_VALUE)).toEqual({
        uncategorized: true,
      });
      expect(mapCompetencyFilterValue('comp-123')).toEqual({ competency_id: 'comp-123' });
    });
  });

  describe('resetIdIfDeleted', () => {
    it('clears the id when matching the deleted id and preserves unrelated ids', () => {
      expect(resetIdIfDeleted('comp-1', 'comp-1')).toBe('');
      expect(resetIdIfDeleted('comp-1', 'comp-1', ALL_COMPETENCY_FILTER_VALUE)).toBe(
        ALL_COMPETENCY_FILTER_VALUE
      );
      expect(resetIdIfDeleted('comp-2', 'comp-1')).toBe('comp-2');
      expect(resetIdIfDeleted(null, 'comp-1')).toBe('');
    });
  });

  describe('clearDeletedCompetencyFromQuestions', () => {
    it('nullifies only matching question competencyId values', () => {
      const input = [
        { id: 'q1', competencyId: 'comp-1', questionText: 'Keep me 1' },
        { id: 'q2', competencyId: 'comp-2', questionText: 'Keep me 2' },
        { id: 'q3', questionText: 'Keep me 3' },
      ];
      const result = clearDeletedCompetencyFromQuestions(input, 'comp-1');
      expect(result).toEqual([
        { id: 'q1', competencyId: '', questionText: 'Keep me 1' },
        { id: 'q2', competencyId: 'comp-2', questionText: 'Keep me 2' },
        { id: 'q3', questionText: 'Keep me 3' },
      ]);
    });
  });

  describe('findCompetencyById', () => {
    it('finds matching competency safely', () => {
      const list = [
        { id: 'c1', name: 'Membaca' },
        { id: 'c2', name: 'Menulis' },
      ];
      expect(findCompetencyById(list, 'c2')).toEqual({ id: 'c2', name: 'Menulis' });
      expect(findCompetencyById(list, 'missing')).toBeUndefined();
      expect(findCompetencyById(list, null)).toBeUndefined();
    });
  });
});
