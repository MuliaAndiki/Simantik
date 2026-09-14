import type * as React from 'react';
import { cn } from '@/utils/classname';

export interface TryoutStandardFeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor?: string;
  iconColor?: string;
  title: string;
  description: string;
  className?: string;
}

export function TryoutStandardFeatureCard({
  icon: Icon,
  iconBgColor = 'bg-[#E0F7FA]',
  iconColor = 'text-[#0284C7]',
  title,
  description,
  className,
}: TryoutStandardFeatureCardProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3.5 p-4 sm:p-5 rounded-xl border border-[#E5E7EB] bg-[#FAFCFD] hover:bg-white hover:border-[#8BBCC5]/60 hover:shadow-xs transition-all',
        className
      )}
    >
      <div
        className={cn(
          'flex size-10 sm:size-11 items-center justify-center rounded-xl shrink-0',
          iconBgColor,
          iconColor
        )}
      >
        <Icon className="size-5" />
      </div>

      <div className="space-y-1">
        <h4 className="text-sm sm:text-base font-bold text-[#111827]">{title}</h4>
        <p className="text-xs sm:text-sm text-[#546A72] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
