'use client';

import { ArrowUpRight, TrendingUp } from 'lucide-react';
import type * as React from 'react';
import { Area, AreaChart, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/atoms/card';
import { type ChartConfig, ChartContainer } from '@/components/atoms/chart';
import { cn } from '@/utils/classname';

export interface EvaluationTrendPoint {
  session: string;
  score: number;
}

export interface EvaluationTrendChartCardProps {
  trendStatusLabel?: string;
  data?: EvaluationTrendPoint[];
  periodText?: string;
  cumulativeGrowthText?: string;
  className?: string;
}

const DEFAULT_TREND_DATA: EvaluationTrendPoint[] = [
  { session: 'Eval 1', score: 68 },
  { session: 'Eval 2', score: 74 },
  { session: 'Eval 3', score: 78 },
  { session: 'Eval 4', score: 82 },
];

const chartConfig = {
  score: {
    label: 'Skor Evaluasi',
    color: '#1A4D5C',
  },
} satisfies ChartConfig;

export function EvaluationTrendChartCard({
  trendStatusLabel = 'Positif Berkelanjutan',
  data = DEFAULT_TREND_DATA,
  periodText = 'Evaluasi 1 s.d. 4',
  cumulativeGrowthText = '+14 Poin Kumulatif',
  className,
}: EvaluationTrendChartCardProps) {
  return (
    <Card
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full transition-all duration-200 hover:shadow-md hover:border-slate-300/80',
        className
      )}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <TrendingUp className="size-4.5" />
            </div>
            <h2 className="font-bold text-slate-800 text-sm sm:text-base">Tren Performa</h2>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="size-3.5 stroke-[2.5]" />
            {trendStatusLabel}
          </span>
        </div>

        {/* Chart Area */}
        <div className="pt-2 pb-1 h-28 sm:h-32 w-full">
          <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
            <AreaChart data={data} margin={{ top: 18, right: 14, left: 14, bottom: 4 }}>
              <defs>
                <linearGradient id="scoreTrendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A4D5C" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1A4D5C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="session" hide />
              <YAxis domain={['dataMin - 8', 'dataMax + 8']} hide />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#1A4D5C"
                strokeWidth={2.5}
                fill="url(#scoreTrendGradient)"
                dot={{
                  fill: '#1A4D5C',
                  stroke: '#FFFFFF',
                  strokeWidth: 2,
                  r: 4.5,
                }}
                activeDot={{
                  fill: '#0f313b',
                  stroke: '#FFFFFF',
                  strokeWidth: 2,
                  r: 6,
                }}
              >
                <LabelList
                  dataKey="score"
                  position="top"
                  offset={8}
                  className="fill-slate-600 font-bold text-[10px]"
                />
              </Area>
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-100 pt-3.5 mt-2 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-normal truncate mr-2">{periodText}</span>
        <span className="font-bold text-slate-900 text-xs sm:text-sm shrink-0">
          {cumulativeGrowthText}
        </span>
      </div>
    </Card>
  );
}
