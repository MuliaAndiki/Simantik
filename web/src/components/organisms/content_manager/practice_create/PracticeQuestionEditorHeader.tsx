import { ChevronDown } from 'lucide-react';
import type React from 'react';
import {
  CompetencyCreatableSelect,
  type CompetencyDropdownActionProps,
} from '@/components/molecules/input/CompetencyCreatableSelect';
import type { PracticeQuestionType } from '@/types/ui/practice.types';

export interface PracticeQuestionEditorHeaderProps extends CompetencyDropdownActionProps {
  questionNumber: number;
  questionType: PracticeQuestionType;
  onQuestionTypeChange: (type: PracticeQuestionType) => void;
  competencyId?: string;
  onCompetencyChange?: (competencyId: string) => void;
}

const QUESTION_TYPE_OPTIONS: { label: string; value: PracticeQuestionType }[] = [
  {
    label: 'Pilihan Ganda (Tunggal A-D)',
    value: 'pilihan-ganda',
  },
  {
    label: 'Pilihan Ganda Kompleks (Multi-Centang)',
    value: 'pilihan-ganda-kompleks',
  },
  {
    label: 'Benar / Salah (PGK Kategori)',
    value: 'benar-salah',
  },
  {
    label: 'Tepat / Tidak Tepat',
    value: 'tepat-tidak-tepat',
  },
  {
    label: 'Setuju / Tidak Setuju',
    value: 'setuju-tidak-setuju',
  },
];

export const PracticeQuestionEditorHeader: React.FC<PracticeQuestionEditorHeaderProps> = ({
  questionNumber,
  questionType,
  onQuestionTypeChange,
  competencyId = '',
  onCompetencyChange,
  competencies = [],
  onCreateCompetency,
  onRequestDeleteCompetency,
  isCreatingCompetency = false,
  deletingCompetencyId = null,
}) => {
  const formattedNumber = String(questionNumber).padStart(2, '0');

  return (
    <div className="space-y-4">
      {/* Top Row: SOAL XX Badge + Question Type & Competency Selectors */}
      <div className="space-y-3">
        <div className="inline-block px-3.5 py-1.5 rounded-xl bg-[#134653] text-white font-extrabold text-xs tracking-wider shadow-2xs">
          SOAL {formattedNumber}
        </div>

        <div className={onCompetencyChange ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : undefined}>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Jenis Soal:</label>
            <div className="relative max-w-sm">
              <select
                value={questionType}
                onChange={(e) => onQuestionTypeChange(e.target.value as PracticeQuestionType)}
                className="w-full appearance-none px-3.5 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold cursor-pointer focus:outline-none focus:border-cyan-600 focus:bg-white transition"
              >
                {QUESTION_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {onCompetencyChange && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Kompetensi / Subtes:</label>
              <CompetencyCreatableSelect
                compact
                value={competencyId}
                onChange={(val) => onCompetencyChange(val)}
                competencies={competencies}
                noneLabel="-- Umum / Tanpa Kompetensi Khusus --"
                onCreateCompetency={onCreateCompetency}
                onRequestDeleteCompetency={onRequestDeleteCompetency}
                isCreatingCompetency={isCreatingCompetency}
                deletingCompetencyId={deletingCompetencyId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeQuestionEditorHeader;
