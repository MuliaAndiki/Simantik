'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import StudentPracticeResultPage from '@/components/page/private/student/StudentPracticeResultPage';
import {
  practiceResultPaletteMock,
  practiceResultSummaryMock,
  practiceReviewItemsMock,
} from '@/data/practiceResult.data';
import { useApi } from '@/hooks/useApi';
import type {
  PracticeResultPaletteItem,
  PracticeResultSummaryData,
  PracticeReviewFilter,
  PracticeReviewItem,
} from '@/types/ui';

export function StudentPracticeResult() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId');

  const { practice } = useApi();
  const [activeFilter, setActiveFilter] = useState<PracticeReviewFilter>('all');

  // Fetch real practice result if attemptId is present: GET /api/v1/practice-attempts/:attemptId/result
  const { data: attemptResult } = practice.query.result(attemptId || '', {
    enabled: Boolean(attemptId),
  });

  const summary: PracticeResultSummaryData = useMemo(() => {
    if (!attemptResult) return practiceResultSummaryMock;
    const accuracy =
      attemptResult.total_questions > 0
        ? Math.round((attemptResult.correct_answers / attemptResult.total_questions) * 100)
        : 0;

    return {
      score: Math.round(attemptResult.score),
      totalQuestions: attemptResult.total_questions,
      correctAnswers: attemptResult.correct_answers,
      wrongAnswers: attemptResult.incorrect_answers,
      unansweredCount: attemptResult.unanswered,
      accuracy,
      testId: attemptResult.attempt_id.substring(0, 8).toUpperCase(),
      packageName: attemptResult.package_title || practiceResultSummaryMock.packageName,
      statusLabel: attemptResult.is_auto_submitted ? 'DIKUMPULKAN OTOMATIS' : 'LATIHAN SELESAI',
      motivationText: attemptResult.is_auto_submitted
        ? 'Sesi latihan ini difinalisasi otomatis oleh sistem anti-kecurangan SIMANTIK karena melebihi batas toleransi pelanggaran tata tertib.'
        : attemptResult.score >= 80
          ? 'Bagus, terus tingkatkan kemampuanmu dalam memahami inferensi wacana akademik.'
          : 'Terus berlatih dan pelajari pembahasan pada setiap butir soal untuk meningkatkan pemahamanmu.',
    };
  }, [attemptResult]);

  const reviewItems: PracticeReviewItem[] = useMemo(() => {
    if (!attemptResult?.reviews || attemptResult.reviews.length === 0) {
      return practiceReviewItemsMock;
    }

    return attemptResult.reviews.map((rev, idx) => {
      const qNum = rev.question_number || idx + 1;
      const isCorrect = rev.is_correct;

      const options = (rev.options || []).map((opt) => {
        const isUserChoice = opt.id === rev.selected_option_id;
        let badgeText: string | undefined;
        if (isUserChoice && opt.is_correct) {
          badgeText = 'Jawaban Kamu & Benar';
        } else if (isUserChoice && !opt.is_correct) {
          badgeText = 'Jawaban Kamu';
        } else if (!isUserChoice && opt.is_correct && !isCorrect) {
          badgeText = 'Kunci Benar';
        }

        return {
          id: opt.option_label || String.fromCharCode(65 + idx),
          text: opt.option_text,
          isUserChoice,
          isCorrect: opt.is_correct,
          badgeText,
        };
      });

      const competencyName =
        rev.competencies && rev.competencies.length > 0
          ? rev.competencies[0].name
          : 'Pemahaman Wacana';

      return {
        number: qNum,
        formattedNumber: String(qNum).padStart(2, '0'),
        status: isCorrect ? 'correct' : 'wrong',
        statusLabel: isCorrect ? 'BENAR' : 'SALAH',
        type: 'pilihan-ganda',
        typeLabel: 'Pilihan Ganda',
        subtest: `Subtes: ${competencyName}`,
        title: `Butir Soal Nomor ${qNum}`,
        prompt: rev.question_text,
        options,
        discussion: {
          type: isCorrect ? 'analitis' : 'kekeliruan',
          title: isCorrect ? 'Pembahasan Analitis' : 'Analisis Kekeliruan',
          content:
            rev.explanation ||
            (isCorrect
              ? 'Jawaban kamu tepat sesuai dengan analisis wacana dan opsi kunci.'
              : 'Pilihan jawaban belum tepat. Pelajari kembali premis wacana dan kunci jawaban yang sahih.'),
        },
      };
    });
  }, [attemptResult?.reviews]);

  const paletteItems: PracticeResultPaletteItem[] = useMemo(() => {
    if (attemptResult?.reviews && attemptResult.reviews.length > 0) {
      return reviewItems.map((item) => ({
        number: item.number,
        formattedNumber: item.formattedNumber,
        status: item.status,
      }));
    }
    return practiceResultPaletteMock;
  }, [attemptResult?.reviews, reviewItems]);

  const handleSelectFilter = (filter: PracticeReviewFilter) => {
    setActiveFilter(filter);
  };

  const handleSelectQuestionNumber = (questionNumber: number) => {
    const targetItem = reviewItems.find((item) => item.number === questionNumber);
    if (targetItem && activeFilter !== 'all' && targetItem.status !== activeFilter) {
      setActiveFilter('all');
    }

    setTimeout(() => {
      const element = document.getElementById(`review-question-${questionNumber}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleBackToDashboard = () => {
    router.push('/student/dashboard');
  };

  const handleRetryPractice = () => {
    const practiceId = params?.id || 'default';
    router.push(`/student/practice/${practiceId}`);
  };

  const handleContinueLearning = () => {
    router.push('/student/learning');
  };

  return (
    <StudentPracticeResultPage
      summary={summary}
      paletteItems={paletteItems}
      reviewItems={reviewItems}
      activeFilter={activeFilter}
      onSelectFilter={handleSelectFilter}
      onSelectQuestionNumber={handleSelectQuestionNumber}
      onPrint={handlePrint}
      onBackToDashboard={handleBackToDashboard}
      onRetryPractice={handleRetryPractice}
      onContinueLearning={handleContinueLearning}
    />
  );
}

export default StudentPracticeResult;
