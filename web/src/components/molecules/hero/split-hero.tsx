import Image from 'next/image';
import type * as React from 'react';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface SplitHeroProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  topBadges?: React.ReactNode;
  bottomExtra?: React.ReactNode;
  illustrationSrc?: string;
  illustrationAlt?: string;
  illustrationBoxClass?: string;
  illustrationSizeClass?: string;
  cardClassName?: string;
  leftSpacingClass?: string;
  descriptionClass?: string;
  className?: string;
}

// Hero split generik: teks kiri + ilustrasi kanan.
// Dipakai learning, practice, tryout, module-detail, learning-detail.
export function SplitHero({
  title,
  description,
  topBadges,
  bottomExtra,
  illustrationSrc = '/illustrations/student-learning.jpg',
  illustrationAlt = 'Ilustrasi pembelajaran siswa',
  illustrationBoxClass,
  illustrationSizeClass = 'w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64',
  cardClassName,
  leftSpacingClass = 'space-y-3 md:space-y-4',
  descriptionClass = 'text-sm md:text-base text-[#546A72] leading-relaxed max-w-2xl font-normal',
  className,
}: SplitHeroProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border border-[#E5E7EB] bg-white shadow-xs',
        cardClassName,
        className
      )}
    >
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-10">
        <div className={cn('flex-1 text-left', leftSpacingClass)}>
          {topBadges}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight leading-tight">
              {title}
            </h1>
            {description && <p className={descriptionClass}>{description}</p>}
          </div>
          {bottomExtra}
        </div>

        <div
          className={cn(
            'w-full md:w-80 sm:w-64 max-w-xs shrink-0 flex items-center justify-center p-2 rounded-2xl',
            illustrationBoxClass
          )}
        >
          <div className={cn('relative', illustrationSizeClass)}>
            <Image
              src={illustrationSrc}
              alt={typeof illustrationAlt === 'string' ? illustrationAlt : 'Ilustrasi pembelajaran'}
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
