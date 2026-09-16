import React from 'react';
import type { QuestionPaletteStatus } from '@/types/ui';

export interface QuestionPaletteItem {
  number: number;
  status: QuestionPaletteStatus;
}

export interface PracticeQuestionPaletteProps {
  totalQuestions: number;
  items: QuestionPaletteItem[];
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
}

export const PracticeQuestionPalette: React.FC<PracticeQuestionPaletteProps> = ({
  totalQuestions,
  items,
  currentIndex,
  onSelectQuestion,
}) => {
  // Calculate counts for legend
  const answeredCount = items.filter((item) => item.status === 'answered').length;
  const flaggedCount = items.filter((item) => item.status === 'flagged').length;
  const unansweredCount = items.filter((item) => item.status === 'unanswered').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
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
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          <span>Daftar Soal</span>
        </div>

        <div className="px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-100 text-teal-800 text-xs font-semibold">
          {totalQuestions} Butir
        </div>
      </div>

      {/* Grid of Number Pills */}
      <div className="grid grid-cols-5 gap-2.5">
        {items.map((item, idx) => {
          const isCurrent = idx === currentIndex;
          const formattedNumber = item.number < 10 ? `0${item.number}` : `${item.number}`;

          // Priority for styling:
          // If it's the current question, yellow
          // Else if flagged, cyan
          // Else if answered, dark teal
          // Else unanswered, soft light grey
          let pillStyle = 'bg-[#EAF2F8] text-slate-600 hover:bg-slate-200';
          if (isCurrent) {
            pillStyle = 'bg-[#F5B731] text-slate-900 font-bold shadow-sm ring-2 ring-amber-300';
          } else if (item.status === 'flagged') {
            pillStyle = 'bg-[#6AD2E8] text-slate-900 font-bold shadow-sm';
          } else if (item.status === 'answered') {
            pillStyle = 'bg-[#2B4C56] text-white font-bold shadow-sm';
          }

          return (
            <button
              type="button"
              key={item.number}
              onClick={() => onSelectQuestion(idx)}
              className={`h-11 rounded-xl flex items-center justify-center text-sm font-semibold transition cursor-pointer ${pillStyle}`}
            >
              {formattedNumber}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-y-2.5 gap-x-2 text-[11px] text-slate-600 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2B4C56] shrink-0" />
          <span>Sudah Dijawab ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F5B731] shrink-0" />
          <span>Sedang Dikerjakan</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#6AD2E8] shrink-0" />
          <span>Ragu-ragu ({flaggedCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EAF2F8] border border-slate-300 shrink-0" />
          <span>Belum Dijawab ({unansweredCount})</span>
        </div>
      </div>
    </div>
  );
};
