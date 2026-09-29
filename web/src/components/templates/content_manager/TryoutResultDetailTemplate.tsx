import React from 'react';
import { TableLoader } from '@/components/atoms/loading';
import {
  TryoutResultHeader,
  TryoutResultQuestionDetail,
  TryoutResultQuestionPalette,
  TryoutResultStatCards,
  TryoutResultStudentCard,
} from '@/components/organisms/content_manager/tryout_result';
import type { AttemptReviewResponse } from '@/types/service';

export interface TryoutResultDetailTemplateProps {
  review: AttemptReviewResponse | null;
  isLoading: boolean;
  selectedQuestionIndex: number;
  onSelectQuestionIndex: (index: number) => void;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
  onBack: () => void;
  onPrint?: () => void;
  onExportPdf?: () => void;
}

export const TryoutResultDetailTemplate: React.FC<TryoutResultDetailTemplateProps> = ({
  review,
  isLoading,
  selectedQuestionIndex,
  onSelectQuestionIndex,
  onPrevQuestion,
  onNextQuestion,
  onBack,
  onPrint,
  onExportPdf,
}) => {
  const questions = review?.questions ?? [];
  const currentQuestion = questions[selectedQuestionIndex] ?? null;

  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      {/* Top Header */}
      <TryoutResultHeader
        tryoutTitle={review?.tryout_title || 'Simulasi Tryout'}
        onBack={onBack}
        onPrint={onPrint}
        onExportPdf={onExportPdf}
      />

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-10">
          <TableLoader label="Memuat rincian hasil pengerjaan siswa..." />
        </div>
      ) : (
        <>
          {/* Student Profile Card */}
          <TryoutResultStudentCard review={review} />

          {/* 5 KPI Stat Cards */}
          <TryoutResultStatCards review={review} />

          {/* Question Palette & Question Details Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sidebar: 30 Questions Palette (4 cols) */}
            <div className="lg:col-span-4 sticky top-6">
              <TryoutResultQuestionPalette
                questions={questions}
                selectedIndex={selectedQuestionIndex}
                onSelectIndex={onSelectQuestionIndex}
              />
            </div>

            {/* Right Main Column: Question Detail & Academic Explanation (8 cols) */}
            <div className="lg:col-span-8">
              <TryoutResultQuestionDetail
                question={currentQuestion}
                currentIndex={selectedQuestionIndex}
                totalQuestions={questions.length}
                onPrev={onPrevQuestion}
                onNext={onNextQuestion}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TryoutResultDetailTemplate;
