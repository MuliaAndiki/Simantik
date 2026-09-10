import { Icon } from '@iconify/react';
import * as React from 'react';

import { Card } from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface FeaturePreviewCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: string;
  title: string;
  description: string;
  badgeText?: string;
}

/**
 * Preview card representing an upcoming key capability in the platform
 */
export function FeaturePreviewCard({
  icon,
  title,
  description,
  badgeText,
  className,
  ...props
}: FeaturePreviewCardProps) {
  return (
    <Card
      className={cn(
        'relative flex flex-col gap-4 p-6 rounded-[24px] bg-white border border-[#E0F7FA] shadow-md shadow-[#4CA7B1]/10 card-hover text-left transition-all duration-300',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center size-12 rounded-2xl bg-[#E0F7FA] text-[#1A4D5C]">
          <Icon icon={icon} className="size-6 text-[#4CA7B1]" />
        </div>
        {badgeText && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-[#E0F7FA] text-[#1A4D5C]">
            {badgeText}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-lg text-[#111827] tracking-tight">{title}</h3>
        <p className="text-sm text-[#404040] leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}
