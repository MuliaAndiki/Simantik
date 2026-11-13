import { describe, expect, it } from 'bun:test';
import {
  buildSchoolSkipKey,
  computeSchoolSkipUntil,
  isSchoolSkipActive,
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
});
