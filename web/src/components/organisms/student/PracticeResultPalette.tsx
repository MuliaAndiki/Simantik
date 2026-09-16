import React from 'react';
import type { PracticeResultPaletteItem, PracticeReviewFilter } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface PracticeResultPaletteProps {
  totalQuestions: number;
  items: PracticeResultPaletteItem[];
  activeFilter: PracticeReviewFilter;
  onSelectFilter: (filter: PracticeReviewFilter) => void;
  onSelectQuestion: (questionNumber: number) => void;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
}

export const PracticeResultPalette: React.FC<PracticeResultPaletteProps> = ({
  totalQuestions,
  items,
  activeFilter,
  onSelectFilter,
  onSelectQuestion,
  correctCount,
  wrongCount,
  unansweredCount,
}) => {
  return (
    <div className="h-full bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
      <div>
        {/* Header with Title and Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <h3 className="text-sm font-bold text-slate-900">Daftar Butir Soal</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {totalQuestions} Soal
          </span>
        </div>

        {/* Filter Pills Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl mb-4 overflow-x-auto text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => onSelectFilter('all')}
            className={cn(
              'px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap',
              activeFilter === 'all'
                ? 'bg-teal-800 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => onSelectFilter('correct')}
            className={cn(
              'px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap',
              activeFilter === 'correct'
                ? 'bg-teal-800 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Benar ({correctCount})
          </button>
          <button
            type="button"
            onClick={() => onSelectFilter('wrong')}
            className={cn(
              'px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap',
              activeFilter === 'wrong'
                ? 'bg-teal-800 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Salah ({wrongCount})
          </button>
          <button
            type="button"
            onClick={() => onSelectFilter('unanswered')}
            className={cn(
              'px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap',
              activeFilter === 'unanswered'
                ? 'bg-teal-800 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Kosong ({unansweredCount})
          </button>
        </div>

        {/* Grid of 20 Question Pills */}
        <div className="grid grid-cols-5 gap-2">
          {items.map((item) => {
            const isCorrect = item.status === 'correct';
            const isWrong = item.status === 'wrong';
            const isDimmed =
              (activeFilter === 'correct' && !isCorrect) ||
              (activeFilter === 'wrong' && !isWrong) ||
              (activeFilter === 'unanswered' && item.status !== 'unanswered');

            return (
              <button
                key={item.number}
                type="button"
                onClick={() => onSelectQuestion(item.number)}
                className={cn(
                  'relative h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer border',
                  isCorrect && 'bg-[#EAF6F6] text-teal-900 border-teal-200/90 hover:bg-teal-100/70',
                  isWrong && 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/80',
                  item.status === 'unanswered' &&
                    'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200',
                  isDimmed && 'opacity-30'
                )}
              >
                <span>{item.formattedNumber}</span>
                {isWrong && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Legend */}
      <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-600" />
          <span>Benar ({correctCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Salah ({wrongCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>Kosong ({unansweredCount})</span>
        </div>
      </div>
    </div>
  );
};
