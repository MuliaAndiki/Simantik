import type * as React from 'react';
import {
  EvaluationHeroBanner,
  type EvaluationHeroBannerProps,
} from '@/components/molecules/student';
import {
  EvaluationNextStepsSection,
  type EvaluationNextStepsSectionProps,
  EvaluationOverviewGrid,
  type EvaluationOverviewGridProps,
  EvaluationPillarsSection,
  type EvaluationPillarsSectionProps,
  StudentDashboardFooter,
} from '@/components/organisms/student';
import { cn } from '@/utils/classname';

export interface StudentEvaluationTemplateProps {
  heroProps?: EvaluationHeroBannerProps;
  overviewProps?: EvaluationOverviewGridProps;
  pillarsProps?: EvaluationPillarsSectionProps;
  nextStepsProps?: EvaluationNextStepsSectionProps;
  className?: string;
}

export function StudentEvaluationTemplate({
  heroProps,
  overviewProps,
  pillarsProps,
  nextStepsProps,
  className,
}: StudentEvaluationTemplateProps) {
  return (
    <div className={cn('w-full max-w-full mx-auto space-y-6 md:space-y-8 pb-6', className)}>
      {/* 1. Header Hero Banner with Student Illustration */}
      <EvaluationHeroBanner {...heroProps} />

      {/* 2. 3-Column Performance Metrics (Overall Gauge, Latest Score, Trend Area Chart) */}
      <EvaluationOverviewGrid {...overviewProps} />

      {/* 3. 3-Pillar Competency Summary Section */}
      <EvaluationPillarsSection {...pillarsProps} />

      {/* 4. Action-oriented Next Steps Recommendations */}
      <EvaluationNextStepsSection {...nextStepsProps} />

      {/* 5. Unified Platform Footer */}
      <StudentDashboardFooter />
    </div>
  );
}
