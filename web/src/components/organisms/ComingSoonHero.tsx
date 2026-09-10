'use client';

import { Icon } from '@iconify/react';
import * as React from 'react';

import { CountdownTimer, NotifyMeForm } from '@/components/molecules';
import { cn } from '@/utils/classname';

export interface ComingSoonHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  badgeText?: string;
  title?: string;
  highlightText?: string;
  description?: string;
  targetDate?: Date | string;
  onSubscribe?: (email: string) => Promise<void> | void;
}

export function ComingSoonHero({
  badgeText = '🚀 Segera Hadir • Platform Asesmen Adaptif',
  title = 'Persiapkan Langkah Sukses Menuju Kampus Impian Bersama',
  highlightText = 'SIMANTIK',
  description = 'Sistem simulasi ujian dan tryout adaptif modern berbasis Item Response Theory (IRT). Mengukur kemampuan kognitifmu secara presisi dan merekomendasikan materi belajar yang tepat sasaran.',
  targetDate,
  onSubscribe,
  className,
  ...props
}: ComingSoonHeroProps) {
  return (
    <section
      className={cn(
        'relative flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-12 space-y-8',
        className
      )}
      {...props}
    >
      {/* Decorative Brand Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E0F7FA] border border-[#8BBCC5]/40 text-[#1A4D5C] text-xs sm:text-sm font-semibold shadow-xs animate-enter">
        <Icon icon="lucide:sparkles" className="size-4 text-[#4CA7B1]" />
        <span>{badgeText}</span>
      </div>

      {/* Main Hero Headline */}
      <div className="space-y-4 max-w-3xl">
        <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#111827] tracking-tight leading-[1.15]">
          {title}{' '}
          <span className="text-[#1A4D5C] underline decoration-[#F7CE46] decoration-wavy decoration-from-font underline-offset-8">
            {highlightText}
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-[#404040] leading-relaxed max-w-2xl mx-auto font-normal">
          {description}
        </p>
      </div>

      {/* Countdown Timer Unit */}
      <div className="py-2 sm:py-4 w-full">
        <CountdownTimer targetDate={targetDate} />
      </div>

      {/* Waitlist Subscription Form */}
      <div className="w-full max-w-md pt-2">
        <p className="text-xs sm:text-sm font-medium text-[#546A72] mb-3">
          Jadilah yang pertama mencoba saat platform kami resmi diluncurkan:
        </p>
        <NotifyMeForm onSubscribe={onSubscribe} />
      </div>
    </section>
  );
}
