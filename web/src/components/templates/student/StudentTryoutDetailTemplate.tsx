import React from 'react';
import {
  PracticeProctoringWarningModal,
  StimulusRereadCard,
  StudentDashboardFooter,
  TryoutConfirmModal,
  TryoutHeader,
  TryoutPreStartModal,
  TryoutQuestionCard,
  TryoutQuestionPalette,
  TryoutTimeoutModal,
} from '@/components/organisms/student';
import type { TryoutAnswerValue, TryoutPaletteItem, TryoutQuestionItem } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface StudentTryoutDetailTemplateProps {
  title?: string;
  currentQuestionNumber: number;
  totalQuestions: number;
  formattedTime: string;
  isUrgent?: boolean;
  onBack: () => void;
  onExit: () => void;

  question: TryoutQuestionItem;
  currentAnswer?: TryoutAnswerValue;
  isLastQuestion?: boolean;
  isSubmitting?: boolean;
  onSelectSingleChoice: (optionId: string) => void;
  onToggleComplexChoice: (optionId: string) => void;
  onSelectMatrixChoice: (statementId: string, value: string) => void;
  onNext: () => void;
  isNextDisabled?: boolean;

  paletteItems: TryoutPaletteItem[];

  // Modals state
  isPreStartModalOpen: boolean;
  isPreStartChecked: boolean;
  onPreStartCheckChange: (checked: boolean) => void;
  onPreStartConfirm: () => void;
  onPreStartClose: () => void;

  isWarningModalOpen: boolean;
  violationCount: number;
  onWarningDismiss: () => void;

  isConfirmModalOpen: boolean;
  confirmModalType: 'exit' | 'submit';
  answeredCount: number;
  onConfirmModalCancel: () => void;
  onConfirmModalProceed: () => void;

  // Timeout Modal state
  isTimeoutModalOpen?: boolean;
  onTimeoutProceed?: () => void;
  durationMinutes?: number;

  className?: string;
}

export const StudentTryoutDetailTemplate: React.FC<StudentTryoutDetailTemplateProps> = ({
  title,
  currentQuestionNumber,
  totalQuestions,
  formattedTime,
  isUrgent,
  onBack,
  onExit,

  question,
  currentAnswer,
  isLastQuestion,
  isSubmitting,
  onSelectSingleChoice,
  onToggleComplexChoice,
  onSelectMatrixChoice,
  onNext,
  isNextDisabled = false,

  paletteItems,

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
  answeredCount,
  onConfirmModalCancel,
  onConfirmModalProceed,

  isTimeoutModalOpen = false,
  onTimeoutProceed,
  durationMinutes = 75,

  className,
}) => {
  return (
    <div
      className={cn(
        'w-full max-w-full mx-auto space-y-6 md:space-y-8 pb-10 select-none',
        className
      )}
    >
      {/* 1. Header with Breadcrumbs, Title, Timer Capsule & Exit Button */}
      <TryoutHeader
        title={title}
        currentQuestionNumber={currentQuestionNumber}
        totalQuestions={totalQuestions}
        formattedTime={formattedTime}
        isUrgent={isUrgent}
        onBack={onBack}
        onExit={onExit}
      />

      {/* 2. Main Two-Column Exam Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: Active Question Card (Width: 8 cols on large screens) */}
        <section className="lg:col-span-8 w-full">
          <TryoutQuestionCard
            question={question}
            currentAnswer={currentAnswer}
            isLastQuestion={isLastQuestion}
            isSubmitting={isSubmitting}
            onSelectSingleChoice={onSelectSingleChoice}
            onToggleComplexChoice={onToggleComplexChoice}
            onSelectMatrixChoice={onSelectMatrixChoice}
            onNext={onNext}
            isNextDisabled={isNextDisabled}
          />
        </section>

        {/* Right: Question Palette & Adaptive Info (Width: 4 cols on large screens) */}
        <section className="lg:col-span-4 w-full flex flex-col gap-6 lg:gap-8">
          <TryoutQuestionPalette items={paletteItems} totalQuestions={totalQuestions} />
          <StimulusRereadCard
            stimulus={question.stimulus}
            questionNumber={currentQuestionNumber}
            relatedQuestionNumbers={question.relatedQuestionNumbers}
          />
        </section>
      </div>

      {/* 3. Pop-up Modals */}
      {/* Pre-Start Rules Modal */}
      <TryoutPreStartModal
        isOpen={isPreStartModalOpen}
        isChecked={isPreStartChecked}
        totalQuestions={totalQuestions}
        onCheckChange={onPreStartCheckChange}
        onConfirm={onPreStartConfirm}
        onClose={onPreStartClose}
      />

      {/* Proctoring Warning Modal (Level 1, 2, 3) */}
      <PracticeProctoringWarningModal
        isOpen={isWarningModalOpen}
        violationCount={violationCount}
        onDismiss={onWarningDismiss}
      />

      {/* Exit / Submit Confirmation Modal */}
      <TryoutConfirmModal
        isOpen={isConfirmModalOpen}
        type={confirmModalType}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        remainingTimeFormatted={formattedTime}
        onCancel={onConfirmModalCancel}
        onConfirm={onConfirmModalProceed}
      />

      {/* Auto Submit Timeout Modal */}
      <TryoutTimeoutModal
        isOpen={isTimeoutModalOpen}
        tryoutTitle={title}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        durationMinutes={durationMinutes}
        onProceed={onTimeoutProceed || (() => {})}
      />

      {/* 4. Unified Dashboard Footer */}
      <StudentDashboardFooter />
    </div>
  );
};

export default StudentTryoutDetailTemplate;
