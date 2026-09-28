import type * as React from 'react';
import { CardGridSkeleton } from '@/components/atoms/loading';
import { DashboardSectionHeader } from '@/components/molecules/student/DashboardSectionHeader';
import { cn } from '@/utils/classname';

export interface DashboardGridProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  isLoading?: boolean;
  isEmpty?: boolean;
  skeletonCount?: number;
  children: React.ReactNode;
  className?: string;
}

// Cangkang grid dashboard (materi, berita): header + skeleton + grid.
export function DashboardGrid({
  title,
  subtitle,
  actionText,
  actionHref,
  onAction,
  isLoading,
  isEmpty,
  skeletonCount = 3,
  children,
  className,
}: DashboardGridProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <DashboardSectionHeader
        title={title}
        subtitle={subtitle}
        actionText={actionText}
        actionHref={actionHref}
        onAction={onAction}
      />

      {isLoading ? (
        <CardGridSkeleton count={skeletonCount} lines={2} />
      ) : (
        !isEmpty && <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">{children}</div>
      )}
    </section>
  );
}
