import { describe, expect, it } from 'bun:test';
import { buildStimulusQuestionMap, formatQuestionNumbers, getStimulusKey } from './stimulus.util';

describe('stimulus.util', () => {
  describe('formatQuestionNumbers', () => {
    it('formats single question number correctly', () => {
      const res = formatQuestionNumbers([5]);
      expect(res.shortRange).toBe('5');
      expect(res.fullList).toBe('5');
      expect(res.isMultiple).toBe(false);
    });

    it('formats two consecutive question numbers', () => {
      const res = formatQuestionNumbers([1, 2]);
      expect(res.shortRange).toBe('1–2');
      expect(res.fullList).toBe('1 dan 2');
      expect(res.isMultiple).toBe(true);
    });

    it('formats two non-consecutive question numbers', () => {
      const res = formatQuestionNumbers([1, 4]);
      expect(res.shortRange).toBe('1 & 4');
      expect(res.fullList).toBe('1 dan 4');
      expect(res.isMultiple).toBe(true);
    });

    it('formats three consecutive question numbers as range', () => {
      const res = formatQuestionNumbers([1, 2, 3]);
      expect(res.shortRange).toBe('1–3');
      expect(res.fullList).toBe('1, 2, dan 3');
      expect(res.isMultiple).toBe(true);
    });

    it('formats non-consecutive numbers properly', () => {
      const res = formatQuestionNumbers([1, 2, 5]);
      expect(res.shortRange).toBe('1, 2, & 5');
      expect(res.fullList).toBe('1, 2, dan 5');
      expect(res.isMultiple).toBe(true);
    });

    it('handles unsorted and duplicate numbers', () => {
      const res = formatQuestionNumbers([3, 1, 2, 1]);
      expect(res.shortRange).toBe('1–3');
      expect(res.fullList).toBe('1, 2, dan 3');
      expect(res.isMultiple).toBe(true);
    });

    it('handles empty or undefined numbers', () => {
      expect(formatQuestionNumbers([])).toEqual({
        shortRange: '',
        fullList: '',
        isMultiple: false,
      });
      expect(formatQuestionNumbers(undefined)).toEqual({
        shortRange: '',
        fullList: '',
        isMultiple: false,
      });
    });
  });

  describe('buildStimulusQuestionMap & getStimulusKey', () => {
    it('groups questions sharing the same stimulus id', () => {
      const questions = [
        { questionNumber: 1, stimulus: { id: 'stim-a', title: 'Teks A', content: 'Isi A' } },
        { questionNumber: 2, stimulus: { id: 'stim-a', title: 'Teks A', content: 'Isi A' } },
        { questionNumber: 3, stimulus: { id: 'stim-b', title: 'Teks B', content: 'Isi B' } },
        { questionNumber: 4, stimulus: null },
      ];

      const map = buildStimulusQuestionMap(questions);
      expect(map.get('stim-a')).toEqual([1, 2]);
      expect(map.get('stim-b')).toEqual([3]);
      expect(map.has('stim-c')).toBe(false);
    });

    it('groups questions sharing same title and content when id is missing', () => {
      const questions = [
        { questionNumber: 1, stimulus: { title: 'Wacana 1', content: 'Paragraf 1' } },
        { questionNumber: 2, stimulus: { title: 'Wacana 1', content: 'Paragraf 1' } },
      ];

      const key = getStimulusKey(questions[0].stimulus);
      expect(key).not.toBeNull();
      const map = buildStimulusQuestionMap(questions);
      expect(map.get(key!)).toEqual([1, 2]);
    });
  });
});
