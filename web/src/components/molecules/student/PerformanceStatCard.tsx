import type * as React from 'react';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface PerformanceStatCardProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor?: string;
  iconColor?: string;
  value: React.ReactNode;
  subtext?: string;
  badge?: {
    text: string;
    variant?: 'success' | 'warning' | 'info' | 'default';
  };
  className?: string;
}

export function PerformanceStatCard({
  label,
  icon: Icon,
  iconBgColor = 'bg-[#E0F7FA]',
  iconColor = 'text-[#1A4D5C]',
  value,
  subtext,
  badge,
  className,
}: PerformanceStatCardProps) {
  return (
    <Card
      className={cn(
        'flex flex-col justify-between p-4 md:p-5 rounded-2xl border border-[#E5E7EB] bg-white transition-all hover:shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-medium text-[#546A72]">{label}</span>
        <div
          className={cn(
            'flex size-8 items-center justify-center rounded-lg shrink-0',
            iconBgColor,
            iconColor
          )}
        >
          <Icon className="size-4" />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="text-base md:text-lg font-bold text-[#111827] tracking-tight">{value}</div>

        {badge && (
          <div className="pt-0.5">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold',
                badge.variant === 'success' || !badge.variant
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : badge.variant === 'warning'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    : 'bg-blue-50 text-blue-700 border border-blue-200/60'
              )}
            >
              {badge.text}
            </span>
          </div>
        )}

        {subtext && <p className="text-xs text-[#546A72] line-clamp-1">{subtext}</p>}
      </div>
    </Card>
  );
}
