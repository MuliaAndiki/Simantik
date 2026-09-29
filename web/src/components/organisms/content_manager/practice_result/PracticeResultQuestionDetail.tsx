import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  X,
} from 'lucide-react';
import React from 'react';
import { RichHtml } from '@/components/atoms/rich-html';
import type { PracticeAnswerReviewItem } from '@/types/service';
import {
  humanizeWacanaKey,
  normalizeWacanaKey,
  parseMatrixOptions,
  parseWacanaQuestion,
} from '@/utils/wacana';

export interface PracticeResultQuestionDetailProps {
  review: PracticeAnswerReviewItem | null;
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

function parseAnswerMap(raw?: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
  } catch {
    // bukan JSON map
  }
  return {};
}

export interface PracticeResultQuestionDetailProps {
  review: PracticeAnswerReviewItem | null;
  currentIndex: number;
  totalQuestions: number;
  onPrev: () => void;
  onNext: () => void;
}

export const PracticeResultQuestionDetail: React.FC<PracticeResultQuestionDetailProps> = ({
  review,
  currentIndex,
  totalQuestions,
  onPrev,
  onNext,
}) => {
  if (!review) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-10 text-center text-slate-400 space-y-2">
        <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
        <p className="font-bold text-slate-700 text-sm">Pilih Soal</p>
        <p className="text-xs text-slate-400">
          Pilih butir soal dari daftar di sebelah kiri untuk melihat pembahasan detail.
        </p>
      </div>
    );
  }

  const qNumber = review.question_number || currentIndex + 1;
  const formattedQNumber = String(qNumber).padStart(2, '0');
  const prevQNumber = qNumber > 1 ? String(qNumber - 1).padStart(2, '0') : null;
  const nextQNumber = qNumber < totalQuestions ? String(qNumber + 1).padStart(2, '0') : null;

  const isCorrect = review.is_correct;
  const score = review.score;
  const parsed = parseWacanaQuestion(review.question_text);

  // Pemetaan tipe: matriks ([KUNCI:] di opsi) / MCMA (>1 kunci) / pilihan ganda.
  const matrix = parseMatrixOptions(review.options);
  const isMatrix = matrix !== null;
  const isMcma = !isMatrix && (review.options || []).filter((o) => o.is_correct).length > 1;
  const typeLabel = isMatrix
    ? (MATRIX_TYPE_LABELS[matrix.kind] ?? 'Matriks')
    : isMcma
      ? 'Pilihan Ganda Kompleks'
      : 'Pilihan Ganda';

  const answerMap = parseAnswerMap(review.answer_data);
  const matrixRows = isMatrix
    ? matrix.statements.map((stmt) => {
        const rawChoice =
          answerMap[stmt.id] ??
          Object.entries(answerMap).find(([k]) => k.toLowerCase() === stmt.id.toLowerCase())?.[1] ??
          '';
        return {
          id: stmt.id,
          label: stmt.label,
          statement: stmt.statement,
          userChoice: rawChoice ? humanizeWacanaKey(rawChoice) : '-',
          validKey: humanizeWacanaKey(stmt.key),
          isCorrect:
            rawChoice !== '' &&
            normalizeWacanaKey(String(rawChoice)) === normalizeWacanaKey(stmt.key),
        };
      })
    : [];

  // Find student selected option and official correct option
  const studentSelectedOpt = review.options.find(
    (opt) =>
      opt.is_selected ||
      (review.selected_option_id &&
        opt.id?.toLowerCase() === review.selected_option_id?.toLowerCase()) ||
      review.answer_data?.toLowerCase().includes(opt.id?.toLowerCase()) ||
      (opt.option_label && review.answer_data === opt.option_label)
  );

  const officialCorrectOpt = review.options.find((opt) => opt.is_correct);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-7 space-y-6">
      {/* 1. Top Question Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Soal {formattedQNumber}
          </h2>
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
            {typeLabel}
          </span>
        </div>

        <div>
          {isCorrect ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E8F8F3] text-[#059669] border border-emerald-200/80 shadow-2xs">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Jawaban Benar ({score > 0 ? `+${score}` : '+5'} Poin)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FEF2F2] text-[#DC2626] border border-rose-200/80 shadow-2xs">
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Jawaban Salah (0 Poin)</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Stimulus Wacana (If present) */}
      {parsed.hasStimulus && parsed.stimulusHtml && (
        <div className="rounded-2xl border border-[#0E7490]/20 bg-[#F4FBFA]/70 p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-[#0E7490]/15 pb-2.5">
            <div className="flex items-center gap-2 text-[#0E7490]">
              <BookOpen className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {parsed.stimulusTitle || 'Stimulus Wacana'}
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Teks Bacaan Terbimbing</span>
          </div>

          <RichHtml
            html={parsed.stimulusHtml}
            className="text-xs sm:text-sm text-slate-700 leading-relaxed"
          />
        </div>
      )}

      {/* 3. Question Prompt */}
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500">
          • PERTANYAAN
        </p>
        <RichHtml
          html={parsed.bodyHtml}
          className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed"
        />
      </div>

      {/* 4. Options List / Matrix Table */}
      {isMatrix ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">Pernyataan Teks</th>
                <th className="py-3 px-4 text-center">Pilihan Siswa</th>
                <th className="py-3 px-4 text-center">Kunci Valid</th>
                <th className="py-3 px-4 text-center">Hasil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrixRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-800 leading-relaxed">
                    <RichHtml html={row.statement} />
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-teal-800">
                    {row.userChoice}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-teal-800">{row.validKey}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                        row.isCorrect ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {row.isCorrect ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                      ) : (
                        <X className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-2.5">
          {review.options.map((opt, optIdx) => {
            const optLabel = opt.option_label || String.fromCharCode(65 + optIdx);
            const isUserSelected =
              opt.is_selected ||
              (review.selected_option_id &&
                opt.id?.toLowerCase() === review.selected_option_id?.toLowerCase()) ||
              review.answer_data?.toLowerCase().includes(opt.id?.toLowerCase()) ||
              (opt.option_label && review.answer_data === opt.option_label);

            const isOptionCorrect = opt.is_correct;

            // Determine Card Styles
            let cardStyle = 'bg-slate-50/50 border-slate-200/80 text-slate-700 hover:bg-slate-50';
            let badge = null;

            if (isUserSelected && isOptionCorrect) {
              // Selected correct
              cardStyle =
                'bg-[#E8F8F3] border-emerald-300 text-emerald-950 ring-1 ring-emerald-200';
              badge = (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-[#059669] text-white shadow-2xs shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  <span>Jawaban Siswa (Tepat)</span>
                </span>
              );
            } else if (isUserSelected && !isOptionCorrect) {
              // Selected wrong
              cardStyle = 'bg-[#FEF2F2] border-rose-300 text-rose-950 ring-1 ring-rose-200';
              badge = (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-[#991B1B] text-white shadow-2xs shrink-0">
                  <X className="w-3 h-3 stroke-[2.5]" />
                  <span>Jawaban Siswa (Salah)</span>
                </span>
              );
            } else if (isOptionCorrect) {
              // Official correct
              cardStyle =
                'bg-[#EAF6F8] border-[#0E7490]/40 text-slate-900 ring-1 ring-[#0E7490]/20';
              badge = (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-[#2DD4BF] text-[#0F766E] shadow-2xs shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  <span>Kunci Jawaban Tepat</span>
                </span>
              );
            }

            return (
              <div
                key={opt.id || optLabel}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition ${cardStyle}`}
              >
                <div className="flex items-start gap-3">
                  {isMcma ? (
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isUserSelected
                          ? 'bg-[#134653] border border-[#134653] text-white'
                          : 'border-2 border-slate-300 bg-white'
                      }`}
                    >
                      {isUserSelected && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                    </div>
                  ) : (
                    <div
                      className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                        isUserSelected && !isOptionCorrect
                          ? 'bg-rose-200 text-rose-800'
                          : isOptionCorrect
                            ? 'bg-cyan-200 text-cyan-900'
                            : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {optLabel}
                    </div>
                  )}
                  <RichHtml
                    html={opt.option_text}
                    className="text-xs sm:text-sm font-medium leading-relaxed"
                  />
                </div>

                {isMcma && isOptionCorrect ? (
                  <div className="self-end sm:self-center">
                    <span className="shrink-0 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap bg-[#134653] text-white">
                      Pilihan Tepat
                    </span>
                  </div>
                ) : (
                  badge && <div className="self-end sm:self-center">{badge}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Side-by-Side Response Comparison (2 columns) */}
      {isMatrix ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            RINGKASAN MATRIKS
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug mt-1.5">
            {matrixRows.filter((r) => r.isCorrect).length} dari {matrixRows.length} pernyataan
            dijawab tepat.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Jawaban Siswa Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                JAWABAN SISWA
              </span>
              {isCorrect ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  <span>Benar</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                  <X className="w-3 h-3 stroke-[2.5]" />
                  <span>Salah</span>
                </span>
              )}
            </div>

            <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              {studentSelectedOpt ? (
                <span>
                  {studentSelectedOpt.option_label || 'Pilihan'}.{' '}
                  <RichHtml html={studentSelectedOpt.option_text} className="inline" />
                </span>
              ) : (
                <span className="text-slate-400 italic">Tidak Dijawab</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Tercatat pada lembar pengerjaan siswa</span>
            </div>
          </div>

          {/* Kunci Jawaban Resmi Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F4FBFA] border border-[#0E7490]/25 space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-[#0E7490]/15 pb-2.5">
              <span className="text-xs font-bold text-[#0E7490] uppercase tracking-wider">
                KUNCI JAWABAN RESMI
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#134653] text-white">
                <CheckCircle2 className="w-3 h-3" />
                <span>Kunci Jawaban</span>
              </span>
            </div>

            <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              {officialCorrectOpt ? (
                <span>
                  {officialCorrectOpt.option_label || 'Pilihan'}.{' '}
                  <RichHtml html={officialCorrectOpt.option_text} className="inline" />
                </span>
              ) : (
                <span className="text-slate-500">Tersedia pada pedoman penilaian</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#0E7490] font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Validasi Tim Kurikulum Literasi SIMANTIK</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. Pembahasan Akademik Card */}
      <div className="rounded-2xl bg-[#EAF6F8]/70 border border-[#0E7490]/20 p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 text-[#0E7490]">
          <div className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-[#0E7490] shadow-2xs">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Pembahasan Akademik</h3>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
          {review.explanation ? (
            <RichHtml
              html={review.explanation}
              className="prose prose-slate max-w-none text-xs sm:text-sm"
            />
          ) : (
            <p>
              {isCorrect
                ? 'Jawaban siswa tepat sesuai analisis wacana dan premis yang terdapat pada teks.'
                : 'Pilihan jawaban siswa belum tepat. Silakan teliti kembali rujukan ide pokok dan relasi antarpremis pada wacana yang disajikan.'}
            </p>
          )}

          {review.answering_tips && (
            <div className="pt-2 border-t border-[#0E7490]/15 text-[11px] text-slate-600 font-medium">
              <strong className="text-[#0E7490] font-bold">Tips Cepat: </strong>
              {review.answering_tips}
            </div>
          )}
        </div>
      </div>

      {/* 7. Bottom Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <button
          type="button"
          disabled={currentIndex <= 0}
          onClick={onPrev}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Soal Sebelumnya {prevQNumber ? `(Soal ${prevQNumber})` : ''}</span>
        </button>

        <span className="text-xs font-semibold text-slate-500">
          Soal {formattedQNumber} dari {totalQuestions}
        </span>

        <button
          type="button"
          disabled={currentIndex >= totalQuestions - 1}
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#134653] hover:bg-[#0B2D38] text-white text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
        >
          <span>Soal Berikutnya {nextQNumber ? `(Soal ${nextQNumber})` : ''}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PracticeResultQuestionDetail;
