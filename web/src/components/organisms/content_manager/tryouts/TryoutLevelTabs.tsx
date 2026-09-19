import { Layers } from 'lucide-react';
import type React from 'react';
import type {
  TryoutAdaptiveQuestionItemForm,
  TryoutDifficultyLevel,
} from '@/types/ui/tryout-question-editor.types';
import { cn } from '@/utils/classname';

export interface TryoutLevelTabsProps {
  question: TryoutAdaptiveQuestionItemForm;
  onLevelChange: (level: TryoutDifficultyLevel) => void;
}

const LEVEL_CONFIG: {
  level: TryoutDifficultyLevel;
  code: string;
  name: string;
}[] = [
  { level: 1, code: 'C1', name: 'Mengingat (Mudah)' },
  { level: 2, code: 'C2', name: 'Memahami' },
  { level: 3, code: 'C3', name: 'Menerapkan (Sedang)' },
  { level: 4, code: 'C4', name: 'Menganalisis (Sukar)' },
  { level: 5, code: 'C5', name: 'Mengevaluasi' },
];

export const TryoutLevelTabs: React.FC<TryoutLevelTabsProps> = ({ question, onLevelChange }) => {
  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-700" />
          <span>Varian Level Soal Adaptif (C1 — C5)</span>
        </span>
        <span className="text-[11px] text-slate-400 font-medium">5 varian per butir soal</span>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {LEVEL_CONFIG.map(({ level, code, name }) => {
          const isCurrent = question.activeLevel === level;
          const variant = question.variants[level];
          const isFilled = variant && variant.questionText.trim().length > 0;

          return (
            <button
              key={level}
              type="button"
              onClick={() => onLevelChange(level)}
              className={cn(
                'py-2 px-1.5 sm:px-3 rounded-xl font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer text-center',
                isCurrent
                  ? 'bg-[#134653] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70'
              )}
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  isFilled ? 'bg-emerald-400 ring-1 ring-emerald-500/50' : 'bg-slate-300'
                )}
              />
              <span className="text-xs sm:text-sm font-extrabold">{code}</span>
              <span
                className={cn(
                  'text-[10px] font-medium hidden md:inline truncate',
                  isCurrent ? 'text-cyan-100' : 'text-slate-400'
                )}
              >
                {name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TryoutLevelTabs;
