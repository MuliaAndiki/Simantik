import { Check, ChevronDown, Info, Lightbulb, Maximize2, X } from 'lucide-react';
import React from 'react';
import { RichHtml } from '@/components/atoms/rich-html';
import type { PracticeReviewItem } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface PracticeResultReviewCardProps {
  item: PracticeReviewItem;
}

export const PracticeResultReviewCard: React.FC<PracticeResultReviewCardProps> = ({ item }) => {
  const isCorrect = item.status === 'correct';

  return (
    <details
      open
      id={`review-question-${item.number}`}
      className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all scroll-mt-24"
    >
      {/* Header Bar */}
      <summary className="w-full text-left p-5 sm:p-6 cursor-pointer hover:bg-slate-50/50 transition-colors flex items-start justify-between gap-4 outline-none list-none select-none [&::-webkit-details-marker]:hidden">
        <div className="space-y-2">
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center justify-center h-6 px-2.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-black">
              {item.formattedNumber}
            </span>

            <span
              className={cn(
                'inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold border',
                item.status === 'correct' && 'bg-teal-50 text-teal-800 border-teal-200',
                item.status === 'wrong' && 'bg-rose-50 text-rose-700 border-rose-200',
                item.status === 'unanswered' && 'bg-slate-100 text-slate-700 border-slate-300'
              )}
            >
              {item.status === 'correct' && (
                <Check className="w-3 h-3 text-teal-700 stroke-[2.5]" aria-hidden="true" />
              )}
              {item.status === 'wrong' && (
                <X className="w-3 h-3 text-rose-600 stroke-[2.5]" aria-hidden="true" />
              )}
              {item.status === 'unanswered' && (
                <Info className="w-3 h-3 text-slate-500 stroke-[2.5]" aria-hidden="true" />
              )}
              <span>{item.statusLabel}</span>
            </span>

            <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold">
              {item.typeLabel}
            </span>

            <span className="text-xs text-slate-500 font-medium">{item.subtest}</span>
          </div>

          {/* Title */}
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {item.title}
          </h2>
        </div>

        {/* Expand / Collapse Icon */}
        <span
          aria-hidden="true"
          className="p-1 rounded-full text-slate-400 group-hover:text-slate-600 transition shrink-0"
        >
          <ChevronDown
            className="w-5 h-5 transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
          />
        </span>
      </summary>

      {/* Content Area */}
      <div className="px-5 pb-6 sm:px-7 sm:pb-7 space-y-5 border-t border-slate-100 pt-5">
        {/* Stimulus Box (if any) */}
        {item.stimulus && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {item.stimulus.label}
            </span>
            <div className="font-serif sm:text-[13.5px] leading-relaxed">
              <RichHtml html={item.stimulus.content} />
            </div>
          </div>
        )}

        {/* Infographic Chart (if any) */}
        {item.infographic && (
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700">Visualisasi Data Tren</span>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1 transition cursor-pointer shadow-2xs"
              >
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Perbesar Gambar</span>
              </button>
            </div>

            {/* SVG Curve Chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 relative overflow-hidden">
              <svg
                className="w-full h-44 sm:h-52"
                viewBox="0 0 600 200"
                fill="none"
                aria-hidden="true"
              >
                {/* Grid Lines */}
                <line x1="40" y1="30" x2="560" y2="30" stroke="#E2E8F0" strokeDasharray="4 4" />
                <line x1="40" y1="80" x2="560" y2="80" stroke="#E2E8F0" strokeDasharray="4 4" />
                <line x1="40" y1="130" x2="560" y2="130" stroke="#E2E8F0" strokeDasharray="4 4" />
                <line x1="40" y1="170" x2="560" y2="170" stroke="#CBD5E1" strokeWidth="1.5" />

                {/* Y Axis Labels */}
                <text x="10" y="35" fontSize="10" fill="#94A3B8" fontWeight="600">
                  100%
                </text>
                <text x="15" y="85" fontSize="10" fill="#94A3B8" fontWeight="600">
                  60%
                </text>
                <text x="15" y="135" fontSize="10" fill="#94A3B8" fontWeight="600">
                  20%
                </text>

                {/* Shaded Area under curve */}
                <path
                  d="M 100 140 Q 220 110 340 70 T 500 45 L 500 170 L 100 170 Z"
                  fill="url(#gradient-area)"
                  opacity="0.25"
                />
                <defs>
                  <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2B4C56" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>
                </defs>

                {/* Line Curve */}
                <path
                  d="M 100 140 Q 220 110 340 70 T 500 45"
                  stroke="#2B4C56"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Point 1: 48% */}
                <circle cx="100" cy="140" r="7" fill="#F5B731" stroke="#2B4C56" strokeWidth="2.5" />
                <rect x="75" y="105" width="50" height="22" rx="6" fill="#1E293B" />
                <text
                  x="100"
                  y="120"
                  fontSize="11"
                  fill="#FFFFFF"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  48%
                </text>
                <text
                  x="100"
                  y="188"
                  fontSize="11"
                  fill="#64748B"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  2021
                </text>

                {/* Point 2: 62% */}
                <circle cx="230" cy="110" r="7" fill="#F5B731" stroke="#2B4C56" strokeWidth="2.5" />
                <rect x="205" y="75" width="50" height="22" rx="6" fill="#1E293B" />
                <text
                  x="230"
                  y="90"
                  fontSize="11"
                  fill="#FFFFFF"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  62%
                </text>
                <text
                  x="230"
                  y="188"
                  fontSize="11"
                  fill="#64748B"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  2022
                </text>

                {/* Point 3: 77% */}
                <circle cx="360" cy="78" r="7" fill="#F5B731" stroke="#2B4C56" strokeWidth="2.5" />
                <rect x="335" y="45" width="50" height="22" rx="6" fill="#1E293B" />
                <text
                  x="360"
                  y="60"
                  fontSize="11"
                  fill="#FFFFFF"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  77%
                </text>
                <text
                  x="360"
                  y="188"
                  fontSize="11"
                  fill="#64748B"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  2023
                </text>

                {/* Point 4: 89% */}
                <circle cx="500" cy="45" r="7" fill="#F5B731" stroke="#2B4C56" strokeWidth="2.5" />
                <rect x="475" y="12" width="50" height="22" rx="6" fill="#1E293B" />
                <text
                  x="500"
                  y="27"
                  fontSize="11"
                  fill="#FFFFFF"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  89%
                </text>
                <text
                  x="500"
                  y="188"
                  fontSize="11"
                  fill="#64748B"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  2024
                </text>
              </svg>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-500 text-center font-medium italic">
              {item.infographic.caption}
            </p>
          </div>
        )}

        {/* Question Prompt */}
        <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
          <RichHtml html={item.prompt} />
        </div>

        {/* Type 1: Single Choice Options */}
        {item.options && item.type !== 'mcma' && (
          <div className="space-y-2.5">
            {item.options.map((opt) => {
              const isSelectedCorrect = opt.isUserChoice && opt.isCorrect;
              const isSelectedWrong = opt.isUserChoice && !opt.isCorrect;
              const isKeyUnselected = !opt.isUserChoice && opt.isCorrect;

              return (
                <div
                  key={opt.id}
                  className={cn(
                    'flex items-start justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm transition-all',
                    isSelectedCorrect &&
                      'bg-[#EAF6F6] border-teal-400/90 text-teal-950 font-medium',
                    isSelectedWrong && 'bg-rose-50/80 border-rose-300 text-rose-950 font-medium',
                    isKeyUnselected && 'bg-[#EAF6F6]/80 border-teal-400 text-teal-950 font-medium',
                    !opt.isUserChoice &&
                      !opt.isCorrect &&
                      'bg-white border-slate-200/80 text-slate-700'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5',
                        isSelectedCorrect && 'bg-teal-800 text-white',
                        isSelectedWrong && 'bg-rose-600 text-white',
                        isKeyUnselected && 'bg-teal-800 text-white',
                        !opt.isUserChoice && !opt.isCorrect && 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {opt.id}
                    </span>
                    <span className="leading-relaxed">
                      <RichHtml html={opt.text} />
                    </span>
                  </div>

                  {/* Right status badge */}
                  {opt.badgeText && (
                    <span
                      className={cn(
                        'shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-2xs whitespace-nowrap',
                        isSelectedCorrect && 'bg-teal-800 text-white',
                        isSelectedWrong && 'bg-rose-600 text-white',
                        isKeyUnselected && 'bg-teal-800 text-white'
                      )}
                    >
                      {isSelectedCorrect && (
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                      )}
                      {isSelectedWrong && (
                        <X className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                      )}
                      {isKeyUnselected && (
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                      )}
                      <span>{opt.badgeText}</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Type 2: MCMA (Multi-Select Options) */}
        {item.options && item.type === 'mcma' && (
          <div className="space-y-2.5">
            {item.options.map((opt) => (
              <div
                key={opt.id}
                className={cn(
                  'flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm',
                  opt.isUserChoice && opt.isCorrect
                    ? 'bg-[#EAF6F6]/60 border-teal-300 text-slate-900 font-medium'
                    : 'bg-white border-slate-200 text-slate-700'
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0',
                      opt.isUserChoice
                        ? 'bg-teal-800 text-white'
                        : 'border border-slate-300 bg-white'
                    )}
                  >
                    {opt.isUserChoice && (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                    )}
                  </span>
                  <span className="leading-relaxed">
                    <RichHtml html={opt.text} />
                  </span>
                </div>

                {opt.tagText && (
                  <span
                    className={cn(
                      'shrink-0 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap',
                      opt.tagText === 'Pilihan Tepat'
                        ? 'bg-teal-800 text-white'
                        : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {opt.tagText}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Type 3: Matrix Table */}
        {item.matrixRows && (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">Pernyataan Teks</th>
                  <th className="py-3 px-4 text-center">Pilihan Kamu</th>
                  <th className="py-3 px-4 text-center">Kunci Valid</th>
                  <th className="py-3 px-4 text-center">Hasil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {item.matrixRows.map((row) => (
                  <tr key={row.statement} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-800 leading-relaxed">
                      <RichHtml html={row.statement} />
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-teal-800">
                      {row.userChoice}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-teal-800">
                      {row.validKey}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center justify-center w-5 h-5 rounded-full',
                          row.isCorrect ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-600'
                        )}
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
        )}

        {/* Discussion Callout Box */}
        <div
          className={cn(
            'p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed border space-y-1',
            item.discussion.type === 'analitis' && 'bg-sky-50/70 border-sky-200/90 text-sky-950',
            item.discussion.type === 'kekeliruan' &&
              'bg-rose-50/80 border-rose-200/90 text-rose-950',
            item.discussion.type === 'skor' && 'bg-cyan-50/70 border-cyan-200/90 text-teal-950',
            item.discussion.type === 'visual' && 'bg-sky-50/70 border-sky-200/90 text-sky-950'
          )}
        >
          <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide">
            {item.discussion.type === 'analitis' && (
              <>
                <Lightbulb className="w-4 h-4 text-sky-700" aria-hidden="true" />
                <span className="text-sky-800">{item.discussion.title}</span>
              </>
            )}
            {item.discussion.type === 'kekeliruan' && (
              <>
                <Info className="w-4 h-4 text-rose-600" aria-hidden="true" />
                <span className="text-rose-800">{item.discussion.title}</span>
              </>
            )}
            {item.discussion.type === 'skor' && (
              <>
                <Check className="w-3.5 h-3.5 text-teal-700 stroke-[2.5]" aria-hidden="true" />
                <span className="text-teal-900">{item.discussion.title}</span>
              </>
            )}
            {item.discussion.type === 'visual' && (
              <>
                <Lightbulb className="w-4 h-4 text-sky-700" aria-hidden="true" />
                <span className="text-sky-800">{item.discussion.title}</span>
              </>
            )}
          </div>
          <div className="leading-relaxed font-normal pt-1">
            <RichHtml html={item.discussion.content} />
          </div>
        </div>
      </div>
    </details>
  );
};
