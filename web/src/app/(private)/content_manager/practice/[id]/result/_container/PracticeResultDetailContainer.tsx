'use client';

import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import PracticeResultDetailPage from '@/components/page/private/content_manager/PracticeResultDetailPage';
import { useApi } from '@/hooks/useApi';

export const PracticeResultDetailContainer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const api = useApi();

  const packageId = params?.id || '';
  const attemptIdParam = searchParams.get('attemptId') || '';
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);

  // If attemptId is present, fetch the practice result directly
  const { data: resultData, isLoading } = api.practice.query.result(attemptIdParam, {
    enabled: Boolean(attemptIdParam),
  });

  const handleBack = () => {
    router.push(`${basePath}/practice/${packageId}`);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleExportPdf = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <PracticeResultDetailPage
      basePath={basePath}
      packageId={packageId}
      resultData={resultData ?? null}
      selectedQuestionIndex={selectedQuestionIndex}
      onSelectQuestionIndex={setSelectedQuestionIndex}
      onBack={handleBack}
      onPrint={handlePrint}
      onExportPdf={handleExportPdf}
      isLoading={isLoading}
    />
  );
};

export default PracticeResultDetailContainer;
