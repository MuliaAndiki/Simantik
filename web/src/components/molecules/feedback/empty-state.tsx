import { SearchX } from 'lucide-react';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { CardSkeleton } from '@/components/atoms/loading';
import { cn } from '@/utils/classname';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

// Empty state seragam untuk grid daftar (practice, learning).
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'py-16 px-4 rounded-2xl border border-dashed border-[#E5E7EB] bg-white flex flex-col items-center justify-center text-center space-y-3',
        className
      )}
    >
      <div className="size-12 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#546A72]">
        {icon ?? <SearchX className="size-6" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-[#111827]">{title}</h3>
        {description && <p className="text-xs md:text-sm text-[#546A72] max-w-sm">{description}</p>}
      </div>
      {actionLabel && (
        <Button
          type="button"
          variant="outline"
          onClick={onAction}
          className="mt-2 rounded-xl text-xs font-semibold h-9"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export interface ListSectionHeaderProps {
  title: string;
  description?: string;
  countBadge?: React.ReactNode;
  standardText?: string;
  className?: string;
}

// Header section daftar (practice, learning): judul + badge + standar kanan.
export function ListSectionHeader({
  title,
  description,
  countBadge,
  standardText = 'Asesmen TKA 2024/2025',
  className,
}: ListSectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E5E7EB] pb-3',
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-bold tracking-tight text-[#111827]">{title}</h2>
          {countBadge}
        </div>
        {description && <p className="text-xs md:text-sm text-[#546A72]">{description}</p>}
      </div>

      <div className="text-xs text-[#546A72] font-medium shrink-0">
        Standar: <span className="font-semibold text-[#111827]">{standardText}</span>
      </div>
    </div>
  );
}
