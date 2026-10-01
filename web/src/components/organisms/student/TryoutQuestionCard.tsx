import { ArrowLeft, ArrowRight, Check, Lock } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/atoms/button';
import { RichHtml } from '@/components/atoms/rich-html';
import type {
  TryoutAnswerValue,
  TryoutChoiceOption,
  TryoutMatrixStatement,
  TryoutQuestionItem,
} from '@/types/ui';
import { cn } from '@/utils/classname';

export interface TryoutQuestionCardProps {
  question: TryoutQuestionItem;
  currentAnswer?: TryoutAnswerValue;
  isLastQuestion?: boolean;
  isSubmitting?: boolean;
  onSelectSingleChoice: (optionId: string) => void;
  onToggleComplexChoice: (optionId: string) => void;
  onSelectMatrixChoice: (statementId: string, value: string) => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  className?: string;
}

export const TryoutQuestionCard: React.FC<TryoutQuestionCardProps> = ({
  question,
  currentAnswer,
  isLastQuestion = false,
  isSubmitting = false,
  onSelectSingleChoice,
  onToggleComplexChoice,
  onSelectMatrixChoice,
  onNext,
  isNextDisabled = false,
  className,
}) => {
  const selectedSingle = typeof currentAnswer === 'string' ? currentAnswer : '';
  const selectedComplex = Array.isArray(currentAnswer) ? currentAnswer : [];
  const selectedMatrix =
    typeof currentAnswer === 'object' && !Array.isArray(currentAnswer) && currentAnswer !== null
      ? (currentAnswer as Record<string, string>)
      : {};

  return (
    <article
      aria-label={`Soal Nomor ${question.questionNumber}`}
      className={cn(
        'w-full bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between gap-8 min-h-[460px]',
        className
      )}
    >
      {/* 1. Question Prompt & Stimulus */}
      <div className="space-y-6">
        {/* Optional stimulus context */}
        {question.stimulus && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {question.stimulus.title && (
              <div className="font-bold text-slate-900 mb-1.5 uppercase tracking-wider text-xs">
                {question.stimulus.title}
              </div>
            )}
            {Array.isArray(question.stimulus.content) ? (
              question.stimulus.content?.map((par, i) => (
                <p key={`stimulus-par-${i}`} className="mb-2 last:mb-0">
                  <RichHtml html={par} />
                </p>
              ))
            ) : (
              <RichHtml html={question.stimulus.content} />
            )}
          </div>
        )}

        {/* Primary Question Prompt */}
        <div className="text-base sm:text-lg md:text-xl font-bold text-slate-900 leading-snug">
          <RichHtml html={question.questionText} />
        </div>

        {/* 2. Interactive Answer Options */}
        <div className="space-y-3 pt-1">
          {/* A. Pilihan Ganda Kompleks (Multi-Select Checkboxes with Subtitle Description) */}
          {question.type === 'pilihan-ganda-kompleks' &&
            question.options?.map((option: TryoutChoiceOption) => {
              const isChecked = selectedComplex.includes(option.id);

              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => onToggleComplexChoice(option.id)}
                  aria-checked={isChecked}
                  role="checkbox"
                  className={cn(
                    'w-full text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4',
                    isChecked
                      ? 'bg-[#EBF7F9] border-[#50C8DC] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  )}
                >
                  {/* Checkbox indicator */}
                  <div
                    className={cn(
                      'w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                      isChecked ? 'bg-[#244252] text-white' : 'border-2 border-slate-300 bg-white'
                    )}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  {/* Option Title & Description Subtitle */}
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      <RichHtml html={option.title} />
                    </p>
                    {option.description && (
                      <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mt-1">
                        <RichHtml html={option.description} />
                      </p>
                    )}
                  </div>
                </button>
              );
            })}

          {/* B. Pilihan Ganda Biasa (Single Choice Radio) */}
          {question.type === 'pilihan-ganda' &&
            question.options?.map((option: TryoutChoiceOption) => {
              const isSelected = selectedSingle === option.id;

              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => onSelectSingleChoice(option.id)}
                  aria-checked={isSelected}
                  role="radio"
                  className={cn(
                    'w-full text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4',
                    isSelected
                      ? 'bg-[#EBF7F9] border-[#50C8DC] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  )}
                >
                  {/* Radio / Label Badge */}
                  <div
                    className={cn(
                      'w-8 h-8 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 transition-colors',
                      isSelected
                        ? 'bg-[#244252] text-white'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    )}
                  >
                    {option.label}
                  </div>

                  {/* Option Text */}
                  <div className="flex-1 text-xs sm:text-sm md:text-base font-medium text-slate-900 leading-snug">
                    <RichHtml html={option.title} />
                    {option.description && (
                      <p className="text-xs text-slate-500 font-normal mt-0.5">
                        <RichHtml html={option.description} />
                      </p>
                    )}
                  </div>
                </button>
              );
            })}

          {/* C. Kategori Matriks (Benar-Salah / Tepat-Tidak Tepat / Setuju-Tidak Setuju) */}
          {(question.type === 'benar-salah' ||
            question.type === 'tepat-tidak-tepat' ||
            question.type === 'setuju-tidak-setuju') &&
            question.statements?.map((stmt: TryoutMatrixStatement) => {
              const currentVal = selectedMatrix[stmt.id] || '';
              const optionA =
                question.type === 'benar-salah'
                  ? 'BENAR'
                  : question.type === 'tepat-tidak-tepat'
                    ? 'TEPAT'
                    : 'SETUJU';
              const optionB =
                question.type === 'benar-salah'
                  ? 'SALAH'
                  : question.type === 'tepat-tidak-tepat'
                    ? 'TIDAK_TEPAT'
                    : 'TIDAK_SETUJU';

              const labelA =
                question.type === 'benar-salah'
                  ? 'Benar'
                  : question.type === 'tepat-tidak-tepat'
                    ? 'Tepat'
                    : 'Setuju';
              const labelB =
                question.type === 'benar-salah'
                  ? 'Salah'
                  : question.type === 'tepat-tidak-tepat'
                    ? 'Tidak Tepat'
                    : 'Tidak Setuju';

              return (
                <div
                  key={stmt.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <p className="text-xs sm:text-sm font-medium text-slate-900 flex-1 leading-snug">
                    <RichHtml html={stmt.statement} />
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelectMatrixChoice(stmt.id, optionA)}
                      className={cn(
                        'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border',
                        currentVal === optionA
                          ? 'bg-[#244252] text-white border-[#244252]'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      )}
                    >
                      {labelA}
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectMatrixChoice(stmt.id, optionB)}
                      className={cn(
                        'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border',
                        currentVal === optionB
                          ? 'bg-[#244252] text-white border-[#244252]'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      )}
                    >
                      {labelB}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* 3. Bottom Action Bar */}
      <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Disabled "Sebelumnya" Button (Adaptive Locking) */}
        <Button
          type="button"
          disabled
          variant="outline"
          className="w-full sm:w-auto h-11 px-5 rounded-full bg-[#EAF6F8]/60 border border-cyan-100/60 text-slate-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" aria-hidden="true" />
          <span>Sebelumnya</span>
          <Lock className="w-3 h-3 text-slate-400 ml-0.5" aria-hidden="true" />
        </Button>

        {/* Right: Lanjut (tanpa lompat soal, tandai ragu-ragu tidak berlaku) */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Lanjut -> or Selesai Action Button */}
          <Button
            type="button"
            onClick={onNext}
            disabled={isSubmitting || isNextDisabled}
            title={isNextDisabled ? 'Pilih jawaban dulu sebelum lanjut' : undefined}
            className="flex-1 sm:flex-none h-11 px-6 rounded-full bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer border-0 transition-transform active:scale-95"
          >
            <span>{isLastQuestion ? 'Selesai & Kumpulkan' : 'Lanjut'}</span>
            {isLastQuestion ? (
              <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
            ) : (
              <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default TryoutQuestionCard;
