import { LayoutGrid, Lock } from 'lucide-react';
import React from 'react';
import type { TryoutPaletteItem } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface TryoutQuestionPaletteProps {
  items: TryoutPaletteItem[];
  totalQuestions: number;
  className?: string;
}

export const TryoutQuestionPalette: React.FC<TryoutQuestionPaletteProps> = ({
  items,
  totalQuestions,
  className,
}) => {
  // Compute counts for the legend
  const answeredCount = items.filter((i) => i.status === 'answered').length;
  const flaggedCount = items.filter((i) => i.status === 'flagged').length;
  const lockedCount = items.filter((i) => i.status === 'locked').length;

  return (
    <aside
      aria-label="Daftar Soal Tryout"
      className={cn(
        'w-full bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col gap-5',
        className
      )}
    >
      {/* Top Header: Title & Total Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
          <LayoutGrid className="w-4 h-4 text-slate-700" aria-hidden="true" />
          <span>Daftar Soal</span>
        </div>

        <div className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#EAF6F8] border border-cyan-100 text-teal-800 text-xs font-bold">
          {totalQuestions} Soal
        </div>
      </div>

      {/* Adaptive Mode Notice */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 leading-snug">
        <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" aria-hidden="true" />
        <span>Mode Adaptif: Soal dikerjakan berurutan tanpa lompat atau kembali.</span>
      </div>

      {/* 5-Column Question Grid */}
      <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
        {items.map((item) => {
          let styleClasses =
            'bg-[#EAF6F8] text-slate-400 border border-transparent cursor-not-allowed';

          if (item.status === 'active') {
            styleClasses =
              'bg-[#F5B731] text-slate-900 border-2 border-amber-500 font-black shadow-xs';
          } else if (item.status === 'answered') {
            styleClasses =
              'bg-[#244252] text-white border-transparent font-bold cursor-not-allowed';
          } else if (item.status === 'flagged') {
            styleClasses =
              'bg-[#50C8DC] text-white border-transparent font-bold cursor-not-allowed';
          } else if (item.status === 'locked') {
            styleClasses =
              'bg-[#EAF6F8] text-slate-400 border-transparent opacity-80 cursor-not-allowed';
          }

          return (
            <div
              key={`tryout-palette-${item.number}`}
              title={`Soal ${item.number} - Status: ${item.status}`}
              className={cn(
                'w-full aspect-square rounded-2xl flex items-center justify-center text-xs sm:text-sm font-semibold transition-all select-none',
                styleClasses
              )}
            >
              <span>{item.formattedNumber}</span>
            </div>
          );
        })}
      </div>

      {/* Legend below the palette */}
      <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-y-2.5 gap-x-2 text-[11px] text-slate-600 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#244252] shrink-0" />
          <span>Sudah Dijawab ({answeredCount})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F5B731] shrink-0" />
          <span>Sedang Dikerjakan</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#50C8DC] shrink-0" />
          <span>Ragu-ragu ({flaggedCount})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
          <span>Belum Dijawab ({lockedCount})</span>
        </div>
      </div>
    </aside>
  );
};

export default TryoutQuestionPalette;
