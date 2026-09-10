import { describe, expect, it } from 'bun:test';
import { buildQueryString } from './query-string.util';

describe('buildQueryString', () => {
  it('returns original path when params is undefined or empty', () => {
    expect(buildQueryString('/api/test')).toBe('/api/test');
    expect(buildQueryString('/api/test', {})).toBe('/api/test');
  });

  it('appends query string for valid parameters', () => {
    const result = buildQueryString('/api/users', { search: 'john', limit: 10 });
    expect(result).toBe('/api/users?search=john&limit=10');
  });

  it('filters out undefined, null, and empty string parameters', () => {
    const result = buildQueryString('/api/users', {
      search: 'alice',
      status: undefined,
      role: null,
      empty: '',
      offset: 0,
    });
    expect(result).toBe('/api/users?search=alice&offset=0');
  });
});
