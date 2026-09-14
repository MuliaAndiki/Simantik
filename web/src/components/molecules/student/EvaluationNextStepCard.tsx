import { ArrowRight } from 'lucide-react';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface EvaluationNextStepItem {
  id: string;
  stepNumber: string; // e.g. "01", "02", "03"
  title: string;
  description: string;
  actionText: string;
  actionVariant?: 'solid' | 'outline';
  onAction?: () => void;
}

export interface EvaluationNextStepCardProps {
  step: EvaluationNextStepItem;
  className?: string;
}

export function EvaluationNextStepCard({ step, className }: EvaluationNextStepCardProps) {
  const isSolid = step.actionVariant === 'solid';

  return (
    <Card
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full transition-all duration-200 hover:border-slate-300/80 hover:shadow-md space-y-4',
        className
      )}
    >
      <div className="space-y-3">
        {/* Step Number Badge */}
        <div>
          <span className="inline-flex items-center justify-center size-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs tracking-tight">
            {step.stepNumber}
          </span>
        </div>

        {/* Title and Description */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
            {step.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed min-h-[44px]">{step.description}</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={step.onAction}
          className={cn(
            'w-full h-10 rounded-xl text-xs font-semibold gap-1.5 transition-all duration-200 cursor-pointer',
            isSolid
              ? 'bg-[#1A4D5C] hover:bg-[#123945] text-white border-none shadow-xs hover:scale-[1.01] active:scale-[0.99]'
              : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-2xs hover:scale-[1.01] active:scale-[0.99]'
          )}
        >
          <span>{step.actionText}</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </Card>
  );
}
