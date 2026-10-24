'use client';

import { BookOpenText, ChevronDown, Quote } from 'lucide-react';
import React, { useId, useState } from 'react';
import { RichHtml } from '@/components/atoms/rich-html';
import type { StimulusData } from '@/types/ui';
import { cn } from '@/utils/classname';
import { formatQuestionNumbers } from '@/utils/stimulus.util';
import { isHtml } from '@/utils/wacana';

export interface PracticeQuestionStimulusProps {
  stimulus?: StimulusData | null;
  /** Nomor soal aktif saat ini (opsional jika relatedQuestionNumbers diberikan) */
  questionNumber?: number;
  /** Daftar nomor soal yang menggunakan bacaan ini (dihitung dinamis) */
  relatedQuestionNumbers?: number[];
  className?: string;
  /** Status awal accordion (default: true agar bacaan langsung terbaca) */
  defaultExpanded?: boolean;
}

/**
 * Komponen bacaan bersama (stimulus) untuk siswa pada Latihan & Tryout.
 * Memisahkan bacaan dari pertanyaan dengan hierarki visual yang jelas,
 * judul ramah awam, nomor soal dinamis, dan accordion responsif.
 */
export const PracticeQuestionStimulus: React.FC<PracticeQuestionStimulusProps> = ({
  stimulus,
  questionNumber,
  relatedQuestionNumbers,
  className,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentId = useId();

  if (!stimulus) return null;

  // Hitung nomor-nomor soal terkait
  const numbers =
    relatedQuestionNumbers && relatedQuestionNumbers.length > 0
      ? relatedQuestionNumbers
      : stimulus.relatedQuestionNumbers && stimulus.relatedQuestionNumbers.length > 0
        ? stimulus.relatedQuestionNumbers
        : typeof questionNumber === 'number'
          ? [questionNumber]
          : [];

  const { shortRange, fullList, isMultiple } = formatQuestionNumbers(numbers);

  // Judul utama yang mudah dipahami
  const badgeLabel = isMultiple ? 'Bacaan Bersama' : 'Bacaan Soal';
  const rangeTitle = shortRange ? `Soal Nomor ${shortRange}` : undefined;
  const helperInstruction = fullList
    ? `Bacalah teks berikut untuk menjawab soal nomor ${fullList}.`
    : 'Bacalah teks berikut untuk menjawab pertanyaan.';

  // Format konten bacaan
  const rawContent = stimulus.content;
  const hasContent = Boolean(
    rawContent && (Array.isArray(rawContent) ? rawContent.length > 0 : String(rawContent).trim())
  );
  const hasQuote = Boolean(stimulus.quote?.trim());

  if (!hasContent && !hasQuote) return null;

  return (
    <section
      aria-label="Bacaan bersama untuk soal"
      className={cn(
        'w-full rounded-2xl border border-teal-200/90 bg-[#F8FCFB] p-4 sm:p-5 shadow-2xs transition-all',
        className
      )}
    >
      {/* 1. Header: Ikon Buku, Judul Bacaan Bersama, Badge Nomor Soal, & Toggle */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-teal-100/80">
        <div className="flex items-start gap-3 min-w-0">
          <div className="size-9 sm:size-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <BookOpenText className="w-5 h-5" aria-hidden="true" />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-teal-100/90 text-teal-800">
                {badgeLabel}
              </span>

              {rangeTitle && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-700 text-white shadow-2xs">
                  {rangeTitle}
                </span>
              )}
            </div>

            {stimulus.title ? (
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
                {stimulus.title}
              </h3>
            ) : null}

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {helperInstruction}
            </p>
          </div>
        </div>

        {/* Tombol Accordion Buka/Tutup Bacaan */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-800 bg-white border border-teal-200 hover:bg-teal-50 transition-colors shrink-0 cursor-pointer shadow-2xs"
        >
          <span className="hidden sm:inline">
            {isExpanded ? 'Sembunyikan Bacaan' : 'Lihat Bacaan'}
          </span>
          <span className="sm:hidden">{isExpanded ? 'Tutup' : 'Buka'}</span>
          <ChevronDown
            className={cn(
              'w-3.5 h-3.5 transition-transform duration-200 shrink-0',
              isExpanded && 'rotate-180'
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* 2. Isi Teks Bacaan (Expandable) */}
      {isExpanded && (
        <div id={contentId} className="pt-3.5 space-y-3 animate-in fade-in-50 duration-150">
          {/* Format Kutipan Khusus (Quote callout) */}
          {hasQuote && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 text-slate-900 font-semibold text-sm sm:text-base leading-relaxed flex items-start gap-2.5">
              <Quote className="w-5 h-5 text-teal-600 shrink-0 mt-0.5 rotate-180" />
              <div className="flex-1">{stimulus.quote}</div>
            </div>
          )}

          {/* Format Isi Teks Lengkap (Rich Text / Paragraf) */}
          {hasContent && (
            <div
              data-lenis-prevent
              className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2.5 max-h-[360px] sm:max-h-[440px] overflow-y-auto overscroll-contain pr-2 scrollbar-thin scrollbar-thumb-teal-200"
            >
              {Array.isArray(rawContent) ? (
                rawContent.map((p, i) => (
                  <div key={`stimulus-p-${i}`} className="leading-relaxed">
                    {isHtml(p) ? <RichHtml html={p} /> : p}
                  </div>
                ))
              ) : (
                <RichHtml html={rawContent} />
              )}
            </div>
          )}

          {/* Sumber Bacaan */}
          {stimulus.source && (
            <div className="text-[11px] italic text-slate-500 text-right pt-2 border-t border-teal-100/70">
              Sumber: {stimulus.source}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default PracticeQuestionStimulus;
