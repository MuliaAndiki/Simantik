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
        overallProps,
        latestProps,
        trendProps,
      }}
      pillarsProps={{
        pillars,
        onViewDetail: onViewDetailCompetencies,
      }}
      nextStepsProps={{
        steps,
      }}
      className={className}
    />
  );
}

export default StudentEvaluationPage;
