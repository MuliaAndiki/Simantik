import { ArrowUp, Star } from 'lucide-react';
import type * as React from 'react';
import { Badge } from '@/components/atoms/badge';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface EvaluationLatestScoreCardProps {
  score?: number;
  maxScore?: number;
  evaluationSessionName?: string;
  deltaPoints?: number;
  description?: string;
  accuracyRatioText?: string;
  accuracyPercentageText?: string;
  className?: string;
}

export function EvaluationLatestScoreCard({
  score = 82,
  maxScore = 100,
  evaluationSessionName = 'Evaluasi ke-4',
  deltaPoints = 4,
  description = 'Diperoleh dari sesi evaluasi komprehensif simulasi TKA Paket 2. Menunjukkan penguasaan penalaran wacana membaik.',
  accuracyRatioText = 'Rasio Akurasi: 25 / 30 Benar',
  accuracyPercentageText = '83.3%',
  className,
}: EvaluationLatestScoreCardProps) {
  return (
    <Card
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full transition-all duration-200 hover:shadow-md hover:border-slate-300/80',
        className
      )}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
              <Star className="size-4.5 fill-amber-400/30 text-amber-500" />
            </div>
            <h2 className="font-bold text-slate-800 text-sm sm:text-base">Skor Terbaru</h2>
          </div>
          <Badge
            variant="outline"
            className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            {evaluationSessionName}
          </Badge>
        </div>

        {/* Score Display Row */}
        <div className="flex items-baseline gap-2.5 pt-1 pb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
              {score}
            </span>
            <span className="text-sm sm:text-base font-semibold text-slate-400">/ {maxScore}</span>
          </div>

          {deltaPoints !== undefined && (
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
              <ArrowUp className="size-3 stroke-[2.5]" />
              {deltaPoints > 0 ? `+${deltaPoints}` : deltaPoints} Poin
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 leading-relaxed mt-1">{description}</p>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-100 pt-3.5 mt-4 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-normal truncate mr-2">{accuracyRatioText}</span>
        <span className="font-bold text-slate-900 text-xs sm:text-sm shrink-0">
          {accuracyPercentageText}
        </span>
      </div>
    </Card>
  );
}
