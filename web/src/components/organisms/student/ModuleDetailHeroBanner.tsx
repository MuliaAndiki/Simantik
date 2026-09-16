import { CheckCircle2, Layers } from 'lucide-react';
import Image from 'next/image';
import type * as React from 'react';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

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
    <Card
      className={cn(
        'relative overflow-hidden p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border border-[#E5E7EB] bg-white shadow-xs',
        className
      )}
    >
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-10">
        {/* Left Info */}
        <div className="flex-1 space-y-4 text-left w-full">
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

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-[#546A72] leading-relaxed max-w-2xl font-normal">
              {description}
            </p>
          </div>

          {/* Progress Indicator */}
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
        </div>

        {/* Right Study Desk Illustration */}
        <div className="w-full md:w-80 sm:w-64 max-w-xs shrink-0 flex items-center justify-center p-3 rounded-2xl bg-[#F0F9FA] border border-[#DCEFF2]">
          <div className="relative w-48 h-40 sm:w-56 sm:h-44 md:w-64 md:h-48">
            <Image
              src={illustrationSrc}
              alt={title}
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
