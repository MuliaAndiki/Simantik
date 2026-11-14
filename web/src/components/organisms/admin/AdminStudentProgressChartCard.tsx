'use client';

import { ArrowRight, BookOpen, LineChart, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '@/utils/classname';
import {
  buildProgressChartGeometry,
  DEFAULT_PROGRESS_CHART_DIMENSIONS,
  resolveActivePointIndex,
} from '@/utils/student-progress-chart.util';

export type TimeframePeriod = '7d' | '30d' | '3m' | '6m';

export interface ChartDataPoint {
  date: string;
  score: number;
  label?: string;
}

export interface AdminStudentProgressChartCardProps {
  timeframe?: TimeframePeriod;
  onTimeframeChange?: (tf: TimeframePeriod) => void;
  latestScore?: number;
  previousScore?: number;
  scoreDiff?: number;
  trendText?: string;
  latestPracticeTitle?: string;
  latestPracticeDate?: string;
  onViewLatestPracticeDetail?: () => void;
  chartData?: ChartDataPoint[];
  className?: string;
}

export const AdminStudentProgressChartCard: React.FC<AdminStudentProgressChartCardProps> = ({
  timeframe = '3m',
  onTimeframeChange,
  latestScore,
  previousScore,
  scoreDiff,
  trendText,
  latestPracticeTitle,
  latestPracticeDate,
  onViewLatestPracticeDetail,
  chartData = [],
  className,
}) => {
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(null);

  const timeframes: { id: TimeframePeriod; label: string }[] = [
    { id: '7d', label: '7 Hari' },
    { id: '30d', label: '30 Hari' },
    { id: '3m', label: '3 Bulan' },
    { id: '6m', label: '6 Bulan' },
  ];

  // SVG Chart Dimensions
  const { width, height, paddingX, paddingTop, paddingBottom } = DEFAULT_PROGRESS_CHART_DIMENSIONS;
  const graphHeight = height - paddingTop - paddingBottom;

  const { points, linePath, areaPath } = buildProgressChartGeometry(
    chartData,
    DEFAULT_PROGRESS_CHART_DIMENSIONS
  );
  const resolvedActiveIndex = resolveActivePointIndex(activeTooltipIndex, points.length);
  const activePoint = resolvedActiveIndex !== null ? points[resolvedActiveIndex] : undefined;

  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 space-y-6',
        className
      )}
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <LineChart className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Perkembangan Nilai Latihan
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Melihat perubahan nilai latihan siswa dari waktu ke waktu.
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center bg-slate-100/80 p-1 rounded-xl gap-1 shrink-0 self-start sm:self-auto">
          {timeframes.map((tf) => {
            const isActive = timeframe === tf.id;
            return (
              <button
                key={tf.id}
                type="button"
                onClick={() => onTimeframeChange?.(tf.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  isActive
                    ? 'bg-[#134653] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                )}
              >
                {tf.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 Stat Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Nilai Terakhir */}
        <div className="bg-[#f4fafd] rounded-xl p-4 border border-sky-50/70 space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Nilai Terakhir
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{latestScore ?? '—'}</span>
            <span className="text-xs text-slate-400 font-semibold">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Latihan terakhir</p>
        </div>

        {/* Nilai Sebelumnya */}
        <div className="bg-[#f4fafd] rounded-xl p-4 border border-sky-50/70 space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Nilai Sebelumnya
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{previousScore ?? '—'}</span>
            <span className="text-xs text-slate-400 font-semibold">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Latihan sebelumnya</p>
        </div>

        {/* Perubahan */}
        <div className="bg-[#f4fafd] rounded-xl p-4 border border-sky-50/70 space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Perubahan
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-slate-900">
              {scoreDiff !== undefined ? (scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff) : '—'}
            </span>
            {scoreDiff !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold',
                  scoreDiff > 0
                    ? 'bg-emerald-100 text-emerald-700'
                    : scoreDiff < 0
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-slate-100 text-slate-600'
                )}
              >
                {scoreDiff > 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3" />
                    Naik
                  </>
                ) : scoreDiff < 0 ? (
                  <>
                    <TrendingDown className="w-3 h-3" />
                    Turun
                  </>
                ) : (
                  <>
                    <Minus className="w-3 h-3" />
                    Tetap
                  </>
                )}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Dibandingkan sesi lalu</p>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="bg-[#f9fcfe] rounded-2xl border border-sky-50 p-4 sm:p-5 space-y-3 relative overflow-hidden">
        {/* Chart Subtitle */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Nilai Latihan
          </span>
          <span className="text-xs font-semibold text-slate-400">Skala 0 – 100</span>
        </div>

        {/* SVG Curve Canvas */}
        {points.length > 0 ? (
          <div className="w-full relative h-[180px]">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
              aria-label="Grafik Perkembangan Nilai Latihan"
            >
              <title>Grafik Perkembangan Nilai Latihan</title>
              <defs>
                <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#134653" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#134653" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              {[0, 20, 40, 60, 80, 100].map((val) => {
                const y = paddingTop + (1 - val / 100) * graphHeight;
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={width - paddingX}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 3}
                      fill="#94a3b8"
                      fontSize="9"
                      fontWeight="500"
                      textAnchor="end"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Area gradient */}
              {areaPath && <path d={areaPath} fill="url(#chartAreaGradient)" />}

              {/* Line Path */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#134653"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Points */}
              {points.map((p, idx) => {
                const isSelected = resolvedActiveIndex === idx;
                return (
                  <g
                    key={idx}
                    role="button"
                    tabIndex={0}
                    aria-label={`Nilai ${p.date}: ${p.score}`}
                    className="cursor-pointer focus:outline-none"
                    onClick={() => setActiveTooltipIndex(idx)}
                    onMouseEnter={() => setActiveTooltipIndex(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setActiveTooltipIndex(idx);
                      }
                    }}
                  >
                    {isSelected && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="9"
                        fill="#F5B731"
                        fillOpacity="0.3"
                        className="animate-pulse"
                      />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isSelected ? '5' : '3.5'}
                      fill={isSelected ? '#F5B731' : '#134653'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {points.map((p, idx) => (
                <text
                  key={idx}
                  x={p.x}
                  y={height - 8}
                  fill="#64748b"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {p.date}
                </text>
              ))}
            </svg>

            {/* Floating Tooltip if active */}
            {activePoint && (
              <div
                className="absolute pointer-events-none transition-all duration-200"
                style={{
                  left: `${(activePoint.x / width) * 100}%`,
                  top: `${(activePoint.y / height) * 100}%`,
                  transform: 'translate(-50%, -130%)',
                }}
              >
                <div className="bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg shadow-lg border border-slate-700 whitespace-nowrap">
                  <span>{activePoint.label || 'Sesi Latihan'}</span>
                  <span className="text-slate-400 mx-1">•</span>
                  <span className="text-[#F5B731] font-bold">{activePoint.date}</span>
                  <span className="text-slate-400 mx-1">|</span>
                  <span className="text-emerald-400 font-bold">Nilai: {activePoint.score}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[180px] flex items-center justify-center text-sm text-slate-400 font-medium">
            Belum ada data performa.
          </div>
        )}
      </div>

      {/* Summary Highlight Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>
            Perkembangan terakhir:{' '}
            {scoreDiff !== undefined
              ? `${scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff} poin dibandingkan latihan sebelumnya`
              : '—'}
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-50 text-teal-800 border border-cyan-100">
          <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
          <span>{trendText ?? '—'}</span>
        </div>
      </div>

      {/* Bottom Link Card */}
      <div className="w-full bg-[#f4fafd] rounded-xl p-3.5 border border-sky-100/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
          <div className="w-6 h-6 rounded-lg bg-teal-100/80 text-teal-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span className="line-clamp-1">
            <span className="font-bold text-slate-900">Latihan terakhir:</span>{' '}
            {latestPracticeTitle ?? '—'} • {latestPracticeDate ?? '—'} •{' '}
            <span className="font-bold text-teal-700">Nilai {latestScore ?? '—'}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onViewLatestPracticeDetail}
          className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors cursor-pointer shrink-0"
        >
          <span>Lihat Detail</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AdminStudentProgressChartCard;
