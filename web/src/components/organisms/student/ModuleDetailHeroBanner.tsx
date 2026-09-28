import { CheckCircle2, Layers } from 'lucide-react';
import type * as React from 'react';
import { SplitHero } from '@/components/molecules/hero';

export interface ModuleDetailHeroBannerProps {
  title: string;
  description: string;
  materialsCount: number;
  completedCount: number;
  progressPercentage: number;
  illustrationSrc?: string;
  className?: string;
}

export function ModuleDetailHeroBanner({
  title,
  description,
  materialsCount,
  completedCount,
  progressPercentage,
  illustrationSrc = '/illustrations/student-learning.jpg',
  className,
}: ModuleDetailHeroBannerProps) {
  return (
    <SplitHero
      title={title}
      description={description}
      descriptionClass="text-sm sm:text-base text-[#546A72] leading-relaxed max-w-2xl font-normal"
      leftSpacingClass="space-y-4 w-full"
      illustrationSrc={illustrationSrc}
      illustrationAlt={title}
      illustrationBoxClass="p-3 bg-[#F0F9FA] border border-[#DCEFF2]"
      illustrationSizeClass="w-48 h-40 sm:w-56 sm:h-44 md:w-64 md:h-48"
      topBadges={
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold bg-[#E0F7FA] text-[#0284C7] border border-[#BDEAF0]">
            <Layers className="size-3.5" />
            <span>Modul Pembelajaran</span>
          </span>

          {materialsCount > 0 && (
            <span className="inline-flex items-center rounded-md px-3 py-1 text-xs font-medium bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
              {materialsCount} Materi Tersedia
            </span>
          )}
        </div>
      }
      bottomExtra={
        <div className="pt-2 max-w-md space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#546A72] flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-[#0EA5E9]" />
              Progres Pembelajaran
            </span>
            <span className="text-[#1A4D5C]">
              {completedCount}/{materialsCount} Selesai ({Math.round(progressPercentage)}%)
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#E0F2FE] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#0284C7] transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
            />
          </div>
        </div>
      }
      className={className}
    />
  );
}
