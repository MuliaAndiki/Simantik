import React from 'react';
import type { ChoiceOption } from '@/types/ui';

export interface ComplexMultipleChoiceQuestionProps {
  questionNumber: number;
  instruction?: string;
  promptCategory?: string;
  questionText: string;
  options: ChoiceOption[];
  selectedOptionIds?: string[];
  onToggleOption: (optionId: string) => void;
}

export const ComplexMultipleChoiceQuestion: React.FC<ComplexMultipleChoiceQuestionProps> = ({
  instruction = 'Pilih semua opsi yang tepat berdasarkan isi argumen. Jawaban benar dapat lebih dari satu.',
  promptCategory,
  questionText,
  options,
  selectedOptionIds = [],
  onToggleOption,
}) => {
  return (
    <div className="space-y-4">
      {/* Instruction Box */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-cyan-50/80 border border-cyan-100 text-teal-900 text-xs sm:text-sm">
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <div>
          <div className="font-bold uppercase tracking-wider text-xs text-teal-800 mb-0.5">
            Petunjuk Pilihan Ganda Kompleks (MCMA)
          </div>
          <div className="leading-relaxed text-teal-900/90">{instruction}</div>
        </div>
      </div>

      {/* Question Prompt */}
      <div>
        {promptCategory && (
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            {promptCategory}
          </div>
        )}
        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {questionText}
        </h4>
      </div>

      {/* Checkbox Options List */}
      <div className="space-y-3 pt-2">
        {options.map((option) => {
          const isChecked = selectedOptionIds.includes(option.id);
          return (
            <button
              type="button"
              key={option.id}
              onClick={() => onToggleOption(option.id)}
              className={`w-full text-left flex items-start gap-3.5 p-4 rounded-2xl border transition duration-150 cursor-pointer ${
                isChecked
                  ? 'border-[#234E52] bg-[#EAF7F8] shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              {/* Checkbox Box Indicator */}
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition ${
                  isChecked
                    ? 'bg-[#234E52] border border-[#234E52] text-white'
                    : 'border-2 border-slate-300 bg-white'
                }`}
              >
                {isChecked && (
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              {/* Option Title and Description */}
              <div className="flex-1">
                <div
                  className={`text-sm leading-snug ${
                    isChecked ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'
                  }`}
                >
                  {option.title}
                </div>
                {option.description && (
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {option.description}
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
