import type * as React from 'react';
import {
  LearningFilterBar,
  type LearningFilterBarProps,
} from '@/components/molecules/student/LearningFilterBar';
import {
  LearningHeroBanner,
  type LearningHeroBannerProps,
  LearningMaterialsListGrid,
  type LearningMaterialsListGridProps,
  StudentDashboardFooter,
} from '@/components/organisms/student';
import { cn } from '@/utils/classname';

export interface StudentLearningTemplateProps {
  heroProps?: LearningHeroBannerProps;
  filterProps: LearningFilterBarProps;
  materialsProps: LearningMaterialsListGridProps;
  className?: string;
}

export function StudentLearningTemplate({
  heroProps,
  filterProps,
  materialsProps,
  className,
}: StudentLearningTemplateProps) {
  return (
    <div className={cn('w-full max-w-full mx-auto space-y-6 md:space-y-8 pb-6', className)}>
      {/* 1. Top Informational Hero Banner */}
      <LearningHeroBanner {...heroProps} />

      {/* 2. Filter Bar (Search & Competency Select) */}
      <LearningFilterBar {...filterProps} />

      {/* 3. Grid of Materials List */}
      <LearningMaterialsListGrid {...materialsProps} />

      {/* 4. Unified Footer */}
      <StudentDashboardFooter />
    </div>
  );
}
