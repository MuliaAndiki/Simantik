import { describe, expect, test } from 'bun:test';
import {
  countByStatus,
  formatItemNumber,
  mapApiStatusToUi,
  mapStatusFilterToApi,
  publishedPct,
} from './list-summary.util';

describe('mapApiStatusToUi', () => {
  test('maps known statuses', () => {
    expect(mapApiStatusToUi('published')).toBe('PUBLISHED');
    expect(mapApiStatusToUi('PUBLISHED')).toBe('PUBLISHED');
    expect(mapApiStatusToUi('archived')).toBe('UNPUBLISHED');
    expect(mapApiStatusToUi('unpublished')).toBe('UNPUBLISHED');
    expect(mapApiStatusToUi('draft')).toBe('DRAFT');
    expect(mapApiStatusToUi('review')).toBe('DRAFT');
    expect(mapApiStatusToUi(undefined)).toBe('DRAFT');
  });
});

describe('mapStatusFilterToApi', () => {
  test('maps UI filter labels', () => {
    expect(mapStatusFilterToApi('Published')).toBe('published');
    expect(mapStatusFilterToApi('Draft')).toBe('draft');
    expect(mapStatusFilterToApi('Unpublished')).toBe('archived');
    expect(mapStatusFilterToApi('Semua Status')).toBeUndefined();
  });
});

describe('countByStatus', () => {
  const items = [
    { status: 'published' },
    { status: 'PUBLISHED' },
    { status: 'archived' },
    { status: 'draft' },
    { status: 'review' },
    {},
  ];
  test('counts default mapping', () => {
    expect(countByStatus(items, (i) => (i as { status?: string }).status)).toEqual({
      draft: 3,
      published: 2,
      unpublished: 1,
      total: 6,
    });
  });
  test('supports extraPublished', () => {
    const withActive = [...items, { status: 'active' }];
    expect(countByStatus(withActive, (i) => (i as { status?: string }).status, ['active'])).toEqual(
      { draft: 3, published: 3, unpublished: 1, total: 7 }
    );
  });
});

describe('publishedPct', () => {
  test('computes percentage and guards zero', () => {
    expect(publishedPct(1, 4)).toBe(25);
    expect(publishedPct(0, 0)).toBe(0);
  });
});

describe('formatItemNumber', () => {
  test('numbers across pages', () => {
    expect(formatItemNumber(1, 10, 0)).toBe('01');
    expect(formatItemNumber(2, 10, 0)).toBe('11');
  });
});
