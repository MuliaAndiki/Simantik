import { Award, Check, TrendingUp, X } from 'lucide-react';
import React from 'react';

export interface PracticeResultStatCardsProps {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  wrongQuestionNumbers?: number[];
}

export const PracticeResultStatCards: React.FC<PracticeResultStatCardsProps> = ({
  score,
  correctAnswers,
  wrongAnswers,
  accuracy,
  wrongQuestionNumbers = [],
}) => {
  const roundedScore = Math.round(score);
  const roundedAccuracy = Math.round(accuracy);

  const getPredikat = (s: number) => {
    if (s >= 85) return 'Predikat Sangat Baik';
    if (s >= 70) return 'Predikat Baik';
    if (s >= 55) return 'Predikat Cukup';
    return 'Perlu Bimbingan';
  };

  const formattedWrongNumbers =
    wrongQuestionNumbers.length > 0
      ? `Nomor ${wrongQuestionNumbers.map((n) => String(n).padStart(2, '0')).join(', ')}`
      : 'Semua jawaban benar';

  // Circular Progress SVG params
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (roundedAccuracy / 100) * circumference;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. NILAI AKHIR */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
            NILAI AKHIR
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{roundedScore}</span>
            <span className="text-xs sm:text-sm font-bold text-slate-400">/ 100</span>
          </div>
          <p className="inline-flex items-center gap-1 text-xs font-bold text-[#0E7490] pt-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{getPredikat(roundedScore)}</span>
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
          <Award className="w-6 h-6" />
        </div>
      </div>

      {/* 2. JAWABAN BENAR */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
            JAWABAN BENAR
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{correctAnswers}</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-500">soal</span>
          </div>
          <p className="text-xs font-medium text-slate-400 pt-0.5">Bobot skoring penuh</p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-600 flex items-center justify-center shrink-0 shadow-2xs">
          <Check className="w-6 h-6 stroke-[2.5]" />
        </div>
      </div>

      {/* 3. JAWABAN SALAH */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
            JAWABAN SALAH
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{wrongAnswers}</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-500">soal</span>
          </div>
          <p
            className="text-xs font-semibold text-rose-500 pt-0.5 truncate max-w-[150px]"
            title={formattedWrongNumbers}
          >
            {formattedWrongNumbers}
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs">
          <X className="w-6 h-6 stroke-[2.5]" />
        </div>
      </div>

      {/* 4. RASIO AKURASI */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
            RASIO AKURASI
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {roundedAccuracy}%
            </span>
          </div>
          <p className="text-xs font-medium text-slate-400 pt-0.5">Tingkat ketepatan nalar</p>
        </div>

        {/* Circular Progress Indicator */}
        <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 -rotate-90"
            viewBox="0 0 54 54"
            role="img"
            aria-label="Rasio Akurasi"
          >
            <circle
              cx="27"
              cy="27"
              r={radius}
              className="text-slate-100"
              strokeWidth="5"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="27"
              cy="27"
              r={radius}
              className="text-[#134653] transition-all duration-500 ease-out"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <span className="absolute text-[11px] font-black text-[#134653]">{roundedAccuracy}</span>
        </div>
      </div>
    </div>
  );
};

export default PracticeResultStatCards;
