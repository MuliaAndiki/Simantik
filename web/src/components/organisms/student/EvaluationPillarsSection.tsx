import { ArrowRight, FileText } from 'lucide-react';
import type * as React from 'react';
import { CardSkeleton } from '@/components/atoms/loading';
import { EvaluationPillarCard, type EvaluationPillarItem } from '@/components/molecules/student';
import { cn } from '@/utils/classname';

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
  if (isLoading) {
    return (
      <section aria-label={title} className={cn('w-full space-y-4', className)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 pt-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={`pillar-skeleton-${i}`} lines={3} />
          ))}
        </div>
      </section>
    );
  }

  if (!pillars || pillars.length === 0) return null;

  return (
    <section aria-label={title} className={cn('w-full space-y-4', className)}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-slate-800" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">{subtitle}</p>
        </div>

        {onViewDetail && (
          <button
            type="button"
            onClick={onViewDetail}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-teal-700 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>{detailActionText}</span>
            <ArrowRight className="size-3.5" />
          </button>
        )}
      </div>

      {/* Pillars 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 pt-1">
        {pillars.map((pillar) => (
          <div key={pillar.id} className="h-full">
            <EvaluationPillarCard pillar={pillar} />
          </div>
        ))}
      </div>
    </section>
  );
}
