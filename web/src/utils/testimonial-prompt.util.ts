import type { TestimonialMyStatusResponse } from '@/types/service';

const DAY_MS = 24 * 60 * 60 * 1000;

export const TESTIMONIAL_SNOOZE_DAYS = 7;

export function buildTestimonialSnoozeKey(userId: string): string {
  return `simantik_testimonial_snooze_${userId}`;
}

export function computeSnoozeUntil(
  nowMs: number = Date.now(),
  days: number = TESTIMONIAL_SNOOZE_DAYS
): number {
  return nowMs + days * DAY_MS;
}

export function isSnoozed(
  until: number | string | null | undefined,
  nowMs: number = Date.now()
): boolean {
  if (until === null || until === undefined) return false;
  const parsed = typeof until === 'string' ? Number(until) : until;
  if (!Number.isFinite(parsed)) return false;
  return parsed > nowMs;
}

/**
 * Mencegah pop-up muncul saat student sedang aktif mengerjakan tryout atau latihan soal.
 * Halaman daftar (`/student/tryout`, `/student/practice`) dan halaman hasil (`/result`) tetap aman.
 */
export function isActiveAssessmentRoute(pathname?: string | null): boolean {
  if (!pathname) return false;
  const segments = pathname.split('/').filter(Boolean);
  return (
    segments.length === 3 &&
    segments[0] === 'student' &&
    (segments[1] === 'tryout' || segments[1] === 'practice')
  );
}

export function shouldShowTestimonialPrompt({
  status,
  snoozeUntil,
  pathname,
  nowMs = Date.now(),
}: {
  status?: TestimonialMyStatusResponse | null;
  snoozeUntil?: number | string | null;
  pathname?: string | null;
  nowMs?: number;
}): boolean {
  if (!status) return false;
  if (status.hasSubmitted || !status.eligible) return false;
  if (isSnoozed(snoozeUntil, nowMs)) return false;
  if (isActiveAssessmentRoute(pathname)) return false;
  return true;
}

export function readTestimonialSnooze(userId?: string | null): string | null {
  if (typeof window === 'undefined' || !userId) return null;
  try {
    return window.localStorage.getItem(buildTestimonialSnoozeKey(userId));
  } catch {
    return null;
  }
}

export function saveTestimonialSnooze(
  userId?: string | null,
  days: number = TESTIMONIAL_SNOOZE_DAYS
): void {
  if (typeof window === 'undefined' || !userId) return;
  try {
    window.localStorage.setItem(
      buildTestimonialSnoozeKey(userId),
      String(computeSnoozeUntil(Date.now(), days))
    );
  } catch {
    // Ignore storage quota or private browsing errors
  }
}
