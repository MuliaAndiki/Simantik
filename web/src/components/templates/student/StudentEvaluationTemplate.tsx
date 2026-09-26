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
      {overviewProps?.trendProps?.trendStatusLabel === 'Data Belum Cukup' ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">Simulasi Belum Cukup</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Sistem membutuhkan setidaknya 2 pengerjaan Tryout untuk dapat menganalisis tren
            peningkatan performa Anda secara akurat.
          </p>
        </div>
      ) : (
        <EvaluationOverviewGrid {...overviewProps} />
      )}

      {/* 3. 3-Pillar Competency Summary Section */}
      <EvaluationPillarsSection {...pillarsProps} />

      {/* 4. Action-oriented Next Steps Recommendations */}
      <EvaluationNextStepsSection {...nextStepsProps} />

      {/* 5. Unified Platform Footer */}
      <StudentDashboardFooter />
    </div>
  );
}
