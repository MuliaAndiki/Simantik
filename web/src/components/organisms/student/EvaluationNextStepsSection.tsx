import { ChevronsRight } from 'lucide-react';
import type * as React from 'react';
import {
  EvaluationNextStepCard,
  type EvaluationNextStepItem,
} from '@/components/molecules/student';
import { EvaluationSection } from './EvaluationSection';

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
  return (
    <EvaluationSection
      icon={<ChevronsRight className="size-5 text-slate-800" />}
      title={title}
      subtitle={subtitle}
      isLoading={isLoading}
      isEmpty={!steps || steps.length === 0}
      className={className}
    >
      {(steps ?? []).map((step) => (
        <div key={step.id} className="h-full">
          <EvaluationNextStepCard step={step} />
        </div>
      ))}
    </EvaluationSection>
  );
}
