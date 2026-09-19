import {
  Bold,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  Plus,
  RemoveFormatting,
  Table as TableIcon,
  Trash2,
  Underline,
} from 'lucide-react';
import type React from 'react';
import type { PracticeQuestionType } from '@/types/ui/practice.types';
import type { QuestionMatrixStatementForm } from '@/types/ui/practice-question-editor.types';

export interface PracticeOptionMatrixCategorySectionProps {
  questionType: PracticeQuestionType;
  statements: QuestionMatrixStatementForm[];
  onStatementTextChange: (index: number, text: string) => void;
  onStatementChoiceChange: (index: number, choice: string) => void;
  onAddStatement: () => void;
  onRemoveStatement: (index: number) => void;
}

export const PracticeOptionMatrixCategorySection: React.FC<
  PracticeOptionMatrixCategorySectionProps
> = ({
  questionType,
  statements,
  onStatementTextChange,
  onStatementChoiceChange,
  onAddStatement,
  onRemoveStatement,
}) => {
  const isTepatTidakTepat = questionType === 'tepat-tidak-tepat';
  const isSetujuTidakSetuju = questionType === 'setuju-tidak-setuju';

  const positiveLabel = isTepatTidakTepat ? 'TEPAT' : isSetujuTidakSetuju ? 'SETUJU' : 'BENAR';
  const negativeLabel = isTepatTidakTepat
    ? 'TIDAK TEPAT'
    : isSetujuTidakSetuju
      ? 'TIDAK SETUJU'
      : 'SALAH';

  const positiveText = isTepatTidakTepat ? 'Tepat' : isSetujuTidakSetuju ? 'Setuju' : 'Benar';
  const negativeText = isTepatTidakTepat
    ? 'Tidak Tepat'
    : isSetujuTidakSetuju
      ? 'Tidak Setuju'
      : 'Salah';

  return (
    <div className="space-y-4">
      {/* Section Title */}
      <div className="flex items-center gap-2">
        <TableIcon className="w-4 h-4 text-slate-600" />
        <h3 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide">
          Section 3 & 4: Matriks Evaluasi Pernyataan ({positiveText} / {negativeText})
        </h3>
      </div>

      {/* Matrix Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] uppercase tracking-wider font-extrabold text-slate-500">
                <th className="py-3.5 px-4 w-12 text-center">NO</th>
                <th className="py-3.5 px-4">PERNYATAAN EVALUATIF (BUTIR TELAAH KALIMAT)</th>
                <th className="py-3.5 px-4 text-center w-36 sm:w-44 text-emerald-800">
                  {positiveLabel}
                </th>
                <th className="py-3.5 px-4 text-center w-36 sm:w-44 text-rose-800">
                  {negativeLabel}
                </th>
                <th className="py-3.5 px-2 w-10 text-center" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {statements.map((stmt, idx) => {
                const isPositive = stmt.correctChoice.toUpperCase() === positiveLabel;
                const isNegative = stmt.correctChoice.toUpperCase() === negativeLabel;

                return (
                  <tr key={stmt.id || stmt.label} className="hover:bg-slate-50/50">
                    {/* NO Label */}
                    <td className="py-4 px-4 text-center align-top">
                      <span className="w-7 h-7 rounded-xl bg-[#134653] text-white font-extrabold text-xs flex items-center justify-center mx-auto shadow-2xs">
                        {stmt.label}
                      </span>
                    </td>

                    {/* Pernyataan Text Input with Mini Toolbar */}
                    <td className="py-4 px-4 align-top">
                      <div className="space-y-1.5">
                        {/* Mini Toolbar & Header */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-700">
                            Pernyataan {stmt.label}
                          </span>

                          <div className="flex items-center gap-1">
                            <div className="flex items-center gap-0.5 px-1 py-0.5 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-500">
                              <button
                                type="button"
                                className="p-1 hover:text-slate-800 rounded transition cursor-pointer"
                                title="Bold"
                              >
                                <Bold className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                className="p-1 hover:text-slate-800 rounded transition cursor-pointer"
                                title="Italic"
                              >
                                <Italic className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                className="p-1 hover:text-slate-800 rounded transition cursor-pointer"
                                title="Underline"
                              >
                                <Underline className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                className="p-1 hover:text-slate-800 rounded transition cursor-pointer"
                                title="Image"
                              >
                                <ImageIcon className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                className="p-1 hover:text-slate-800 rounded transition cursor-pointer"
                                title="Link"
                              >
                                <LinkIcon className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                className="p-1 hover:text-slate-800 rounded transition cursor-pointer"
                                title="Clear"
                              >
                                <RemoveFormatting className="w-3 h-3" />
                              </button>
                            </div>

                            {statements.length > 2 && (
                              <button
                                type="button"
                                onClick={() => onRemoveStatement(idx)}
                                className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                                title="Hapus Baris Pernyataan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <textarea
                          rows={2}
                          value={stmt.statement}
                          onChange={(e) => onStatementTextChange(idx, e.target.value)}
                          placeholder={`Tuliskan butir pernyataan evaluatif ${stmt.label}...`}
                          className="w-full p-2.5 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed placeholder:text-slate-400 focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20 bg-slate-50/60 rounded-xl border border-slate-200 resize-none transition"
                        />
                      </div>
                    </td>

                    {/* Radio: Positive */}
                    <td className="py-4 px-4 align-middle text-center">
                      <button
                        type="button"
                        onClick={() => onStatementChoiceChange(idx, positiveLabel)}
                        className={`w-full py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                          isPositive
                            ? 'border-[#0E7490] bg-[#F2FAF9] text-[#0E7490] ring-2 ring-[#0E7490]/20 shadow-2xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isPositive
                              ? 'border-[#0E7490] bg-[#0E7490]'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isPositive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span>{positiveText}</span>
                      </button>
                    </td>

                    {/* Radio: Negative */}
                    <td className="py-4 px-4 align-middle text-center">
                      <button
                        type="button"
                        onClick={() => onStatementChoiceChange(idx, negativeLabel)}
                        className={`w-full py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                          isNegative
                            ? 'border-[#0E7490] bg-[#F2FAF9] text-[#0E7490] ring-2 ring-[#0E7490]/20 shadow-2xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isNegative
                              ? 'border-[#0E7490] bg-[#0E7490]'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isNegative && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span>{negativeText}</span>
                      </button>
                    </td>

                    {/* Delete Statement Action Col */}
                    <td className="py-4 px-2 align-middle text-center">
                      {statements.length > 2 && (
                        <button
                          type="button"
                          onClick={() => onRemoveStatement(idx)}
                          className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Hapus Baris Pernyataan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer: Add statement button + Score info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={onAddStatement}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-cyan-300 hover:border-cyan-600 bg-white text-cyan-800 font-bold text-xs sm:text-sm shadow-2xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Baris Pernyataan</span>
          </button>

          <span className="text-xs font-semibold text-slate-500">
            Skor otomatis: 1 poin per pernyataan yang tepat (Total {statements.length} poin).
          </span>
        </div>
      </div>
    </div>
  );
};

export default PracticeOptionMatrixCategorySection;
