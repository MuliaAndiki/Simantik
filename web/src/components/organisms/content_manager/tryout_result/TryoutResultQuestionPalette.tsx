import { Check, CheckCircle2, LayoutGrid, X, XCircle } from 'lucide-react';
import React from 'react';
import type { QuestionReviewResponse } from '@/types/service';

export interface TryoutResultQuestionPaletteProps {
  questions: QuestionReviewResponse[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}

export const TryoutResultQuestionPalette: React.FC<TryoutResultQuestionPaletteProps> = ({
  questions,
  selectedIndex,
  onSelectIndex,
}) => {
  const correctCount = questions.filter((q) => q.is_correct).length;
  const wrongCount = questions.length - correctCount;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="p-1.5 rounded-xl bg-cyan-50 text-cyan-800">
          <LayoutGrid className="w-4 h-4 text-cyan-700" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-black text-slate-900">Palet 30 Soal Pengerjaan</h3>
          <p className="text-[11px] text-slate-400 font-medium">
            Klik nomor untuk meninjau butir soal
          </p>
        </div>
      </div>

      {/* Grid of 30 questions (5 columns) */}
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, idx) => {
          const isSelected = idx === selectedIndex;
          const isCorrect = q.is_correct;
          const qNum = String(q.question_number || idx + 1).padStart(2, '0');

          return (
            <button
              key={q.question_id || idx}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl text-xs font-black transition cursor-pointer ${
                isSelected
                  ? 'ring-2 ring-[#134653] ring-offset-1 z-10 shadow-sm'
                  : 'hover:scale-105'
              } ${
                isCorrect
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300/80 hover:bg-emerald-100/70'
                  : 'bg-rose-50 text-rose-800 border border-rose-300/80 hover:bg-rose-100/70'
              }`}
            >
              <span>{qNum}</span>
              <span className="mt-0.5">
                {isCorrect ? (
                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                ) : (
                  <X className="w-3 h-3 text-rose-600 stroke-[3]" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Summary Legend Bottom */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{correctCount} Benar</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5" />
          <span>{wrongCount} Salah</span>
        </div>
      </div>
    </div>
  );
};

export default TryoutResultQuestionPalette;
