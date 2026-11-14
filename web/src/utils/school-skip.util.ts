const DAY_MS = 24 * 60 * 60 * 1000;

export const SCHOOL_SKIP_TTL_DAYS = 7;

export function buildSchoolSkipKey(userId: string): string {
  return `simantik_school_skipped_${userId}`;
}

export function computeSchoolSkipUntil(
  nowMs: number = Date.now(),
  days: number = SCHOOL_SKIP_TTL_DAYS
): number {
  return nowMs + days * DAY_MS;
}

export function isSchoolSkipActive(
  until: number | string | null | undefined,
  nowMs: number = Date.now()
): boolean {
  if (until === null || until === undefined) return false;
  const parsed = typeof until === 'string' ? Number(until) : until;
  if (!Number.isFinite(parsed)) return false;
  return parsed > nowMs;
}

export function markSchoolSkippedInStorage(userId?: string | null): void {
  if (typeof window === 'undefined' || !userId) return;
  try {
    window.localStorage.setItem(buildSchoolSkipKey(userId), String(computeSchoolSkipUntil()));
  } catch {
    // Ignore storage quota or private browsing errors
  }
}

export function hasActiveSchoolSkipInStorage(userId?: string | null): boolean {
  if (typeof window === 'undefined' || !userId) return false;
  try {
    const raw = window.localStorage.getItem(buildSchoolSkipKey(userId));
    return isSchoolSkipActive(raw);
  } catch {
    return false;
  }
}

export function clearSchoolSkipInStorage(userId?: string | null): void {
  if (typeof window === 'undefined' || !userId) return;
  try {
    window.localStorage.removeItem(buildSchoolSkipKey(userId));
  } catch {
    // Ignore storage quota or private browsing errors
  }
}
