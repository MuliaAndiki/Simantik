import { Play } from 'lucide-react';
import Image from 'next/image';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface TryoutHeroBannerProps {
  title?: string;
  description?: string;
  onStartTryout?: () => void;
  className?: string;
}

export function TryoutHeroBanner({
  title = 'Siap menghadapi TKA?',
  description = 'Kerjakan tryout untuk mengukur kemampuanmu dalam Bahasa Indonesia dengan suasana seperti ujian sebenarnya.',
  onStartTryout,
  className,
}: TryoutHeroBannerProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border border-[#CCFBF1] bg-gradient-to-r from-[#F0FDF9] via-[#F0FDF4] to-[#ECFEFF] shadow-xs',
        className
      )}
    >
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-10">
        {/* Left Informational & CTA */}
        <div className="flex-1 space-y-4 sm:space-y-5 text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-[#546A72] leading-relaxed max-w-xl font-normal">
            {description}
          </p>

          <div className="pt-2">
            <Button
              type="button"
              variant={'google'}
              onClick={onStartTryout}
              className="h-12 px-6 rounded-xl bg-[#1A4D5C] hover:bg-[#123945] text-white font-bold text-sm sm:text-base shadow-sm gap-2.5 border-none transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <div className="flex size-6 items-center justify-center rounded-full bg-white/20">
                <Play className="size-3.5 fill-white text-white translate-x-0.5" />
              </div>
              <span>Mulai Tryout Sekarang</span>
            </Button>
          </div>
        </div>

        {/* Right Study Desk Illustration */}
        <div className="w-full md:w-80 sm:w-64 max-w-xs shrink-0 flex items-center justify-center p-2 rounded-2xl bg-white/70 border border-[#CCFBF1]/80 backdrop-blur-xs">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
            <Image
              src="/illustrations/student-learning.jpg"
              alt="Simulasi Tryout TKA"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 192px, 256px"
              priority
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
