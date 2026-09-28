import type * as React from 'react';
import type {
  EvaluationHeroBannerProps,
  EvaluationLatestScoreCardProps,
  EvaluationNextStepItem,
  EvaluationOverallScoreCardProps,
  EvaluationPillarItem,
  EvaluationTrendChartCardProps,
} from '@/components/molecules/student';
import { StudentEvaluationTemplate } from '@/components/templates/student/StudentEvaluationTemplate';

export interface StudentEvaluationPageProps {
  isLoading?: boolean;
  heroProps?: EvaluationHeroBannerProps;
  overallProps?: Partial<EvaluationOverallScoreCardProps>;
  latestProps?: Partial<EvaluationLatestScoreCardProps>;
  trendProps?: Partial<EvaluationTrendChartCardProps>;
  pillars?: EvaluationPillarItem[];
  onViewDetailCompetencies?: () => void;
  steps?: EvaluationNextStepItem[];
  className?: string;
}

export function StudentEvaluationPage({
  isLoading,
  heroProps,
  overallProps,
  latestProps,
  trendProps,
  pillars,
  onViewDetailCompetencies,
  steps,
  className,
}: StudentEvaluationPageProps) {
  return (
    <StudentEvaluationTemplate
      heroProps={heroProps}
      overviewProps={{
        overallProps: { ...overallProps, isLoading },
        latestProps: { ...latestProps, isLoading },
        trendProps: { ...trendProps, isLoading },
      }}
      pillarsProps={{
        pillars,
        isLoading,
        onViewDetail: onViewDetailCompetencies,
      }}
      nextStepsProps={{
        steps,
        isLoading,
      }}
      className={className}
    />
  );
}

export default StudentEvaluationPage;
