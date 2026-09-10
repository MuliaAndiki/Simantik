import { describe, expect, it } from 'bun:test';
import { camelCaseToWords, kebabCaseToWords } from './string.format';

describe('string.format', () => {
  describe('camelCaseToWords', () => {
    it('converts camelCase string to spaced words with first letter capitalized', () => {
      expect(camelCaseToWords('userName')).toBe('User Name');
      expect(camelCaseToWords('totalQuestionCount')).toBe('Total Question Count');
    });
  });

  describe('kebabCaseToWords', () => {
    it('converts kebab-case to title words', () => {
      expect(kebabCaseToWords('try-out-session')).toBe('Try Out Session');
      expect(kebabCaseToWords('user/profile')).toBe('User Profile');
    });
  });
});
