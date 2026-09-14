import Image from 'next/image';
import type * as React from 'react';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface EvaluationHeroBannerProps {
  title?: string;
  subtitle?: string;
  illustrationSrc?: string;
  className?: string;
}

export function EvaluationHeroBanner({
  title = 'Evaluasi Kemampuan TKA 2026',
  subtitle = 'Lihat gambaran kemampuanmu dan pahami bagian yang perlu ditingkatkan berdasarkan hasil simulasi terstandar Bahasa Indonesia.',
  illustrationSrc = '/illustrations/student-evaluation.jpg',
  className,
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
        <div className="space-y-2.5 max-w-xl text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {subtitle}
          </p>
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
