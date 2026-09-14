import type * as React from 'react';
import {
  LatestUpdatesGrid,
  type LatestUpdatesGridProps,
  LearningMaterialsGrid,
  type LearningMaterialsGridProps,
  PerformanceSummaryGrid,
  type PerformanceSummaryGridProps,
  QuickActionsGrid,
  type QuickActionsGridProps,
  RecommendationBanner,
  type RecommendationBannerProps,
  StudentDashboardFooter,
  StudentHeroBanner,
  type StudentHeroBannerProps,
} from '@/components/organisms/student';
import { cn } from '@/utils/classname';

export interface StudentDashboardTemplateProps {
  heroProps?: StudentHeroBannerProps;
  quickActionsProps?: QuickActionsGridProps;
  performanceProps?: PerformanceSummaryGridProps;
  materialsProps?: LearningMaterialsGridProps;
  recommendationProps?: RecommendationBannerProps;
  updatesProps?: LatestUpdatesGridProps;
  className?: string;
}

export function StudentDashboardTemplate({
  heroProps,
  quickActionsProps,
  performanceProps,
  materialsProps,
  recommendationProps,
  updatesProps,
  className,
}: StudentDashboardTemplateProps) {
  return (
    <div className={cn('w-full max-w-full mx-auto space-y-8 md:space-y-10 pb-6', className)}>
      {/* 1. Hero Greeting Banner */}
      <StudentHeroBanner {...heroProps} />

      {/* 2. Mulai Sekarang (Quick Actions) */}
      <QuickActionsGrid {...quickActionsProps} />

      {/* 3. Ringkasan Performa (Performance Summary) */}
      <PerformanceSummaryGrid {...performanceProps} />

      {/* 4. Materi Bahasa Indonesia */}
      <LearningMaterialsGrid {...materialsProps} />

      {/* 5. Rekomendasi Untukmu */}
      <RecommendationBanner {...recommendationProps} />

      {/* 6. Informasi Terbaru */}
      <LatestUpdatesGrid {...updatesProps} />

      {/* 7. Footer */}
      <StudentDashboardFooter />
    </div>
  );
}
