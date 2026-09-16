import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/atoms';
import {
  PracticeResultHeader,
  PracticeResultPalette,
  PracticeResultReviewCard,
  PracticeResultSummary,
  StudentDashboardFooter,
} from '@/components/organisms/student';
import type {
  PracticeResultPaletteItem,
  PracticeResultSummaryData,
  PracticeReviewFilter,
  PracticeReviewItem,
} from '@/types/ui';

export interface StudentPracticeResultTemplateProps {
  summary: PracticeResultSummaryData;
  paletteItems: PracticeResultPaletteItem[];
  reviewItems: PracticeReviewItem[];
  activeFilter: PracticeReviewFilter;
  onSelectFilter: (filter: PracticeReviewFilter) => void;
  onSelectQuestionNumber: (questionNumber: number) => void;
  onPrint?: () => void;
  onBackToDashboard: () => void;
  onRetryPractice: () => void;
  onContinueLearning: () => void;
}

export const StudentPracticeResultTemplate: React.FC<StudentPracticeResultTemplateProps> = ({
  summary,
  paletteItems,
  reviewItems,
  activeFilter,
  onSelectFilter,
  onSelectQuestionNumber,
  onPrint,
  onBackToDashboard,
  onRetryPractice,
  onContinueLearning,
}) => {
  // Filter review items based on activeFilter
  const filteredReviewItems = reviewItems.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-7 pb-10">
      {/* 1. Top Header */}
      <PracticeResultHeader
        categoryLabel={summary.packageName}
        title="Hasil Latihan"
        description="Lihat hasil latihanmu dan pahami pembahasan terstruktur pada setiap butir soal."
        testId={summary.testId}
        onPrint={onPrint}
      />

      {/* 2. Top 2-Column Summary and Question Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <PracticeResultSummary summary={summary} />
        </div>
        <div className="lg:col-span-5">
          <PracticeResultPalette
            totalQuestions={summary.totalQuestions}
            items={paletteItems}
            activeFilter={activeFilter}
            onSelectFilter={onSelectFilter}
            onSelectQuestion={onSelectQuestionNumber}
            correctCount={summary.correctAnswers}
            wrongCount={summary.wrongAnswers}
            unansweredCount={summary.unansweredCount}
          />
        </div>
      </div>

      {/* 3. Section Title */}
      <div className="pt-2">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Review Pembahasan Jawaban
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Pelajari rincian kunci jawaban, analisis opsi, dan stimulus teks
        </p>
      </div>

      {/* 4. Question Review Cards List */}
      <div className="space-y-4">
        {filteredReviewItems.length > 0 ? (
          filteredReviewItems.map((item) => (
            <PracticeResultReviewCard key={item.number} item={item} />
          ))
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 text-slate-500 text-sm">
            Tidak ada butir soal dengan status filter ini.
          </div>
        )}
      </div>

      {/* 5. Bottom Actions Navigation */}
      <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBackToDashboard}
          className="w-full sm:w-auto h-11 px-5 rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold cursor-pointer shadow-none"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" aria-hidden="true" />
          <span>Kembali ke Dashboard</span>
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onRetryPractice}
            className="flex-1 sm:flex-none h-11 px-5 rounded-2xl border-teal-300 bg-cyan-50/50 text-teal-900 hover:bg-cyan-100/60 text-xs sm:text-sm font-semibold cursor-pointer shadow-none"
          >
            <RotateCcw className="w-4 h-4 mr-1.5 text-teal-700" aria-hidden="true" />
            <span>Coba Latihan Lagi</span>
          </Button>

          <Button
            type="button"
            onClick={onContinueLearning}
            className="flex-1 sm:flex-none h-11 px-6 rounded-2xl bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 text-xs sm:text-sm font-bold cursor-pointer shadow-xs border-0"
          >
            <span>Lanjut Belajar Materi</span>
            <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* 6. Footer */}
      <StudentDashboardFooter />
    </div>
  );
};
