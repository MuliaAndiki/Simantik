import { FileText } from 'lucide-react';
import type * as React from 'react';
import { EvaluationPillarCard, type EvaluationPillarItem } from '@/components/molecules/student';
import { EvaluationSection } from './EvaluationSection';

export interface EvaluationPillarsSectionProps {
  pillars?: EvaluationPillarItem[];
  title?: string;
  subtitle?: string;
  detailActionText?: string;
  isLoading?: boolean;
  onViewDetail?: () => void;
  className?: string;
}

export function EvaluationPillarsSection({
  pillars,
  title = 'Ringkasan Kompetensi',
  subtitle = 'Berikut gambaran performamu pada tiga pilar kompetensi TKA Bahasa Indonesia.',
  detailActionText = 'Lihat Detail Kompetensi',
  isLoading,
  onViewDetail,
  className,
}: EvaluationPillarsSectionProps) {
  return (
    <EvaluationSection
      icon={<FileText className="size-5 text-slate-800" />}
      title={title}
      subtitle={subtitle}
      actionText={onViewDetail ? detailActionText : undefined}
      onAction={onViewDetail}
      isLoading={isLoading}
      isEmpty={!pillars || pillars.length === 0}
      className={className}
    >
      {(pillars ?? []).map((pillar) => (
        <div key={pillar.id} className="h-full">
          <EvaluationPillarCard pillar={pillar} />
        </div>
      ))}
    </EvaluationSection>
  );
}
