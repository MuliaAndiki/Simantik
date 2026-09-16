import React from 'react';

export interface PracticeQuestionHeaderProps {
  competencyName: string;
  categoryLabel?: string;
  title: string;
  subCategory?: string;
  isFlagged: boolean;
  onToggleFlag: () => void;
  onExit: () => void;
}

export const PracticeQuestionHeader: React.FC<PracticeQuestionHeaderProps> = ({
  competencyName,
  categoryLabel = 'PEMAHAMAN TEKSTUAL',
  title,
  subCategory = 'PEMAHAMAN INFERENSIAL',
  isFlagged,
  onToggleFlag,
  onExit,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Breadcrumb row */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 hover:text-slate-900 transition cursor-pointer"
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
          <span>Kembali</span>
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-semibold truncate">{competencyName}</span>
      </div>

      {/* Main Title Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {categoryLabel}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-slate-900 tracking-tight">
            {title}
          </h1>
        </div>

        {/* Right Header Status & Exit Button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-teal-800 text-xs font-medium">
            <svg
              className="w-4 h-4 text-teal-600 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
            <span>Tersimpan otomatis</span>
          </div>

          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Subcategory & Ragu-ragu Toggle */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#234E52]">
          {title} • {subCategory}
        </div>

        <button
          type="button"
          onClick={onToggleFlag}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
            isFlagged
              ? 'bg-cyan-50 border-[#6AD2E8] text-teal-900 shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <svg
            className={`w-4 h-4 ${isFlagged ? 'text-[#0284C7] fill-current' : 'text-slate-400'}`}
            fill={isFlagged ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <span>Tandai Ragu-ragu</span>
        </button>
      </div>
    </div>
  );
};
