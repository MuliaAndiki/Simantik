import { ChevronLeft, ChevronRight, ListOrdered, Plus, Trash2 } from 'lucide-react';
import type React from 'react';
import type { QuestionEditorItemForm } from '@/types/ui/practice-question-editor.types';

export interface PracticeQuestionPaletteCardProps {
  questions: QuestionEditorItemForm[];
  activeQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  onAddQuestion: () => void;
  onDeleteQuestion?: (index: number) => void;
  onSaveQuestions: () => void;
  isSubmitting?: boolean;
}

export const PracticeQuestionPaletteCard: React.FC<PracticeQuestionPaletteCardProps> = ({
  questions,
  activeQuestionIndex,
  onSelectQuestion,
  onAddQuestion,
  onDeleteQuestion,
  onSaveQuestions,
  isSubmitting = false,
}) => {
  const getQuestionTypeBadge = (type: string) => {
    switch (type) {
      case 'pilihan-ganda':
        return 'PG';
      case 'pilihan-ganda-kompleks':
        return 'PGK';
      case 'benar-salah':
        return 'B/S';
      case 'tepat-tidak-tepat':
        return 'TP/TTP';
      case 'setuju-tidak-setuju':
        return 'S/T';
      default:
        return 'PG';
    }
  };

  const filledQuestionsCount = questions.filter((q) => q.questionText.trim().length > 0).length;
  const activeFormattedNumber = String(activeQuestionIndex + 1).padStart(2, '0');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-slate-600" />
          <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
            Daftar Soal
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Soal Terisi: {filledQuestionsCount}
        </span>
      </div>

      {/* Palette Container */}
      <div className="bg-[#EAF6F8]/60 border border-cyan-100 rounded-2xl p-3.5 sm:p-4 space-y-3">
        <div className="grid grid-cols-5 sm:grid-cols-5 gap-2">
          {questions.map((q, idx) => {
            const isActive = idx === activeQuestionIndex;
            const typeBadge = getQuestionTypeBadge(q.questionType);
            const formattedNumber = String(idx + 1).padStart(2, '0');

            return (
              <button
                key={q.id || idx}
                type="button"
                onClick={() => onSelectQuestion(idx)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition cursor-pointer text-center ${
                  isActive
                    ? 'bg-[#134653] text-white shadow-xs ring-2 ring-[#0E3A45]'
                    : 'bg-[#184E5B] hover:bg-[#134653] text-white/90'
                }`}
              >
                <span className="text-xs sm:text-sm font-extrabold tracking-tight">
                  {formattedNumber}
                </span>
                <span
                  className={`text-[9px] font-bold tracking-wider uppercase mt-0.5 ${
                    isActive ? 'text-amber-300' : 'text-cyan-200'
                  }`}
                >
                  {typeBadge}
                </span>
              </button>
            );
          })}

          {/* Add Question Button */}
          <button
            type="button"
            onClick={onAddQuestion}
            className="flex flex-col items-center justify-center min-h-[50px] p-2 rounded-xl border border-dashed border-cyan-300 bg-white/80 hover:bg-white hover:border-cyan-600 text-cyan-800 transition cursor-pointer shadow-2xs"
            title="Tambah Soal Baru"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Navigation Arrows if questions count > 10 */}
        {questions.length > 10 && (
          <div className="flex items-center justify-center gap-3 pt-2 border-t border-cyan-100/80">
            <button
              type="button"
              disabled={activeQuestionIndex <= 0}
              onClick={() => onSelectQuestion(activeQuestionIndex - 1)}
              className="p-1.5 rounded-lg border border-cyan-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-600">
              {activeQuestionIndex + 1} / {questions.length}
            </span>
            <button
              type="button"
              disabled={activeQuestionIndex >= questions.length - 1}
              onClick={() => onSelectQuestion(activeQuestionIndex + 1)}
              className="p-1.5 rounded-lg border border-cyan-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Delete Active Question Button */}
        {onDeleteQuestion && (
          <div className="pt-2 border-t border-cyan-100/80">
            <button
              type="button"
              onClick={() => onDeleteQuestion(activeQuestionIndex)}
              disabled={questions.length <= 1 || isSubmitting}
              className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs transition cursor-pointer shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
              title={
                questions.length <= 1
                  ? 'Minimal harus ada 1 butir soal'
                  : `Hapus Soal ${activeFormattedNumber}`
              }
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Hapus Soal {activeFormattedNumber}</span>
            </button>
          </div>
        )}
      </div>

      {/* Simpan Soal Action Button */}
      <button
        type="button"
        onClick={onSaveQuestions}
        disabled={isSubmitting}
        className="w-full py-3 px-4 rounded-xl bg-[#F5B731] hover:bg-[#E0A422] text-slate-900 font-bold text-xs sm:text-sm tracking-wide shadow-xs transition cursor-pointer disabled:opacity-60"
      >
        {isSubmitting ? 'Menyimpan...' : 'Simpan Soal'}
      </button>
    </div>
  );
};

export default PracticeQuestionPaletteCard;
