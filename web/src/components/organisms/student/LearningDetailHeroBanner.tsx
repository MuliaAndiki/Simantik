import { ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import type * as React from 'react';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface LearningDetailHeroBannerProps {
  title: string;
  description: string;
  competencyName?: string;
  competencyCode?: string;
  sourceBadge?: string;
  syncStatusText?: string;
  illustrationSrc?: string;
  className?: string;
}

export function LearningDetailHeroBanner({
  title,
  description,
  competencyName = 'Pemahaman Tekstual',
  competencyCode,
  sourceBadge,
  syncStatusText,
  illustrationSrc = '/illustrations/student-learning.jpg',
  className,
}: LearningDetailHeroBannerProps) {
  const getBadgeStyle = (code?: string) => {
    switch (code) {
      case 'pemahaman-inferensial':
      case 'INFERENSIAL':
        return 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]';
      case 'evaluasi-apresiasi':
      case 'EVALUASI':
        return 'bg-[#E6F4EA] text-[#0D9488] border-[#A7F3D0]';
      default:
        return 'bg-[#E0F7FA] text-[#0284C7] border-[#BDEAF0]';
    }
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border border-[#E5E7EB] bg-white shadow-xs',
        className
      )}
    >
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-10">
        {/* Left Informational Content */}
        <div className="flex-1 space-y-4 text-left w-full">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold border',
                getBadgeStyle(competencyCode)
              )}
            >
              {competencyName}
            </span>

            {sourceBadge && (
              <span className="inline-flex items-center rounded-md px-3 py-1 text-xs font-medium bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                {sourceBadge}
              </span>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-[#546A72] leading-relaxed max-w-2xl font-normal">
              {description}
            </p>
          </div>

          {/* Sync Status */}
          {syncStatusText && (
            <div className="pt-2 flex items-center gap-2 text-xs text-[#546A72] font-medium">
              <ShieldCheck className="size-4 text-[#0EA5E9]" />
              <span>{syncStatusText}</span>
            </div>
          )}
        </div>

        {/* Right Study Desk Illustration Container */}
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
