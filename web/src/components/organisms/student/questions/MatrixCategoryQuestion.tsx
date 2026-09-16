import React from 'react';
import type { MatrixStatement } from '@/types/ui';

export type MatrixMode = 'BENAR_SALAH' | 'TEPAT_TIDAK_TEPAT' | 'SETUJU_TIDAK_SETUJU';

export interface MatrixCategoryQuestionProps {
  questionNumber: number;
  mode: MatrixMode;
  instruction?: string;
  promptCategory?: string;
  questionText: string;
  statements: MatrixStatement[];
  answers?: Record<string, string>; // statementId -> option value
  onSelectMatrixAnswer: (statementId: string, value: string) => void;
}

export const MatrixCategoryQuestion: React.FC<MatrixCategoryQuestionProps> = ({
  mode,
  instruction,
  promptCategory,
  questionText,
  statements,
  answers = {},
  onSelectMatrixAnswer,
}) => {
  // Label and headers based on mode
  let col1Header = 'BENAR';
  let col2Header = 'SALAH';
  let col1Value = 'BENAR';
  let col2Value = 'SALAH';
  let defaultInstruction =
    'Petunjuk Pengerjaan: Tentukan Benar atau Salah untuk setiap butir pernyataan di bawah ini berdasarkan relevansi tujuan penulis!';

  if (mode === 'TEPAT_TIDAK_TEPAT') {
    col1Header = 'TEPAT';
    col2Header = 'TIDAK TEPAT';
    col1Value = 'TEPAT';
    col2Value = 'TIDAK_TEPAT';
    defaultInstruction =
      'Petunjuk Pengerjaan: Tentukan Tepat atau Tidak Tepat untuk setiap butir pernyataan di bawah ini berdasarkan relevansi tujuan penulis!';
  } else if (mode === 'SETUJU_TIDAK_SETUJU') {
    col1Header = 'SETUJU';
    col2Header = 'TIDAK SETUJU';
    col1Value = 'SETUJU';
    col2Value = 'TIDAK_SETUJU';
    defaultInstruction =
      'Petunjuk Pengerjaan: Tentukan Setuju atau Tidak Setuju untuk setiap butir pernyataan di bawah ini berdasarkan relevansi tujuan penulis!';
  }

  const finalInstruction = instruction || defaultInstruction;

  return (
    <div className="space-y-4">
      {/* Question Prompt */}
      <div>
        {promptCategory && (
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            {promptCategory}
          </div>
        )}
        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {questionText}
        </h4>
      </div>

      {/* Instruction Box */}
      {finalInstruction && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-100 text-teal-900 text-xs sm:text-sm">
          <svg
            className="w-5 h-5 text-teal-700 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="leading-relaxed">{finalInstruction}</span>
        </div>
      )}

      {/* Matrix Table */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-[56px_1fr_90px_100px] sm:grid-cols-[64px_1fr_110px_130px] items-center bg-[#EAF7F8] py-3 px-3 sm:px-4 border-b border-slate-200 font-bold text-[11px] sm:text-xs text-[#234E52] tracking-wider uppercase">
          <div className="text-center">NO</div>
          <div>PERNYATAAN</div>
          <div className="text-center">{col1Header}</div>
          <div className="text-center">{col2Header}</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100">
          {statements.map((stmt) => {
            const currentValue = answers[stmt.id];
            const isCol1Selected = currentValue === col1Value;
            const isCol2Selected = currentValue === col2Value;

            return (
              <div
                key={stmt.id}
                className="grid grid-cols-[56px_1fr_90px_100px] sm:grid-cols-[64px_1fr_110px_130px] items-center p-3 sm:p-4 hover:bg-slate-50/70 transition"
              >
                {/* Number/Letter badge */}
                <div className="flex justify-center">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                    {stmt.label}
                  </div>
                </div>

                {/* Statement text */}
                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed pr-2 sm:pr-4">
                  {stmt.statement}
                </div>

                {/* Col 1 Radio (e.g. Benar / Tepat / Setuju) */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => onSelectMatrixAnswer(stmt.id, col1Value)}
                    className="p-2 cursor-pointer flex items-center justify-center"
                    aria-label={`Pilih ${col1Header} untuk butir ${stmt.label}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition ${
                        isCol1Selected
                          ? 'border-2 border-[#0284C7] bg-[#0284C7]'
                          : 'border-2 border-slate-300 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {isCol1Selected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                </div>

                {/* Col 2 Radio (e.g. Salah / Tidak Tepat / Tidak Setuju) */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => onSelectMatrixAnswer(stmt.id, col2Value)}
                    className="p-2 cursor-pointer flex items-center justify-center"
                    aria-label={`Pilih ${col2Header} untuk butir ${stmt.label}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition ${
                        isCol2Selected
                          ? 'border-2 border-[#0284C7] bg-[#0284C7]'
                          : 'border-2 border-slate-300 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {isCol2Selected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
