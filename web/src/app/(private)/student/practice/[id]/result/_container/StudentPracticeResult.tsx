'use client';

import { FileQuestion } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import StudentPracticeResultPage from '@/components/page/private/student/StudentPracticeResultPage';
import { useApi } from '@/hooks/useApi';
import type {
  PracticeResultPaletteItem,
  PracticeResultSummaryData,
  PracticeReviewFilter,
  PracticeReviewItem,
} from '@/types/ui';
import { parseMatrixOptions, parseWacanaQuestion } from '@/utils/wacana';

const MATRIX_TYPE_LABELS: Record<string, string> = {
  'benar-salah': 'Benar-Salah',
  'tepat-tidak-tepat': 'Tepat-Tidak Tepat',
  'setuju-tidak-setuju': 'Setuju-Tidak Setuju',
};

function humanizeKey(key: string): string {
  if (!key) return '-';
  return key
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function normalizeKey(value: string): string {
  return value.toUpperCase().replace(/\s+/g, '_');
}

// answer_data matriks tersimpan sebagai JSON {"optionId": "SETUJU", ...}
function parseAnswerMap(raw?: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
  } catch {
    // bukan JSON (jawaban tunggal), bukan map matriks
  }
  return {};
}

export function StudentPracticeResult() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const attemptIdParam = searchParams.get('attemptId');
  const packageId = params?.id;

  const { practice } = useApi();
  const [activeFilter, setActiveFilter] = useState<PracticeReviewFilter>('all');

  // If attemptId is not in searchParams, fetch the latest completed attempt for this package
  const { data: attemptsData, isLoading: isAttemptsLoading } = practice.query.attempts(
    { package_id: packageId, status: 'completed', limit: 1 },
    { enabled: !attemptIdParam && Boolean(packageId) }
  );

  const resolvedAttemptId = attemptIdParam || attemptsData?.practices?.[0]?.attempt_id || '';

  // Fetch real practice result once attemptId is resolved: GET /api/v1/practice-attempts/:attemptId/result
  const { data: attemptResult, isLoading: isResultLoading } = practice.query.result(
    resolvedAttemptId,
    { enabled: Boolean(resolvedAttemptId) }
  );

  const isLoading = isResultLoading || (Boolean(!attemptIdParam && packageId) && isAttemptsLoading);

  const summary: PracticeResultSummaryData = useMemo(() => {
    if (!attemptResult) {
      return {
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        unansweredCount: 0,
        accuracy: 0,
        testId: '-',
        packageName: 'Latihan Soal',
        statusLabel: 'LATIHAN SELESAI',
        motivationText: '',
      };
    }
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
      packageName: attemptResult.package_title || 'Latihan Soal',
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
      return [];
    }

    return attemptResult.reviews.map((rev, idx) => {
      const qNum = rev.question_number || idx + 1;
      const isCorrect = rev.is_correct;
      const parsed = parseWacanaQuestion(rev.question_text);
      const stimulus = parsed.hasStimulus
        ? {
            label: parsed.stimulusTitle || 'Wacana',
            content: parsed.stimulusHtml || '',
          }
        : undefined;

      const competencyName =
        rev.competencies && rev.competencies.length > 0
          ? rev.competencies[0].name
          : 'Pemahaman Wacana';

      // Soal matriks: render tabel pernyataan, bukan daftar opsi.
      const matrix = parseMatrixOptions(rev.options);
      if (matrix) {
        const answerMap = parseAnswerMap(rev.answer_data);
        const matrixRows = matrix.statements.map((stmt) => {
          const rawChoice =
            answerMap[stmt.id] ??
            Object.entries(answerMap).find(
              ([k]) => k.toLowerCase() === stmt.id.toLowerCase()
            )?.[1] ??
            '';
          const userChoice = rawChoice ? humanizeKey(normalizeKey(String(rawChoice))) : '-';
          const validKey = humanizeKey(stmt.key);
          return {
            statement: stmt.statement,
            userChoice,
            validKey,
            isCorrect:
              rawChoice !== '' && normalizeKey(String(rawChoice)) === normalizeKey(stmt.key),
          };
        });

        const hasUserAnswer = matrixRows.some((r) => r.userChoice !== '-');
        const status = isCorrect ? 'correct' : hasUserAnswer ? 'wrong' : 'unanswered';
        const statusLabel = isCorrect ? 'BENAR' : hasUserAnswer ? 'SALAH' : 'TIDAK DIJAWAB';

        return {
          number: qNum,
          formattedNumber: String(qNum).padStart(2, '0'),
          status,
          statusLabel,
          type: 'matriks-tabel',
          typeLabel: MATRIX_TYPE_LABELS[matrix.kind] ?? 'Matriks',
          subtest: `Subtes: ${competencyName}`,
          title: `Butir Soal Nomor ${qNum}`,
          prompt: parsed.bodyHtml,
          stimulus,
          matrixRows,
          discussion: {
            type: isCorrect ? 'analitis' : 'kekeliruan',
            title: isCorrect ? 'Pembahasan Analitis' : 'Analisis Kekeliruan',
            content:
              rev.explanation ||
              (isCorrect
                ? 'Jawaban kamu tepat sesuai dengan analisis wacana dan opsi kunci.'
                : hasUserAnswer
                  ? 'Pilihan jawaban belum tepat. Pelajari kembali premis wacana dan kunci jawaban yang sahih.'
                  : 'Soal ini tidak dijawab. Pelajari kunci jawaban dan penjelasan untuk butir soal ini.'),
          },
        };
      }

      const options = (rev.options || []).map((opt, optIdx) => {
        const isUserChoice = Boolean(
          opt.is_selected ||
            (rev.selected_option_id &&
              opt.id?.toLowerCase() === rev.selected_option_id?.toLowerCase()) ||
            (rev.answer_data && rev.answer_data.toLowerCase().includes(opt.id?.toLowerCase())) ||
            (opt.option_label && rev.answer_data === opt.option_label)
        );

        let badgeText: string | undefined;
        if (isUserChoice && opt.is_correct) {
          badgeText = 'Jawaban Kamu (Benar)';
        } else if (isUserChoice && !opt.is_correct) {
          badgeText = 'Jawaban Kamu (Salah)';
        } else if (!isUserChoice && opt.is_correct) {
          badgeText = 'Kunci Benar';
        }

        return {
          id: opt.option_label || String.fromCharCode(65 + optIdx),
          text: opt.option_text,
          isUserChoice,
          isCorrect: opt.is_correct,
          badgeText,
        };
      });

      const hasUserAnswer = options.some((o) => o.isUserChoice);
      const status = isCorrect ? 'correct' : hasUserAnswer ? 'wrong' : 'unanswered';
      const statusLabel = isCorrect ? 'BENAR' : hasUserAnswer ? 'SALAH' : 'TIDAK DIJAWAB';

      // >1 kunci benar = pilihan ganda kompleks (MCMA).
      const isMcma = (rev.options || []).filter((o) => o.is_correct).length > 1;

      return {
        number: qNum,
        formattedNumber: String(qNum).padStart(2, '0'),
        status,
        statusLabel,
        type: isMcma ? 'mcma' : 'pilihan-ganda',
        typeLabel: isMcma ? 'Pilihan Ganda Kompleks' : 'Pilihan Ganda',
        subtest: `Subtes: ${competencyName}`,
        title: `Butir Soal Nomor ${qNum}`,
        prompt: parsed.bodyHtml,
        stimulus,
        options,
        discussion: {
          type: isCorrect ? 'analitis' : 'kekeliruan',
          title: isCorrect ? 'Pembahasan Analitis' : 'Analisis Kekeliruan',
          content:
            rev.explanation ||
            (isCorrect
              ? 'Jawaban kamu tepat sesuai dengan analisis wacana dan opsi kunci.'
              : hasUserAnswer
                ? 'Pilihan jawaban belum tepat. Pelajari kembali premis wacana dan kunci jawaban yang sahih.'
                : 'Soal ini tidak dijawab. Pelajari kunci jawaban dan penjelasan untuk butir soal ini.'),
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
    return [];
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Memuat hasil latihan...</p>
      </div>
    );
  }

  if (!attemptResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
        <div className="p-4 bg-slate-100 text-slate-500 rounded-full">
          <FileQuestion className="w-10 h-10" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Hasil Latihan Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 max-w-md">
          Data riwayat latihan tidak ditemukan atau sesi latihan belum diselesaikan.
        </p>
        <button
          type="button"
          onClick={() => router.push('/student/practice')}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
        >
          Kembali ke Daftar Latihan
        </button>
      </div>
    );
  }

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
