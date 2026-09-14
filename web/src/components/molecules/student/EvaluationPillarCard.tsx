import { ArrowRight } from 'lucide-react';
import type * as React from 'react';
import { Badge } from '@/components/atoms/badge';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface EvaluationPillarItem {
  id: string;
  pillarNumber: string; // e.g. "PILAR 01"
  title: string;
  description: string;
  score: number;
  maxScore?: number;
  accuracyOrStatusText: string;
  accuracyOrStatusColor?: 'emerald' | 'amber' | 'teal';
  levelBadgeText: string;
  levelBadgeVariant?: 'emerald' | 'amber';
  isFocusPillar?: boolean;
  focusBadgeText?: string;
  footerLeftText: string;
  footerRightText: string;
  footerActionHref?: string;
  onFooterAction?: () => void;
}

export interface EvaluationPillarCardProps {
  pillar: EvaluationPillarItem;
  className?: string;
}

export function EvaluationPillarCard({ pillar, className }: EvaluationPillarCardProps) {
  const maxScore = pillar.maxScore ?? 100;
  const percentage = Math.min(100, Math.max(0, (pillar.score / maxScore) * 100));

  const statusColorMap = {
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    teal: 'text-teal-700',
  };

  const badgeVariantMap = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
  };

  return (
    <Card
      className={cn(
        'rounded-2xl bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-all duration-200 relative',
        pillar.isFocusPillar
          ? 'border border-amber-300 ring-1 ring-amber-300/60 shadow-sm'
          : 'border border-slate-200/80 hover:border-slate-300/80 hover:shadow-md',
        className
      )}
    >
      {/* Floating Focus Badge for Priority Pillar */}
      {pillar.isFocusPillar && (
        <div className="absolute -top-3 right-6 z-10">
          <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs inline-block">
            {pillar.focusBadgeText ?? 'Fokus Penguatan'}
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-3.5">
        {/* Top Header: Pillar Number and Level Badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-black text-slate-700 tracking-wider uppercase">
            {pillar.pillarNumber}
          </span>
          <Badge
            variant="outline"
            className={cn(
              'text-xs font-semibold px-2.5 py-0.5 rounded-full',
              badgeVariantMap[pillar.levelBadgeVariant ?? 'emerald']
            )}
          >
            {pillar.levelBadgeText}
          </Badge>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-900 leading-snug">{pillar.title}</h3>
          <p className="text-xs text-slate-500 leading-relaxed min-h-[40px]">
            {pillar.description}
          </p>
        </div>

        {/* Score & Progress Indicator */}
        <div className="space-y-2 pt-1">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                {pillar.score}
              </span>
              <span className="text-xs font-semibold text-slate-400">/{maxScore}</span>
            </div>
            <span
              className={cn(
                'text-xs font-bold',
                statusColorMap[pillar.accuracyOrStatusColor ?? 'emerald']
              )}
            >
              {pillar.accuracyOrStatusText}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                pillar.isFocusPillar ? 'bg-amber-400' : 'bg-[#1A4D5C]'
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-100 pt-3.5 mt-4 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-normal truncate mr-2">{pillar.footerLeftText}</span>

        {pillar.onFooterAction ? (
          <button
            type="button"
            onClick={pillar.onFooterAction}
            className="font-bold text-slate-900 hover:text-teal-700 hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
          >
            <span>{pillar.footerRightText}</span>
            <ArrowRight className="size-3.5" />
          </button>
        ) : (
          <span className="font-bold text-slate-900 shrink-0">{pillar.footerRightText}</span>
        )}
      </div>
    </Card>
  );
}
