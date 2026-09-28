import { ChevronsRight } from 'lucide-react';
import type * as React from 'react';
import { CardSkeleton } from '@/components/atoms/loading';
import {
  EvaluationNextStepCard,
  type EvaluationNextStepItem,
} from '@/components/molecules/student';
import { cn } from '@/utils/classname';

export interface EvaluationNextStepsSectionProps {
  steps?: EvaluationNextStepItem[];
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  className?: string;
}

export function EvaluationNextStepsSection({
  steps,
  title = 'Langkah Selanjutnya',
  subtitle = 'Berdasarkan hasil evaluasimu, ini rekomendasi langkah terarah yang bisa kamu lakukan.',
  isLoading,
  className,
}: EvaluationNextStepsSectionProps) {
  if (isLoading) {
    return (
      <section aria-label={title} className={cn('w-full space-y-4', className)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 pt-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={`step-skeleton-${i}`} lines={3} />
          ))}
        </div>
      </section>
    );
  }

  if (!steps || steps.length === 0) return null;

  return (
    <section aria-label={title} className={cn('w-full space-y-4', className)}>
      {/* Section Header */}
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5">
          <ChevronsRight className="size-5 text-slate-800" />
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">{subtitle}</p>
      </div>

      {/* Steps 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 pt-1">
        {steps.map((step) => (
          <div key={step.id} className="h-full">
            <EvaluationNextStepCard step={step} />
          </div>
        ))}
      </div>
    </section>
  );
}
