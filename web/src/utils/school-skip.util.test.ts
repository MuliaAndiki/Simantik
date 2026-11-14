import { describe, expect, it } from 'bun:test';
import {
  buildSchoolSkipKey,
  clearSchoolSkipInStorage,
  computeSchoolSkipUntil,
  hasActiveSchoolSkipInStorage,
  isSchoolSkipActive,
  markSchoolSkippedInStorage,
  SCHOOL_SKIP_TTL_DAYS,
} from './school-skip.util';

describe('school-skip.util', () => {
  it('builds deterministic localStorage key per user', () => {
    expect(buildSchoolSkipKey('user-1')).toBe('simantik_school_skipped_user-1');
  });

  it('activates skip for 7 days and expires after the window', () => {
    const now = 1_700_000_000_000;
    const until = computeSchoolSkipUntil(now, SCHOOL_SKIP_TTL_DAYS);

    expect(isSchoolSkipActive(until, now)).toBe(true);
    expect(isSchoolSkipActive(String(until), now + 6 * 24 * 60 * 60 * 1000)).toBe(true);
    expect(isSchoolSkipActive(until, until)).toBe(false);
    expect(isSchoolSkipActive(until, until + 1)).toBe(false);
    expect(isSchoolSkipActive(null, now)).toBe(false);
    expect(isSchoolSkipActive('invalid', now)).toBe(false);
  });

  it('safely marks, checks, and clears localStorage skip entry when window exists', () => {
    const store = new Map<string, string>();
    const prevWindow = (globalThis as { window?: unknown }).window;
    (globalThis as { window: unknown }).window = {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => {
          store.set(k, v);
        },
        removeItem: (k: string) => {
          store.delete(k);
        },
      },
    };

    try {
      markSchoolSkippedInStorage('user-42');
      expect(hasActiveSchoolSkipInStorage('user-42')).toBe(true);
      clearSchoolSkipInStorage('user-42');
      expect(hasActiveSchoolSkipInStorage('user-42')).toBe(false);
    } finally {
      if (prevWindow === undefined) {
        delete (globalThis as { window?: unknown }).window;
      } else {
        (globalThis as { window: unknown }).window = prevWindow;
      }
    }
  });
});
