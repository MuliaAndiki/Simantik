import type * as React from 'react';
import {
  EvaluationLatestScoreCard,
  type EvaluationLatestScoreCardProps,
  EvaluationOverallScoreCard,
  type EvaluationOverallScoreCardProps,
  EvaluationTrendChartCard,
  type EvaluationTrendChartCardProps,
} from '@/components/molecules/student';
import { cn } from '@/utils/classname';

export interface EvaluationOverviewGridProps {
  overallProps?: Partial<EvaluationOverallScoreCardProps>;
  latestProps?: Partial<EvaluationLatestScoreCardProps>;
  trendProps?: Partial<EvaluationTrendChartCardProps>;
  className?: string;
}

export function EvaluationOverviewGrid({
  overallProps,
  latestProps,
  trendProps,
  className,
}: EvaluationOverviewGridProps) {
  return (
    <section aria-label="Ringkasan Performa Evaluasi" className={cn('w-full', className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {/* Card 1: Performa Keseluruhan */}
        <div className="h-full">
          <EvaluationOverallScoreCard {...overallProps} />
        </div>

        {/* Card 2: Skor Terbaru */}
        <div className="h-full">
          <EvaluationLatestScoreCard {...latestProps} />
        </div>

        {/* Card 3: Tren Performa (Area Chart) */}
        <div className="h-full">
          <EvaluationTrendChartCard {...trendProps} />
        </div>
      </div>
    </section>
  );
}
