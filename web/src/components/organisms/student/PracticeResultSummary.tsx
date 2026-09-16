import { Sparkles } from 'lucide-react';
import React from 'react';
import type { PracticeResultSummaryData } from '@/types/ui';

export interface PracticeResultSummaryProps {
  summary: PracticeResultSummaryData;
}

export const PracticeResultSummary: React.FC<PracticeResultSummaryProps> = ({ summary }) => {
  return (
    <div className="h-full bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between gap-6">
      {/* Top: Status Badge & Motivation */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-teal-900 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
          <span>{summary.statusLabel}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
          {summary.motivationText}
        </p>
      </div>

      {/* Middle & Bottom: Gauge and Metrics */}
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pt-2">
        {/* Score Gauge Circle */}
        <div className="relative flex items-center justify-center shrink-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-[6px] border-[#F5B731] flex flex-col items-center justify-center bg-amber-50/20 shadow-xs">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {summary.score}
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase mt-0.5">
              Skor Akhir
            </span>
          </div>
        </div>

        {/* 4 Stats Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 font-medium">Total Soal</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {summary.totalQuestions}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Butir</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 font-medium">Benar</span>
            <span className="text-xl sm:text-2xl font-black text-teal-800 mt-0.5">
              {summary.correctAnswers}
            </span>
            <span className="text-[10px] text-teal-700 font-semibold">
              {summary.accuracy}% Akurat
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 font-medium">Salah</span>
            <span className="text-xl sm:text-2xl font-black text-rose-600 mt-0.5">
              {summary.wrongAnswers}
            </span>
            <span className="text-[10px] text-rose-500 font-semibold">Perlu Cek</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 font-medium">Kosong</span>
            <span className="text-xl sm:text-2xl font-black text-slate-600 mt-0.5">
              {summary.unansweredCount}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Lengkap</span>
          </div>
        </div>
      </div>
    </div>
  );
};
