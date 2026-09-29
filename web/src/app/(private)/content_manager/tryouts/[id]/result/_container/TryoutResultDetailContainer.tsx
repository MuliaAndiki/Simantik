'use client';

import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { TryoutResultDetailPage } from '@/components/page/private/content_manager/TryoutResultDetailPage';
import { useApi } from '@/hooks/useApi';

export const TryoutResultDetailContainer: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const api = useApi();

  const tryoutId = typeof params.id === 'string' ? params.id : '';
  const attemptId = searchParams.get('attemptId') || '';
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);

  // Query attempt review
  const reviewQuery = api.evaluation.query.attemptReview(attemptId, {
    enabled: !!attemptId,
  });

  const review = reviewQuery.data ?? null;
  const questionsCount = review?.questions?.length ?? 0;

  const handleBack = () => {
    router.push(`${basePath}/tryouts/${tryoutId}`);
  };

  const handlePrevQuestion = () => {
    setSelectedQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextQuestion = () => {
    setSelectedQuestionIndex((prev) => Math.min(questionsCount - 1, prev + 1));
  };

  return (
    <TryoutResultDetailPage
      review={review}
      isLoading={reviewQuery.isPending}
      selectedQuestionIndex={selectedQuestionIndex}
      onSelectQuestionIndex={setSelectedQuestionIndex}
      onPrevQuestion={handlePrevQuestion}
      onNextQuestion={handleNextQuestion}
      onBack={handleBack}
      onPrint={() => {
        if (typeof window !== 'undefined') window.print();
      }}
    />
  );
};

export default TryoutResultDetailContainer;
