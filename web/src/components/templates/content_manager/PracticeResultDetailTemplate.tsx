import { FileQuestion } from 'lucide-react';
import React from 'react';
import { TableLoader } from '@/components/atoms/loading';
import {
  PracticeResultHeader,
  PracticeResultQuestionDetail,
  PracticeResultQuestionPalette,
  type PracticeResultQuestionPaletteItem,
  PracticeResultStatCards,
  PracticeResultStudentCard,
} from '@/components/organisms/content_manager/practice_result';
import type { PracticeAnswerReviewItem, PracticeResultResponse } from '@/types/service';

export interface PracticeResultDetailTemplateProps {
  basePath: string;
  packageId: string;
  resultData: PracticeResultResponse | null;
  selectedQuestionIndex: number;
  onSelectQuestionIndex: (idx: number) => void;
  onBack: () => void;
  onPrint?: () => void;
  onExportPdf?: () => void;
  isLoading?: boolean;
}

export const PracticeResultDetailTemplate: React.FC<PracticeResultDetailTemplateProps> = ({
  basePath,
  packageId,
  resultData,
  selectedQuestionIndex,
  onSelectQuestionIndex,
  onBack,
  onPrint,
  onExportPdf,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <TableLoader label="Memuat lembar jawaban dan hasil pengerjaan siswa..." />
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 bg-slate-100 text-slate-500 rounded-full">
          <FileQuestion className="w-10 h-10" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Data Hasil Tidak Ditemukan</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md">
          Lembar jawaban untuk sesi latihan ini tidak ditemukan atau siswa belum menyelesaikan sesi
          pengerjaan.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 bg-[#134653] hover:bg-[#0B2D38] text-white text-xs font-bold rounded-xl transition cursor-pointer"
        >
          Kembali ke Aktivitas Siswa
        </button>
      </div>
    );
  }

  const reviews = resultData.reviews || [];
  const totalQuestions = resultData.total_questions || reviews.length || 0;
  const currentReview: PracticeAnswerReviewItem | null = reviews[selectedQuestionIndex] ?? null;

  // Build question palette items
  const paletteItems: PracticeResultQuestionPaletteItem[] = reviews.map((rev, idx) => {
    const qNum = rev.question_number || idx + 1;
    return {
      number: qNum,
      formattedNumber: String(qNum).padStart(2, '0'),
      isCorrect: rev.is_correct,
      isUnanswered: !rev.selected_option_id && (!rev.answer_data || rev.answer_data === ''),
    };
  });

  // Calculate wrong question numbers list for the KPI card
  const wrongQuestionNumbers: number[] = reviews
    .filter((rev) => !rev.is_correct)
    .map((rev, idx) => rev.question_number || idx + 1);

  // Duration in minutes
  let durationMinutes = 30;
  if (resultData.started_at && resultData.completed_at) {
    const start = new Date(resultData.started_at).getTime();
    const end = new Date(resultData.completed_at).getTime();
    const diffMin = Math.round((end - start) / 60000);
    if (diffMin > 0) {
      durationMinutes = diffMin;
    }
  }

  // Format Indo Completed Date
  const formatCompletedTime = (raw?: string | null) => {
    if (!raw) return '-';
    try {
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return '-';
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agu',
        'Sep',
        'Okt',
        'Nov',
        'Des',
      ];
      const day = d.getDate();
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      return `${day} ${month} ${year}, ${hours}:${mins}`;
    } catch {
      return '-';
    }
  };

  const accuracy = totalQuestions > 0 ? (resultData.correct_answers / totalQuestions) * 100 : 0;

  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      {/* 1. Top Header (Breadcrumb & Action buttons) */}
      <PracticeResultHeader
        basePath={basePath}
        packageId={packageId}
        packageTitle={resultData.package_title || 'Paket Latihan'}
        onBack={onBack}
        onPrint={onPrint}
        onExportPdf={onExportPdf}
      />

      {/* 2. Student Profile Hero Card */}
      <PracticeResultStudentCard
        studentName={resultData.student_name || 'Siswa'}
        studentEmail={resultData.student_email || '-'}
        studentNis={resultData.student_nis || '-'}
        studentGrade={resultData.student_grade || '-'}
        packageTitle={resultData.package_title || 'Pemahaman Inferensial'}
        totalQuestions={totalQuestions}
        durationMinutes={durationMinutes}
        formattedCompletedAt={formatCompletedTime(resultData.completed_at)}
      />

      {/* 3. 4 KPI Stat Cards */}
      <PracticeResultStatCards
        score={resultData.score}
        correctAnswers={resultData.correct_answers}
        wrongAnswers={resultData.incorrect_answers}
        accuracy={accuracy}
        wrongQuestionNumbers={wrongQuestionNumbers}
      />

      {/* 4. 2-Column Workspace (Palette + Question Detail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Daftar Soal) */}
        <div className="lg:col-span-4 sticky top-6">
          <PracticeResultQuestionPalette
            items={paletteItems}
            selectedIndex={selectedQuestionIndex}
            onSelectIndex={onSelectQuestionIndex}
            correctCount={resultData.correct_answers}
            wrongCount={resultData.incorrect_answers}
          />
        </div>

        {/* Right Column (Question Detail Review) */}
        <div className="lg:col-span-8">
          <PracticeResultQuestionDetail
            review={currentReview}
            currentIndex={selectedQuestionIndex}
            totalQuestions={paletteItems.length}
            onPrev={() => onSelectQuestionIndex(Math.max(0, selectedQuestionIndex - 1))}
            onNext={() =>
              onSelectQuestionIndex(Math.min(paletteItems.length - 1, selectedQuestionIndex + 1))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PracticeResultDetailTemplate;
