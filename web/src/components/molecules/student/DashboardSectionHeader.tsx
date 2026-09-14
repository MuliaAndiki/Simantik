import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { cn } from '@/utils/classname';

export interface DashboardSectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function DashboardSectionHeader({
  title,
  subtitle,
  actionText,
  actionHref,
  onAction,
  className,
}: DashboardSectionHeaderProps) {
  const renderAction = () => {
    if (!actionText) return null;

    const content = (
      <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#1a4d5c] hover:text-[#4ca7b1] transition-colors group cursor-pointer">
        {actionText}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    );

    if (actionHref) {
      return (
        <Link href={actionHref} onClick={onAction}>
          {content}
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={onAction}
        className="bg-transparent border-none p-0 cursor-pointer"
      >
        {content}
      </button>
    );
  };

  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4', className)}>
      <div className="space-y-1">
        <h2 className="text-lg md:text-xl font-bold tracking-tight text-[#111827]">{title}</h2>
        {subtitle && <p className="text-xs md:text-sm text-[#546A72]">{subtitle}</p>}
      </div>
      {renderAction()}
    </div>
  );
}
