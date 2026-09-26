import Image from 'next/image';
import type * as React from 'react';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface EvaluationHeroBannerProps {
  title?: string;
  subtitle?: string;
  illustrationSrc?: string;
  className?: string;
  onPrint?: () => void;
}

export function EvaluationHeroBanner({
  title = 'Evaluasi Kemampuan TKA 2026',
  subtitle = 'Lihat gambaran kemampuanmu dan pahami bagian yang perlu ditingkatkan berdasarkan hasil simulasi terstandar Bahasa Indonesia.',
  illustrationSrc = '/illustrations/student-evaluation.jpg',
  className,
  onPrint,
}: EvaluationHeroBannerProps) {
  return (
    <Card
      className={cn(
        'w-full relative overflow-hidden rounded-2xl border border-teal-100/80 bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-cyan-50/50 p-6 md:p-8 shadow-xs',
        className
      )}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left Column: Text Information */}
        <div className="space-y-4 max-w-xl text-center md:text-left">
          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {subtitle}
            </p>
          </div>

          {onPrint && (
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-teal-600 text-teal-800 text-sm font-bold rounded-full hover:bg-teal-50 transition print:hidden"
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Unduh Rapor PDF
            </button>
          )}
        </div>

        {/* Right Column: Framed Cheerful Student Illustration */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-2xl bg-white/95 border border-teal-100/70 shadow-xs p-2 relative overflow-hidden flex items-center justify-center">
            <Image
              src={illustrationSrc}
              alt="Ilustrasi Evaluasi Kemampuan Siswa"
              fill
              priority
              sizes="(max-width: 768px) 192px, 208px"
              className="object-contain p-1"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
