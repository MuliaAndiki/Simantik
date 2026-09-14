import type * as React from 'react';
import {
  PracticeFilterBar,
  type PracticeFilterBarProps,
} from '@/components/molecules/student/PracticeFilterBar';
import {
  PracticeHeroBanner,
  type PracticeHeroBannerProps,
  PracticePackagesListGrid,
  type PracticePackagesListGridProps,
  StudentDashboardFooter,
} from '@/components/organisms/student';
import { cn } from '@/utils/classname';

export interface StudentPracticeTemplateProps {
  heroProps?: PracticeHeroBannerProps;
  filterProps: PracticeFilterBarProps;
  packagesProps: PracticePackagesListGridProps;
  className?: string;
}

export function StudentPracticeTemplate({
  heroProps,
  filterProps,
  packagesProps,
  className,
}: StudentPracticeTemplateProps) {
  return (
    <div className={cn('w-full max-w-full mx-auto space-y-6 md:space-y-8 pb-6', className)}>
      {/* 1. Top Informational Hero Banner */}
      <PracticeHeroBanner {...heroProps} />

      {/* 2. Filter Bar (Search, Competency Select, Status Select) */}
      <PracticeFilterBar {...filterProps} />

      {/* 3. Grid of Practice Packages List */}
      <PracticePackagesListGrid {...packagesProps} />

      {/* 4. Unified Footer */}
      <StudentDashboardFooter />
    </div>
  );
}
