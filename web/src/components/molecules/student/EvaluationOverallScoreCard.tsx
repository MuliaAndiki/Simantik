import { Award } from 'lucide-react';
import type * as React from 'react';
import { Badge } from '@/components/atoms/badge';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface EvaluationOverallScoreCardProps {
  score?: number;
  maxScore?: number;
  statusLabel?: string;
  categoryTitle?: string;
  categoryDescription?: string;
  passingStandardText?: string;
  passingStatusBadge?: string;
  className?: string;
}

export function EvaluationOverallScoreCard({
  score = 82,
  maxScore = 100,
  statusLabel = 'Baik',
  categoryTitle = 'Kategori Standar Literasi Bahasa Indonesia',
  categoryDescription = 'Performa kamu berada pada kategori baik. Di atas batas kompetensi nasional (75).',
  passingStandardText = 'Standar kelulusan ambang TKA 2026: 70',
  passingStatusBadge = 'Lolos Ambang',
  className,
}: EvaluationOverallScoreCardProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full transition-all duration-200 hover:shadow-md hover:border-slate-300/80',
        className
      )}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
              <Award className="size-4.5" />
            </div>
            <h2 className="font-bold text-slate-800 text-sm sm:text-base">Performa Keseluruhan</h2>
          </div>
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200/80 text-xs font-semibold px-2.5 py-0.5 rounded-full"
          >
            {statusLabel}
          </Badge>
        </div>

        {/* Body Content */}
        <div className="flex items-center gap-4 sm:gap-5 py-2">
          {/* Radial Donut Gauge */}
          <div className="relative size-24 shrink-0 flex items-center justify-center">
            <svg
              className="size-full -rotate-90"
              viewBox="0 0 96 96"
              role="img"
              aria-label={`Skor performa keseluruhan: ${score} dari ${maxScore}`}
            >
              <title>Grafik Skor Performa Keseluruhan</title>
              {/* Background Track */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="7"
                fill="none"
              />
              {/* Progress Stroke */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-[#1A4D5C] transition-all duration-700 ease-out"
                strokeWidth="7.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                {score}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 leading-tight">
                /{maxScore}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
              {categoryTitle}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
              {categoryDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-100 pt-3.5 mt-4 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-normal truncate mr-2">{passingStandardText}</span>
        <span className="font-semibold text-teal-800 bg-teal-50/90 border border-teal-200/70 px-2 py-0.5 rounded-md text-[11px] shrink-0">
          {passingStatusBadge}
        </span>
      </div>
    </Card>
  );
}
