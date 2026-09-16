import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface LearningDetailCtaBannerProps {
  title?: string;
  description?: string;
  practiceHref?: string;
  onStartPractice?: () => void;
  className?: string;
}

export function LearningDetailCtaBanner({
  title = 'Sudah memahami materi ini?',
  description = 'Uji pemahamanmu melalui latihan Bahasa Indonesia yang tersedia di SIMANTIK.',
  practiceHref = '/student/practice',
  onStartPractice,
  className,
}: LearningDetailCtaBannerProps) {
  return (
    <Card
      className={cn(
        'p-6 sm:p-7 md:p-8 rounded-2xl md:rounded-3xl border border-[#E5E7EB] bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6',
        className
      )}
    >
      <div className="space-y-1">
        <h3 className="text-lg sm:text-xl font-extrabold text-[#111827] tracking-tight">{title}</h3>
        <p className="text-xs sm:text-sm text-[#546A72] font-normal leading-relaxed">
          {description}
        </p>
      </div>

      <div className="shrink-0">
        {onStartPractice ? (
          <Button
            type="button"
            onClick={onStartPractice}
            className="w-full sm:w-auto h-11 px-7 rounded-full bg-[#F7CE46] hover:bg-[#eabf32] text-[#1A4D5C] font-bold text-xs sm:text-sm gap-2 border-none shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Mulai Latihan</span>
            <ArrowRight className="size-4 text-[#1A4D5C]" />
          </Button>
        ) : (
          <Button
            asChild
            className="w-full sm:w-auto h-11 px-7 rounded-full bg-[#F7CE46] hover:bg-[#eabf32] text-[#1A4D5C] font-bold text-xs sm:text-sm gap-2 border-none shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Link href={practiceHref}>
              <span>Mulai Latihan</span>
              <ArrowRight className="size-4 text-[#1A4D5C]" />
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
