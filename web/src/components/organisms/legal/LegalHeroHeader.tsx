import { Calendar, Printer } from 'lucide-react';
import type * as React from 'react';
import { cn } from '@/utils/classname';

export interface LegalHeroHeaderProps {
  title: string;
  lastUpdated: string;
  greeting?: string;
  paragraphs: string[];
  highlightCallout?: string;
  onPrint?: () => void;
  className?: string;
}

export function LegalHeroHeader({
  title,
  lastUpdated,
  greeting,
  paragraphs,
  highlightCallout,
  onPrint,
  className,
}: LegalHeroHeaderProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 sm:p-8 md:p-10 shadow-xs relative overflow-hidden',
        className
      )}
    >
      {/* Top Gradient Stripe (Teal to Amber) */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-800 via-teal-600 to-amber-400"
        aria-hidden="true"
      />

      {/* Title & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
            {title}
          </h1>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Terakhir diperbarui: {lastUpdated}</span>
          </div>
        </div>

        {onPrint && (
          <button
            type="button"
            onClick={onPrint}
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Salinan</span>
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 my-6" />

      {/* Welcome & Intro Paragraphs */}
      <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
        {greeting && <p className="font-semibold text-slate-800">{greeting}</p>}
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      {/* Highlight Callout Box */}
      {highlightCallout && (
        <div className="mt-6 bg-[#EBF7F6]/90 border border-teal-200/70 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-teal-900 text-xs sm:text-sm font-medium leading-relaxed">
          {highlightCallout}
        </div>
      )}
    </div>
  );
}
