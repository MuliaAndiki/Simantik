import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react';
import React from 'react';
import { RichHtml } from '@/components/atoms/rich-html';
import type { QuestionReviewResponse } from '@/types/service';
import {
  humanizeWacanaKey,
  normalizeWacanaKey,
  parseMatrixOptions,
  parseWacanaQuestion,
} from '@/utils/wacana';

export interface TryoutResultQuestionDetailProps {
  question: QuestionReviewResponse | null;
  currentIndex: number;
  totalQuestions: number;
  onPrev: () => void;
  onNext: () => void;
}

const MATRIX_TYPE_LABELS: Record<string, string> = {
  'benar-salah': 'Benar-Salah',
  'tepat-tidak-tepat': 'Tepat-Tidak Tepat',
  'setuju-tidak-setuju': 'Setuju-Tidak Setuju',
};

const COGNITIVE_BADGE_MAP: Record<
  number,
  { label: string; bg: string; text: string; border: string }
> = {
  1: {
    label: 'C1 - Mengingat',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  2: {
    label: 'C2 - Memahami',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  3: {
    label: 'C3 - Mengaplikasikan',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  4: {
    label: 'C4 - Menganalisis',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
  },
  5: {
    label: 'C5 - Mengevaluasi',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
};

function parseAnswerMap(raw?: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
  } catch {
    // Not a JSON map
  }
  return {};
}

export const TryoutResultQuestionDetail: React.FC<TryoutResultQuestionDetailProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onPrev,
  onNext,
}) => {
  if (!question) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-10 text-center text-slate-400 space-y-2">
        <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
        <p className="font-bold text-slate-700 text-sm">Pilih Soal</p>
        <p className="text-xs text-slate-400">
          Pilih butir soal dari palet di sebelah kiri untuk melihat rincian pembahasan pengerjaan
          siswa.
        </p>
      </div>
    );
  }

  const qNumber = question.question_number || currentIndex + 1;
  const formattedQNumber = String(qNumber).padStart(2, '0');
  const prevQNumber = qNumber > 1 ? String(qNumber - 1).padStart(2, '0') : null;
  const nextQNumber = qNumber < totalQuestions ? String(qNumber + 1).padStart(2, '0') : null;

  const isCorrect = question.is_correct;
  const parsed = parseWacanaQuestion(question.question_text);

  // Difficulty & Cognitive mapping
  const cogLevel = question.difficulty_level || 3;
  const cogInfo = COGNITIVE_BADGE_MAP[cogLevel] || COGNITIVE_BADGE_MAP[3];

  // Options & question type detection
  const matrix = parseMatrixOptions(question.options);
  const isMatrix = matrix !== null;
  const isMcma = !isMatrix && (question.options || []).filter((o) => o.is_correct).length > 1;
  const typeLabel = isMatrix
    ? (MATRIX_TYPE_LABELS[matrix.kind] ?? 'Matriks')
    : isMcma
      ? 'Pilihan Ganda Kompleks'
      : 'Pilihan Ganda (PG)';

  const answerMap = parseAnswerMap(question.answer_data);
  const matrixRows = isMatrix
    ? matrix.statements.map((stmt) => {
        const rawChoice = answerMap[stmt.id] || answerMap[stmt.label] || '';
        const choiceKey = normalizeWacanaKey(rawChoice);
        const correctKey = normalizeWacanaKey(stmt.key);
        const isStmtCorrect = choiceKey !== '' && choiceKey === correctKey;
        return {
          id: stmt.id,
          statement: stmt.statement,
          choice: humanizeWacanaKey(choiceKey),
          kunci: humanizeWacanaKey(correctKey),
          isCorrect: isStmtCorrect,
        };
      })
    : [];

  // Helper deteksi pilihan siswa
  const isOptionUserSelected = (opt: { id?: string; is_selected?: boolean }) =>
    Boolean(
      opt.is_selected ||
        (question.selected_option_id &&
          opt.id &&
          opt.id.toLowerCase() === question.selected_option_id.toLowerCase()) ||
        (opt.id && Boolean(question.answer_data?.toLowerCase().includes(opt.id.toLowerCase())))
    );

  // Comparison labels
  const studentPickedOptions = (question.options || []).filter(isOptionUserSelected);
  const correctOptions = (question.options || []).filter((o) => o.is_correct);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-6">
      {/* Question Header Banner */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-base sm:text-lg font-black text-slate-900">
            Soal {formattedQNumber} dari {totalQuestions}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {typeLabel}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${cogInfo.bg} ${cogInfo.text} ${cogInfo.border} flex items-center gap-1`}
          >
            <BrainCircuit className="w-3 h-3" />
            <span>{cogInfo.label}</span>
          </span>
        </div>

        <div>
          {isCorrect ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Jawaban Benar (+1.00 Poin)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Jawaban Salah (0.00 Poin)</span>
            </span>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6 pt-0 space-y-6">
        {/* Stimulus / Wacana Bacaan */}
        {parsed.hasStimulus && parsed.stimulusHtml && (
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2 text-cyan-800 font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-cyan-700" />
              <span>{parsed.stimulusTitle || 'Stimulus / Wacana Bacaan Soal'}</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed max-h-72 overflow-y-auto pr-2 custom-scrollbar">
              <RichHtml html={parsed.stimulusHtml} />
            </div>
          </div>
        )}

        {/* Question Text */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Pertanyaan Soal
          </p>
          <div className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
            <RichHtml html={parsed.bodyHtml || question.question_text} />
          </div>
        </div>

        {/* Matrix Questions Rendering */}
        {isMatrix && matrixRows.length > 0 && (
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Analisis Pernyataan Matriks
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase">
                    <th className="py-2.5 px-3 w-10 text-center">No</th>
                    <th className="py-2.5 px-3">Pernyataan</th>
                    <th className="py-2.5 px-3 text-center">Jawaban Siswa</th>
                    <th className="py-2.5 px-3 text-center">Kunci Jawaban</th>
                    <th className="py-2.5 px-3 text-center w-24">Evaluasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {matrixRows.map((row, rIdx) => (
                    <tr key={row.id || rIdx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-400">
                        {rIdx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        <RichHtml html={row.statement} />
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">
                        <span
                          className={`px-2 py-0.5 rounded-md ${
                            row.isCorrect
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {row.choice || '-'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-cyan-800">
                        {row.kunci || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {row.isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <Check className="w-3.5 h-3.5" />
                            <span>Tepat</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600">
                            <X className="w-3.5 h-3.5" />
                            <span>Salah</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Regular Multiple Choice Options Rendering */}
        {!isMatrix && (question.options || []).length > 0 && (
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Pilihan Jawaban & Analisis Pilihan Siswa
            </p>
            <div className="space-y-2.5">
              {question.options.map((option, oIdx) => {
                const isSelected = option.is_selected;
                const isKey = option.is_correct;
                const optLetter = option.option_label || String.fromCharCode(65 + oIdx);

                let containerClasses =
                  'border-slate-200/80 bg-white hover:bg-slate-50/50 text-slate-800';
                let letterClasses = 'bg-slate-100 text-slate-700 border-slate-300';

                if (isSelected && isKey) {
                  containerClasses =
                    'border-emerald-500 bg-emerald-50/40 text-slate-900 ring-1 ring-emerald-500';
                  letterClasses = 'bg-emerald-600 text-white border-emerald-600';
                } else if (isSelected && !isKey) {
                  containerClasses =
                    'border-rose-400 bg-rose-50/40 text-slate-900 ring-1 ring-rose-400';
                  letterClasses = 'bg-rose-600 text-white border-rose-600';
                } else if (!isSelected && isKey) {
                  containerClasses = 'border-emerald-300 bg-emerald-50/20 text-slate-900';
                  letterClasses = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                }

                return (
                  <div
                    key={option.id || oIdx}
                    className={`p-3.5 sm:p-4 rounded-xl border transition flex items-start gap-3.5 ${containerClasses}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg border font-black text-xs flex items-center justify-center shrink-0 ${letterClasses}`}
                    >
                      {optLetter}
                    </div>

                    <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed pt-0.5">
                      <RichHtml html={option.option_text} />
                    </div>

                    {/* Badge on the right */}
                    <div className="shrink-0 flex items-center gap-1.5">
                      {isSelected && isKey && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Pilihan Siswa & Kunci Benar</span>
                        </span>
                      )}
                      {isSelected && !isKey && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-[11px] font-bold">
                          <X className="w-3 h-3 stroke-[3]" />
                          <span>Pilihan Siswa (Salah)</span>
                        </span>
                      )}
                      {!isSelected && isKey && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Kunci Jawaban Benar</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Answer Comparison Box */}
        {!isMatrix && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Pilihan Siswa
              </p>
              <p className="mt-1 font-bold text-slate-800 text-sm">
                {studentPickedOptions.length > 0 ? (
                  <span className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                    Opsi {studentPickedOptions.map((o) => o.option_label || 'Pilihan').join(', ')}
                  </span>
                ) : (
                  <span className="text-slate-400">Tidak Dijawab</span>
                )}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Kunci Jawaban Resmi
              </p>
              <p className="mt-1 font-bold text-emerald-700 text-sm">
                {correctOptions.length > 0
                  ? `Opsi ${correctOptions.map((o) => o.option_label || 'Kunci').join(', ')}`
                  : 'Tersedia pada pedoman penilaian'}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Status Penilaian
              </p>
              <p className="mt-1 font-bold text-sm">
                {isCorrect ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tepat (+1.00 Poin)</span>
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    <span>Kurang Tepat (0.00 Poin)</span>
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Academic Explanation Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Pembahasan Akademik & Tips Pengerjaan</span>
          </div>

          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
            {question.explanation ? (
              <RichHtml html={question.explanation} />
            ) : (
              <p className="italic text-slate-400">
                Pembahasan akademik untuk butir soal ini belum ditambahkan oleh penyusun soal.
              </p>
            )}
          </div>

          {question.answering_tips && (
            <div className="pt-3 border-t border-amber-200/60 mt-3">
              <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Tips Cepat Mengerjakan:</span>
              </p>
              <p className="text-xs text-amber-900 font-medium leading-relaxed">
                {question.answering_tips}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons Prev / Next */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentIndex <= 0}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
              currentIndex > 0
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80 shadow-2xs'
                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Soal Sebelumnya {prevQNumber ? `(${prevQNumber})` : ''}</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={currentIndex >= totalQuestions - 1}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
              currentIndex < totalQuestions - 1
                ? 'bg-[#134653] hover:bg-[#0B2D38] text-white border-transparent shadow-2xs'
                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            }`}
          >
            <span>Soal Selanjutnya {nextQNumber ? `(${nextQNumber})` : ''}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TryoutResultQuestionDetail;
