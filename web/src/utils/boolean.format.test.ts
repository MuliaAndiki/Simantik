import { describe, expect, it } from 'bun:test';
import { GenderFormat } from './boolean.format';

describe('GenderFormat', () => {
  it('returns Pria for true', () => {
    expect(GenderFormat(true)).toBe('Pria');
  });

  it('returns Perempuan for false, undefined, or null', () => {
    expect(GenderFormat(false)).toBe('Perempuan');
    expect(GenderFormat(undefined)).toBe('Perempuan');
    expect(GenderFormat(null)).toBe('Perempuan');
  });
});
