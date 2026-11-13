import { describe, expect, it } from 'bun:test';
import type { TestimonialMyStatusResponse } from '@/types/service';
import {
  buildTestimonialSnoozeKey,
  computeSnoozeUntil,
  isActiveAssessmentRoute,
  isSnoozed,
  shouldShowTestimonialPrompt,
} from './testimonial-prompt.util';

describe('testimonial-prompt.util', () => {
  const baseEligibleStatus: TestimonialMyStatusResponse = {
    hasSubmitted: false,
    completedTryouts: 3,
    requiredTryouts: 3,
    eligible: true,
  };

  it('builds per-user snooze storage keys', () => {
    expect(buildTestimonialSnoozeKey('u-42')).toBe('simantik_testimonial_snooze_u-42');
  });

  it('handles 7-day snooze window accurately', () => {
    const now = 1_700_000_000_000;
    const until = computeSnoozeUntil(now);
    expect(isSnoozed(until, now)).toBe(true);
    expect(isSnoozed(String(until), now + 6 * 24 * 60 * 60 * 1000)).toBe(true);
    expect(isSnoozed(until, until)).toBe(false);
    expect(isSnoozed(null, now)).toBe(false);
  });

  it('detects active tryout/practice attempt runner paths without suppressing result pages', () => {
    expect(isActiveAssessmentRoute('/student/tryout/abc-123')).toBe(true);
    expect(isActiveAssessmentRoute('/student/practice/xyz-789')).toBe(true);
    expect(isActiveAssessmentRoute('/student/tryout')).toBe(false);
    expect(isActiveAssessmentRoute('/student/practice')).toBe(false);
    expect(isActiveAssessmentRoute('/student/tryout/abc-123/result')).toBe(false);
    expect(isActiveAssessmentRoute('/student/practice/xyz-789/result')).toBe(false);
    expect(isActiveAssessmentRoute('/student/dashboard')).toBe(false);
  });

  it('shows pop-up only when eligible, not submitted, not snoozed, and outside active attempts', () => {
    const now = 1_700_000_000_000;

    expect(
      shouldShowTestimonialPrompt({
        status: baseEligibleStatus,
        snoozeUntil: null,
        pathname: '/student/dashboard',
        nowMs: now,
      })
    ).toBe(true);

    // Already submitted -> never show again
    expect(
      shouldShowTestimonialPrompt({
        status: { ...baseEligibleStatus, hasSubmitted: true, eligible: false },
        snoozeUntil: null,
        pathname: '/student/dashboard',
        nowMs: now,
      })
    ).toBe(false);

    // Fewer than 3 completed tryouts -> do not show
    expect(
      shouldShowTestimonialPrompt({
        status: { hasSubmitted: false, completedTryouts: 2, requiredTryouts: 3, eligible: false },
        snoozeUntil: null,
        pathname: '/student/dashboard',
        nowMs: now,
      })
    ).toBe(false);

    // Actively snoozed -> do not show
    expect(
      shouldShowTestimonialPrompt({
        status: baseEligibleStatus,
        snoozeUntil: computeSnoozeUntil(now),
        pathname: '/student/dashboard',
        nowMs: now,
      })
    ).toBe(false);

    // Inside active tryout attempt -> suppress
    expect(
      shouldShowTestimonialPrompt({
        status: baseEligibleStatus,
        snoozeUntil: null,
        pathname: '/student/tryout/attempt-1',
        nowMs: now,
      })
    ).toBe(false);

    // On tryout result page -> allow
    expect(
      shouldShowTestimonialPrompt({
        status: baseEligibleStatus,
        snoozeUntil: null,
        pathname: '/student/tryout/attempt-1/result',
        nowMs: now,
      })
    ).toBe(true);
  });
});
