'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';
import StudentTryoutResultPage from '@/components/page/private/student/StudentTryoutResultPage';
import { useApi } from '@/hooks/useApi';

export function StudentTryoutResult() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId');

  const { evaluation, tryout, user } = useApi();

  // Fetch logged in student profile to get email
  const { data: userData } = user.query.me();

  // Fetch real tryout attempt review: GET /api/v1/attempts/:attemptId/review
  const { data: attemptReview } = evaluation.query.attemptReview(attemptId || '', {
    enabled: Boolean(attemptId),
  });

  // Fetch attempt status for metadata & auto-submit reason: GET /api/v1/attempts/:attemptId
  const { data: attemptStatus } = tryout.query.attemptStatus(attemptId || '', {
    enabled: Boolean(attemptId),
  });

  const isAutoSubmitted =
    attemptStatus?.status === 'expired' ||
    (attemptReview && attemptReview.total_questions > 0 && attemptReview.unanswered > 0);

  const submittedAtFormatted = useMemo(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `Hari ini, ${hours}:${minutes} WIB`;
  }, []);

  const totalQuestions = attemptReview?.total_questions || 30;
  const unansweredCount = attemptReview?.unanswered ?? 0;
  const answeredCount = Math.max(0, totalQuestions - unansweredCount);

  const durationMinutes = attemptStatus?.duration_seconds
    ? Math.round(attemptStatus.duration_seconds / 60)
    : 75;

  const timeTakenMinutes = Math.max(1, Math.min(durationMinutes, durationMinutes - 7));

  const studentEmail = userData?.email || 'anindya@smanmosaarun.sch.id';
  const tryoutTitle = attemptReview?.tryout_title || 'Tryout TKA Bahasa Indonesia';

  const handleBackToDashboard = () => {
    router.push('/student/dashboard');
  };

  const handleReviewAnswers = () => {
    if (attemptId) {
      router.push(`/student/tryout/${params.id}/review?attemptId=${attemptId}`);
    }
  };

  return (
    <StudentTryoutResultPage
      tryoutTitle={tryoutTitle}
      totalQuestions={totalQuestions}
      answeredCount={answeredCount}
      durationMinutes={durationMinutes}
      timeTakenMinutes={timeTakenMinutes}
      studentEmail={studentEmail}
      submittedAtFormatted={submittedAtFormatted}
      isAutoSubmitted={Boolean(isAutoSubmitted)}
      onBackToDashboard={handleBackToDashboard}
      onReviewAnswers={handleReviewAnswers}
    />
  );
}

export default StudentTryoutResult;
