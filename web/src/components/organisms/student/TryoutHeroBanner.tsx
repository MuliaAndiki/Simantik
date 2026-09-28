import { Play } from 'lucide-react';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { SplitHero } from '@/components/molecules/hero';

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
    <SplitHero
      title={title}
      description={description}
      descriptionClass="text-sm sm:text-base text-[#546A72] leading-relaxed max-w-xl font-normal"
      leftSpacingClass="space-y-4 sm:space-y-5"
      cardClassName="border-[#CCFBF1] bg-gradient-to-r from-[#F0FDF9] via-[#F0FDF4] to-[#ECFEFF]"
      illustrationAlt="Simulasi Tryout TKA"
      illustrationBoxClass="bg-white/70 border border-[#CCFBF1]/80 backdrop-blur-xs"
      bottomExtra={
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
      }
      className={className}
    />
  );
}
