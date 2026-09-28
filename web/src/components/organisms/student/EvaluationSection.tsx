import { ArrowRight } from 'lucide-react';
import type * as React from 'react';
import { CardSkeleton } from '@/components/atoms/loading';
import { cn } from '@/utils/classname';

export interface EvaluationSectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  isLoading?: boolean;
  isEmpty?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Cangkang section evaluasi (pilar kompetensi, langkah selanjutnya):
// header + skeleton saat loading + null saat kosong.
export function EvaluationSection({
  icon,
  title,
  subtitle,
  actionText,
  onAction,
  isLoading,
  isEmpty,
  children,
  className,
}: EvaluationSectionProps) {
  if (isLoading) {
    return (
      <section aria-label={title} className={cn('w-full space-y-4', className)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 pt-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={`evaluation-skeleton-${i}`} lines={3} />
          ))}
        </div>
      </section>
    );
  }

  if (isEmpty) return null;

  return (
    <section aria-label={title} className={cn('w-full space-y-4', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
          </div>
          {subtitle && <p className="text-xs sm:text-sm text-slate-500">{subtitle}</p>}
        </div>

        {actionText && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-teal-700 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>{actionText}</span>
            <ArrowRight className="size-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 pt-1">{children}</div>
    </section>
  );
}
