import { Check, CheckCircle2, ListOrdered, X, XCircle } from 'lucide-react';
import React from 'react';

export interface PracticeResultQuestionPaletteItem {
  number: number;
  formattedNumber: string;
  isCorrect: boolean;
  isUnanswered?: boolean;
}

export interface PracticeResultQuestionPaletteProps {
  items: PracticeResultQuestionPaletteItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  correctCount: number;
  wrongCount: number;
}

export const PracticeResultQuestionPalette: React.FC<PracticeResultQuestionPaletteProps> = ({
  items,
  selectedIndex,
  onSelectIndex,
  correctCount,
  wrongCount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-[#0E7490]" />
          <h3 className="text-sm font-bold text-slate-900">Daftar Soal</h3>
        </div>
        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
          {items.length} Soal
        </span>
      </div>

      {/* Grid Palette */}
      <div className="grid grid-cols-4 gap-2.5">
        {items.map((item, idx) => {
          const isSelected = idx === selectedIndex;
          const isCorrect = item.isCorrect;
          const isUnanswered = item.isUnanswered;

          return (
            <button
              key={item.number}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSelected ? 'ring-2 ring-amber-400 ring-offset-1 shadow-sm' : 'hover:opacity-90'
              } ${
                isUnanswered
                  ? 'bg-slate-50 border-slate-200 text-slate-500'
                  : isCorrect
                    ? 'bg-[#EAF6F8] border-[#0E7490]/30 text-[#0E7490]'
                    : 'bg-[#FEF2F2] border-rose-200 text-rose-600'
              }`}
            >
              {/* Active Indicator Dot */}
              {isSelected && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
              )}

              {/* Question Number */}
              <span className="text-xs font-black leading-none mb-1">{item.formattedNumber}</span>

              {/* Status Icon Indicator */}
              {isUnanswered ? (
                <span className="text-[10px] text-slate-400 font-bold">-</span>
              ) : isCorrect ? (
                <Check className="w-3.5 h-3.5 text-[#0E7490] stroke-[2.5]" />
              ) : (
                <X className="w-3.5 h-3.5 text-rose-500 stroke-[2.5]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Keterangan Jawaban Footer */}
      <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3.5 space-y-2.5">
        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
          KETERANGAN JAWABAN
        </p>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-teal-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Benar</span>
          </div>
          <span className="font-extrabold text-teal-800">{correctCount} Soal</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-rose-600">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Salah</span>
          </div>
          <span className="font-extrabold text-rose-700">{wrongCount} Soal</span>
        </div>
      </div>
    </div>
  );
};

export default PracticeResultQuestionPalette;
