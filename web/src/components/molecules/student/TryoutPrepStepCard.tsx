import { CheckCircle2 } from 'lucide-react';
import type * as React from 'react';
import { cn } from '@/utils/classname';

export interface TryoutPrepStepCardProps {
  stepNumber: string;
  badgeVariant?: 'cyan' | 'amber' | 'emerald';
  title: string;
  description: string;
  checkItemText: string;
  className?: string;
}

export function TryoutPrepStepCard({
  stepNumber,
  badgeVariant = 'cyan',
  title,
  description,
  checkItemText,
  className,
}: TryoutPrepStepCardProps) {
  const getBadgeStyle = () => {
    switch (badgeVariant) {
      case 'amber':
        return 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]';
      case 'emerald':
        return 'bg-[#ECFDF5] text-[#059669] border-emerald-200/60';
      default:
        return 'bg-[#E0F7FA] text-[#0284C7] border-[#BDEAF0]';
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col justify-between p-5 md:p-6 rounded-xl border border-[#E5E7EB] bg-[#FAFCFD] hover:bg-white hover:border-[#8BBCC5]/60 hover:shadow-xs transition-all space-y-4',
        className
      )}
    >
      <div className="space-y-3">
        {/* Step Badge */}
        <span
          className={cn(
            'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold border',
            getBadgeStyle()
          )}
        >
          {stepNumber}
        </span>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h4 className="text-base font-bold text-[#111827]">{title}</h4>
          <p className="text-xs sm:text-sm text-[#546A72] leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Bottom Check Item */}
      <div className="pt-3 border-t border-[#E5E7EB]/60 flex items-start gap-2 text-xs text-[#059669] font-medium">
        <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-[#059669]" />
        <span>{checkItemText}</span>
      </div>
    </div>
  );
}
