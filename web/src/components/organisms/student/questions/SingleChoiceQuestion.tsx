import React from 'react';
import { RichHtml } from '@/components/atoms/rich-html';
import type { ChoiceOption } from '@/types/ui';

export interface SingleChoiceQuestionProps {
  questionNumber: number;
  instruction?: string;
  promptCategory?: string;
  questionText: string;
  options: ChoiceOption[];
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
}

export const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({
  instruction = 'Petunjuk: Baca wacana secara teliti, lalu pilih satu opsi respon yang paling tepat dari pilihan A sampai E.',
  promptCategory,
  questionText,
  options,
  selectedOptionId,
  onSelectOption,
}) => {
  return (
    <div className="space-y-4">
      {/* Instruction Box */}
      {instruction && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-100 text-teal-900 text-xs sm:text-sm">
          <svg
            className="w-5 h-5 text-teal-700 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="leading-relaxed">{instruction}</span>
        </div>
      )}

      {/* Question Prompt */}
      <div>
        {promptCategory && (
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            {promptCategory}
          </div>
        )}
        <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          <RichHtml html={questionText} />
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-3 pt-2">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <button
              type="button"
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className={`w-full text-left flex items-start gap-3.5 p-4 rounded-2xl border transition duration-150 cursor-pointer ${
                isSelected
                  ? 'border-[#234E52] bg-[#EAF7F8] shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              {/* Radio Circle Indicator */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition ${
                  isSelected
                    ? 'border-2 border-[#234E52] bg-[#234E52]'
                    : 'border-2 border-slate-300 bg-white'
                }`}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>

              {/* Letter Badge */}
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition ${
                  isSelected ? 'bg-[#234E52] text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {option.label}
              </div>

              {/* Option Title and Optional Description */}
              <div className="flex-1">
                <div
                  className={`text-sm leading-relaxed ${
                    isSelected ? 'font-medium text-slate-900' : 'text-slate-800'
                  }`}
                >
                  <RichHtml html={option.title} />
                </div>
                {option.description && (
                  <div className="text-xs text-slate-500 mt-1">
                    <RichHtml html={option.description} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
