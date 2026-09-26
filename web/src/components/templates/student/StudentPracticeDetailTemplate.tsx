import React from 'react';
import { PracticeConfirmModal } from '@/components/organisms/student/PracticeConfirmModal';
import { PracticePreStartModal } from '@/components/organisms/student/PracticePreStartModal';
import { PracticeProctoringWarningModal } from '@/components/organisms/student/PracticeProctoringWarningModal';
import { PracticeQuestionHeader } from '@/components/organisms/student/PracticeQuestionHeader';
import {
  PracticeQuestionPalette,
  type QuestionPaletteItem,
} from '@/components/organisms/student/PracticeQuestionPalette';
import { PracticeQuestionStimulus } from '@/components/organisms/student/PracticeQuestionStimulus';
import { ComplexMultipleChoiceQuestion } from '@/components/organisms/student/questions/ComplexMultipleChoiceQuestion';
import { MatrixCategoryQuestion } from '@/components/organisms/student/questions/MatrixCategoryQuestion';
import { SingleChoiceQuestion } from '@/components/organisms/student/questions/SingleChoiceQuestion';
import { StudentDashboardFooter } from '@/components/organisms/student/StudentDashboardFooter';
import type {
  ChoiceOption,
  MatrixStatement,
  PracticeQuestionItem,
  QuestionAnswerValue,
} from '@/types/ui';

export interface StudentPracticeDetailTemplateProps {
  competencyName: string;
  categoryLabel?: string;
  title: string;
  subCategory?: string;
  isFlagged: boolean;
  onToggleFlag: () => void;
  onExit: () => void;

  currentQuestion: PracticeQuestionItem;
  currentAnswer?: QuestionAnswerValue;
  feedback?: { isCorrect?: boolean; explanation?: string; answeringTips?: string };
  onSelectSingleChoice: (optionId: string) => void;
  onToggleComplexChoice: (optionId: string) => void;
  onSelectMatrixChoice: (statementId: string, value: string) => void;

  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;

  paletteItems: QuestionPaletteItem[];
  onSelectQuestionNumber: (index: number) => void;

  // Pre-start modal
  isPreStartModalOpen: boolean;
  isPreStartChecked: boolean;
  onPreStartCheckChange: (checked: boolean) => void;
  onPreStartConfirm: () => void;
  onPreStartClose: () => void;

  // Proctoring warning modal
  isWarningModalOpen: boolean;
  violationCount: number;
  onWarningDismiss: () => void;

  // Confirmation modal (exit or submit)
  isConfirmModalOpen: boolean;
  confirmModalType: 'exit' | 'submit';
  onConfirmModalCancel: () => void;
  onConfirmModalProceed: () => void;
}

