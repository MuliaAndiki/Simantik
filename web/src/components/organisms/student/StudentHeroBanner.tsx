import { Play, Star, Timer } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { cn } from '@/utils/classname';

if (typeof window !== 'undefined') {
  import('@aejkatappaja/phantom-ui');
}

export interface StudentHeroBannerProps {
  studentName?: string;
  isLoading?: boolean;
  onStartPractice?: () => void;
  onStartTryout?: () => void;
  practiceHref?: string;
  tryoutHref?: string;
  className?: string;
}

export function StudentHeroBanner({
  studentName,
  isLoading,
  onStartPractice,
  onStartTryout,
  practiceHref = '/student/practice',
  tryoutHref = '/student/tryout',
  className,
}: StudentHeroBannerProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#16382f] via-[#1c473c] to-[#122e27] text-white p-6 sm:p-8 md:p-10 shadow-lg',
        className
      )}
    >
      {/* Decorative background ambient glows */}
      <div className="absolute -top-24 -right-24 size-96 rounded-full bg-[#4CA7B1]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-[#F7CE46]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-4 md:space-y-5">
        {/* Portal Pill Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/95 backdrop-blur-xs border border-white/15">
          <Star className="size-3.5 fill-[#F7CE46] text-[#F7CE46]" />
          <span>Portal TKA Bahasa Indonesia</span>
        </div>

        {/* Greeting Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Selamat datang,{' '}
          {isLoading ? (
            <phantom-ui
              loading="true"
              animation="shimmer"
              count="1"
              style={{
                display: 'inline-block',
                height: '32px',
                width: '180px',
                verticalAlign: 'middle',
              }}
            ></phantom-ui>
          ) : (
            studentName || 'Siswa'
          )}
          !
        </h1>

        {/* Subtitle Motivation */}
        <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl font-normal">
          Siap mengasah kemampuan Bahasa Indonesia untuk TKA? Kerjakan latihan terarah untuk menguji
          pemahaman teks dan logika penalaranmu hari ini
        </p>

        {/* CTA Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
          {practiceHref ? (
            <Button
              asChild
              className="h-11 px-5 rounded-xl bg-[#F7CE46] hover:bg-[#eabf32] text-[#1A4D5C] font-bold text-sm shadow-sm gap-2 border-none transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link href={practiceHref} onClick={onStartPractice}>
                <Play className="size-4 fill-[#1A4D5C] text-[#1A4D5C]" />
                <span>Mulai Latihan</span>
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onStartPractice}
              className="h-11 px-5 rounded-xl bg-[#F7CE46] hover:bg-[#eabf32] text-[#1A4D5C] font-bold text-sm shadow-sm gap-2 border-none transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Play className="size-4 fill-[#1A4D5C] text-[#1A4D5C]" />
              <span>Mulai Latihan</span>
            </Button>
          )}

          {tryoutHref ? (
            <Button
              asChild
              variant="outline"
              className="h-11 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 gap-2 backdrop-blur-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link href={tryoutHref} onClick={onStartTryout}>
                <Timer className="size-4 text-white" />
                <span>Mulai Tryout</span>
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={onStartTryout}
              className="h-11 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 gap-2 backdrop-blur-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Timer className="size-4 text-white" />
              <span>Mulai Tryout</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
