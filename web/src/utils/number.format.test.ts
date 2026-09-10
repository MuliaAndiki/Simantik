import { describe, expect, it } from 'bun:test';
import { formatNumber } from './number.format';

describe('formatNumber', () => {
  it('formats regular numbers with commas', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
  });

  it('formats currency numbers with IDR', () => {
    const formatted = formatNumber(50000, true);
    expect(formatted).toContain('50,000');
    expect(formatted).toContain('IDR');
  });
});
