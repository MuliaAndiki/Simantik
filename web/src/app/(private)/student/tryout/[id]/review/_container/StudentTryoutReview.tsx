'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';
import { PracticeResultReviewCard } from '@/components/organisms/student/PracticeResultReviewCard';
import { useApi } from '@/hooks/useApi';
import type { QuestionReviewResponse } from '@/types/service';
import type { PracticeMatrixRow, PracticeReviewItem, PracticeReviewOption } from '@/types/ui';
import {
  humanizeWacanaKey,
  normalizeWacanaKey,
  parseMatrixOptions,
  parseWacanaQuestion,
} from '@/utils/wacana';

const MATRIX_TYPE_LABELS: Record<string, string> = {
  'benar-salah': 'Benar-Salah',
  'tepat-tidak-tepat': 'Tepat-Tidak Tepat',
  'setuju-tidak-setuju': 'Setuju-Tidak Setuju',
};

function isAnswered(q: QuestionReviewResponse): boolean {
  if (q.selected_option_id) return true;
  const raw = (q.answer_data ?? '').trim();
  return raw !== '' && raw !== '""' && raw !== '{}' && raw !== '[]' && raw !== 'null';
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
    // bukan JSON map
  }
  return {};
}

function mapToReviewItem(rev: QuestionReviewResponse, idx: number): PracticeReviewItem {
  const qNum = rev.question_number || idx + 1;
  const isCorrect = rev.is_correct;
  const parsed = parseWacanaQuestion(rev.question_text);
  const competencyName =
    rev.competencies && rev.competencies.length > 0 ? rev.competencies[0].name : 'Pemahaman Wacana';

  const base = {
    number: qNum,
    formattedNumber: String(qNum).padStart(2, '0'),
    status: (isCorrect ? 'correct' : 'wrong') as PracticeReviewItem['status'],
    statusLabel: isCorrect ? 'BENAR' : 'SALAH',
    subtest: `Subtes: ${competencyName}`,
    title: `Butir Soal Nomor ${qNum}`,
    prompt: parsed.bodyHtml,
    stimulus: parsed.hasStimulus
      ? {
          label: parsed.stimulusTitle || 'Wacana',
          content: parsed.stimulusHtml || '',
        }
      : undefined,
    discussion: {
      type: (isCorrect ? 'analitis' : 'kekeliruan') as PracticeReviewItem['discussion']['type'],
      title: isCorrect ? 'Pembahasan Analitis' : 'Analisis Kekeliruan',
      content:
        rev.explanation ||
        (isCorrect
          ? 'Jawaban kamu tepat sesuai dengan analisis wacana dan opsi kunci.'
          : 'Pilihan jawaban belum tepat. Pelajari kembali premis wacana dan kunci jawaban yang sahih.'),
    },
  };

  // Soal matriks: tabel pernyataan.
  const matrix = parseMatrixOptions(rev.options);
  if (matrix) {
    const answerMap = parseAnswerMap(rev.answer_data);
    const matrixRows: PracticeMatrixRow[] = matrix.statements.map((stmt) => {
      const rawChoice =
        answerMap[stmt.id] ??
        Object.entries(answerMap).find(([k]) => k.toLowerCase() === stmt.id.toLowerCase())?.[1] ??
        '';
      const userChoice = rawChoice ? humanizeWacanaKey(rawChoice) : '-';
      return {
        statement: stmt.statement,
        userChoice,
        validKey: humanizeWacanaKey(stmt.key),
        isCorrect:
          rawChoice !== '' &&
          normalizeWacanaKey(String(rawChoice)) === normalizeWacanaKey(stmt.key),
      };
    });
    return {
      ...base,
      type: 'matriks-tabel',
      typeLabel: MATRIX_TYPE_LABELS[matrix.kind] ?? 'Matriks',
      matrixRows,
    };
  }

  // MCMA: >1 kunci benar.
  const isMcma = (rev.options || []).filter((o) => o.is_correct).length > 1;

  const options: PracticeReviewOption[] = (rev.options || []).map((opt, optIdx) => {
    const isUserChoice = Boolean(
      opt.is_selected ||
        (rev.selected_option_id &&
          opt.id?.toLowerCase() === rev.selected_option_id?.toLowerCase()) ||
        (rev.answer_data && rev.answer_data.toLowerCase().includes(opt.id?.toLowerCase()))
    );

    if (isMcma) {
      return {
        id: opt.option_label || String.fromCharCode(65 + optIdx),
        text: opt.option_text,
        isUserChoice,
        isCorrect: opt.is_correct,
        tagText: opt.is_correct ? 'Pilihan Tepat' : undefined,
      };
    }

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

  return {
    ...base,
    type: isMcma ? 'mcma' : 'pilihan-ganda',
    typeLabel: isMcma ? 'Pilihan Ganda Kompleks' : 'Pilihan Ganda',
    options,
  };
}

export default function StudentTryoutReview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId');
  const { evaluation } = useApi();

  const { data: attemptReview, isLoading } = evaluation.query.attemptReview(attemptId || '', {
    enabled: Boolean(attemptId),
  });

  // Hanya soal yang dijawab (benar/salah); yang kosong dibuang.
  const reviewItems: PracticeReviewItem[] = useMemo(() => {
    if (!attemptReview?.questions) return [];
    return attemptReview.questions
      .filter((q) => isAnswered(q))
      .map((q, idx) => mapToReviewItem(q, idx));
  }, [attemptReview?.questions]);

  if (isLoading) return <div className="p-8 text-center text-slate-500">Memuat pembahasan...</div>;
  if (!attemptReview)
    return <div className="p-8 text-center text-red-500">Simulasi tidak ditemukan.</div>;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-8 px-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Pembahasan: {attemptReview.tryout_title}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
          <div className="bg-slate-100 px-3 py-1 rounded-full">
            Nilai: {Math.round(attemptReview.score)}
          </div>
          <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100">
            Benar: {attemptReview.correct_answers}
          </div>
          <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-100">
            Salah: {attemptReview.incorrect_answers}
          </div>
          <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100">
            Kosong: {attemptReview.unanswered}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {reviewItems.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            Tidak ada soal terjawab pada sesi ini.
          </div>
        ) : (
          reviewItems.map((item) => (
            <PracticeResultReviewCard key={`review-question-${item.number}`} item={item} />
          ))
        )}
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={() => router.push('/student/dashboard')}
          className="px-8 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}
