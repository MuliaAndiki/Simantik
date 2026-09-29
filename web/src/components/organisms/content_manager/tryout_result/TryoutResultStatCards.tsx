import { Award, CheckCircle2, Clock, Layers, Percent, XCircle } from 'lucide-react';
import React from 'react';
import type { AttemptReviewResponse } from '@/types/service';

export interface TryoutResultStatCardsProps {
  review: AttemptReviewResponse | null;
}

export const TryoutResultStatCards: React.FC<TryoutResultStatCardsProps> = ({ review }) => {
  const total = review?.total_questions ?? 0;
  const correct = review?.correct_answers ?? 0;
  const incorrect = review?.incorrect_answers ?? 0;
  const score = review?.score ?? 0;
  const accuracy = review?.accuracy ?? (total > 0 ? (correct / total) * 100 : 0);
  const durationMinutes = review?.time_taken_seconds
    ? Math.round(review.time_taken_seconds / 60)
    : 0;

  // List wrong question numbers
  const wrongQuestionNumbers = (review?.questions ?? [])
    .filter((q) => !q.is_correct)
    .map((q) => q.question_number);

  const formattedCompletedAt = review?.submitted_at
    ? new Date(review.submitted_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';

  const scorePredicate =
    score >= 85 ? 'Sangat Baik' : score >= 70 ? 'Baik' : score >= 55 ? 'Cukup' : 'Perlu Bimbingan';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Soal Dikerjakan */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Soal Dikerjakan
          </span>
          <div className="p-1.5 rounded-xl bg-cyan-50 text-cyan-800">
            <Layers className="w-4 h-4 text-cyan-700" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{total}</span>
            <span className="text-xs font-bold text-slate-400">/ {total} Butir</span>
          </div>
          <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% Selesai Dikerjakan</span>
          </p>
        </div>
      </div>

      {/* 2. Jawaban Benar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Jawaban Benar
          </span>
          <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">{correct}</span>
            <span className="text-xs font-bold text-slate-400">Soal</span>
          </div>
          <p className="text-[11px] font-bold text-slate-500 mt-1 flex items-center gap-1">
            <Percent className="w-3 h-3 text-emerald-600" />
            <span>{accuracy.toFixed(1)}% Akurasi Jawaban</span>
          </p>
        </div>
      </div>

      {/* 3. Jawaban Salah */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Jawaban Salah
          </span>
          <div className="p-1.5 rounded-xl bg-rose-50 text-rose-700">
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-600">{incorrect}</span>
            <span className="text-xs font-bold text-slate-400">Soal</span>
          </div>
          <p
            className="text-[11px] font-medium text-slate-400 mt-1 truncate"
            title={wrongQuestionNumbers.join(', ')}
          >
            {wrongQuestionNumbers.length > 0
              ? `No: ${wrongQuestionNumbers.slice(0, 5).join(', ')}${wrongQuestionNumbers.length > 5 ? '...' : ''}`
              : 'Tidak ada salah'}
          </p>
        </div>
      </div>

      {/* 4. Nilai Akhir */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Nilai Akhir
          </span>
          <div className="p-1.5 rounded-xl bg-amber-50 text-amber-700">
            <Award className="w-4 h-4 text-amber-600" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{score.toFixed(1)}</span>
            <span className="text-xs font-bold text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] font-bold text-amber-700 mt-1">Predikat: {scorePredicate}</p>
        </div>
      </div>

      {/* 5. Durasi & Waktu */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Durasi & Waktu
          </span>
          <div className="p-1.5 rounded-xl bg-blue-50 text-blue-700">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{durationMinutes}</span>
            <span className="text-xs font-bold text-slate-400">Menit</span>
          </div>
          <p className="text-[11px] font-medium text-slate-400 mt-1 truncate">
            {formattedCompletedAt}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TryoutResultStatCards;
