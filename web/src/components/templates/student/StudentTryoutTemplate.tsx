import type * as React from 'react';
import {
  StudentDashboardFooter,
  TryoutHeroBanner,
  type TryoutHeroBannerProps,
  TryoutPrepTipsCard,
  type TryoutPrepTipsCardProps,
  TryoutStandardsCard,
  type TryoutStandardsCardProps,
} from '@/components/organisms/student';
import { cn } from '@/utils/classname';

export interface StudentTryoutTemplateProps {
  heroProps?: TryoutHeroBannerProps; // kept for fallback
  tryouts?: TryoutHeroBannerProps[]; // new array support
  standardsProps?: TryoutStandardsCardProps;
  tipsProps?: TryoutPrepTipsCardProps;
  className?: string;
}

export function StudentTryoutTemplate({
  heroProps,
  tryouts,
  standardsProps,
  tipsProps,
  className,
}: StudentTryoutTemplateProps) {
  return (
    <div className={cn('w-full max-w-full mx-auto space-y-6 md:space-y-8 pb-6', className)}>
      {/* 1. Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight  text-slate-900">Tryout</h1>
        <p className="text-sm text-slate-500 mt-1">
          Uji kesiapan Anda dengan simulasi ujian berstandar nasional dan analisis mendalam.
        </p>
      </div>

      {/* 2. Top Promotional / Action Banners */}
      {tryouts && tryouts.length > 0 ? (
        tryouts.map((t, i) => <TryoutHeroBanner key={i} {...t} />)
      ) : (
        <TryoutHeroBanner {...heroProps} />
      )}

      {/* 3. Standards & Assessment Schedule Card */}
      <TryoutStandardsCard {...standardsProps} />

      {/* 4. Tips Before Starting Tryout Card */}
      <TryoutPrepTipsCard {...tipsProps} />

      {/* 5. Unified Footer */}
      <StudentDashboardFooter />
    </div>
  );
}