export const StudentPracticeDetailTemplate: React.FC<StudentPracticeDetailTemplateProps> = ({
  competencyName,
  categoryLabel,
  title,
  subCategory,
  isFlagged,
  onToggleFlag,
  onExit,
  currentQuestion,
  currentAnswer,
  feedback,
  onSelectSingleChoice,
  onToggleComplexChoice,
  onSelectMatrixChoice,
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  paletteItems,
  onSelectQuestionNumber,
  isPreStartModalOpen,
  isPreStartChecked,
  onPreStartCheckChange,
  onPreStartConfirm,
  onPreStartClose,
  isWarningModalOpen,
  violationCount,
  onWarningDismiss,
  isConfirmModalOpen,
  confirmModalType,
  onConfirmModalCancel,
  onConfirmModalProceed,
}) => {
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Counts for confirm modal
  const answeredCount = paletteItems.filter((p) => p.status === 'answered').length;
  const flaggedCount = paletteItems.filter((p) => p.status === 'flagged').length;
  const unansweredCount = paletteItems.filter((p) => p.status === 'unanswered').length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-8">
      {/* 1. Header */}
      <PracticeQuestionHeader
        competencyName={competencyName}
        categoryLabel={categoryLabel}
        title={title}
        subCategory={subCategory}
        isFlagged={isFlagged}
        onToggleFlag={onToggleFlag}
        onExit={onExit}
      />

      {/* 2. Main 2-Column Working Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Question Box + Navigations */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
          {/* Optional Stimulus */}
          {currentQuestion.stimulus && (
            <PracticeQuestionStimulus stimulus={currentQuestion.stimulus} />
          )}

          {/* Question Body Depending on Type */}
          {currentQuestion.type === 'pilihan-ganda' && (
            <SingleChoiceQuestion
              questionNumber={currentQuestion.questionNumber}
              instruction={currentQuestion.instruction}
              promptCategory={currentQuestion.promptCategory}
              questionText={currentQuestion.questionText}
              options={currentQuestion.options || []}
              selectedOptionId={typeof currentAnswer === 'string' ? currentAnswer : undefined}
              onSelectOption={onSelectSingleChoice}
            />
          )}

          {currentQuestion.type === 'pilihan-ganda-kompleks' && (
            <ComplexMultipleChoiceQuestion
              questionNumber={currentQuestion.questionNumber}
              instruction={currentQuestion.instruction}
              promptCategory={currentQuestion.promptCategory}
              questionText={currentQuestion.questionText}
              options={currentQuestion.options || []}
              selectedOptionIds={Array.isArray(currentAnswer) ? currentAnswer : []}
              onToggleOption={onToggleComplexChoice}
            />
          )}

          {currentQuestion.type === 'benar-salah' && (
            <MatrixCategoryQuestion
              mode="BENAR_SALAH"
              questionNumber={currentQuestion.questionNumber}
              instruction={currentQuestion.instruction}
              promptCategory={currentQuestion.promptCategory}
              questionText={currentQuestion.questionText}
              statements={currentQuestion.statements || []}
              answers={
                typeof currentAnswer === 'object' && !Array.isArray(currentAnswer)
                  ? (currentAnswer as Record<string, string>)
                  : {}
              }
              onSelectMatrixAnswer={onSelectMatrixChoice}
            />
          )}

          {currentQuestion.type === 'tepat-tidak-tepat' && (
            <MatrixCategoryQuestion
              mode="TEPAT_TIDAK_TEPAT"
              questionNumber={currentQuestion.questionNumber}
              instruction={currentQuestion.instruction}
              promptCategory={currentQuestion.promptCategory}
              questionText={currentQuestion.questionText}
              statements={currentQuestion.statements || []}
              answers={
                typeof currentAnswer === 'object' && !Array.isArray(currentAnswer)
                  ? (currentAnswer as Record<string, string>)
                  : {}
              }
              onSelectMatrixAnswer={onSelectMatrixChoice}
            />
          )}

          {currentQuestion.type === 'setuju-tidak-setuju' && (
            <MatrixCategoryQuestion
              mode="SETUJU_TIDAK_SETUJU"
              questionNumber={currentQuestion.questionNumber}
              instruction={currentQuestion.instruction}
              promptCategory={currentQuestion.promptCategory}
              questionText={currentQuestion.questionText}
              statements={currentQuestion.statements || []}
              answers={
                typeof currentAnswer === 'object' && !Array.isArray(currentAnswer)
                  ? (currentAnswer as Record<string, string>)
                  : {}
              }
              onSelectMatrixAnswer={onSelectMatrixChoice}
            />
          )}

          {/* Immediate Feedback Box (Lazy implementation) */}
          {feedback && feedback.isCorrect !== undefined && (
            <div
              className={`mt-6 p-5 rounded-2xl border ${feedback.isCorrect ? 'bg-teal-50 border-teal-200' : 'bg-red-50 border-red-200'}`}
            >
              <div
                className={`font-black text-lg mb-2 flex items-center gap-2 ${feedback.isCorrect ? 'text-teal-800' : 'text-red-800'}`}
              >
                {feedback.isCorrect ? 'Benar!' : 'Salah!'}
              </div>
              {feedback.explanation && (
                <div
                  className="text-sm text-slate-700 prose prose-sm max-w-none"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: by design
                  dangerouslySetInnerHTML={{ __html: feedback.explanation }}
                />
              )}
              {feedback.answeringTips && (
                <div className="text-sm text-slate-600 mt-3 font-medium bg-white/60 p-3 rounded-xl border border-white">
                  <strong className="text-slate-800">Tips:</strong> {feedback.answeringTips}
                </div>
              )}
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={onPrevious}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Sebelumnya</span>
            </button>

            <div className="flex items-center gap-2">
              {/* Optional Middle "Selesai Latihan" button (shown as designed in Katagori Tetap Tidak Tepat.png) */}
              <button
                type="button"
                onClick={onSubmit}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-teal-200 bg-teal-50 text-teal-900 text-xs sm:text-sm font-semibold hover:bg-teal-100 transition cursor-pointer"
              >
                <svg
                  className="w-4 h-4 text-teal-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Selesai Latihan</span>
              </button>

              {!isLastQuestion ? (
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 text-xs sm:text-sm font-bold transition cursor-pointer shadow-sm"
                >
                  <span>Lanjut</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSubmit}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 text-xs sm:text-sm font-bold transition cursor-pointer shadow-sm"
                >
                  <span>Selesai & Kumpulkan</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Question Palette */}
        <div className="lg:col-span-4">
          <PracticeQuestionPalette
            totalQuestions={totalQuestions}
            items={paletteItems}
            currentIndex={currentIndex}
            onSelectQuestion={onSelectQuestionNumber}
          />
        </div>
      </div>

      {/* 3. Modals */}
      <PracticePreStartModal
        isOpen={isPreStartModalOpen}
        isChecked={isPreStartChecked}
        onCheckChange={onPreStartCheckChange}
        onConfirm={onPreStartConfirm}
        onClose={onPreStartClose}
      />

      <PracticeProctoringWarningModal
        isOpen={isWarningModalOpen}
        violationCount={violationCount}
        onDismiss={onWarningDismiss}
      />

      <PracticeConfirmModal
        isOpen={isConfirmModalOpen}
        type={confirmModalType}
        answeredCount={answeredCount}
        flaggedCount={flaggedCount}
        unansweredCount={unansweredCount}
        totalQuestions={totalQuestions}
        onCancel={onConfirmModalCancel}
        onConfirm={onConfirmModalProceed}
      />

      {/* 4. Footer */}
      <StudentDashboardFooter />
    </div>
  );
};
