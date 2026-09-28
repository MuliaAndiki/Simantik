'use client';

import { TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CardSkeleton } from '@/components/atoms/loading';
import type { StudentGrowthPoint } from '@/types/service';
import { cn } from '@/utils/classname';

export type GrowthTimeframe = '7d' | '30d' | '6m' | '1y';

export interface AdminDashboardGrowthChartProps {
  data?: StudentGrowthPoint[];
  averageGrowthText?: string;
  timeframe?: GrowthTimeframe;
  isLoading?: boolean;
  onTimeframeChange?: (tf: GrowthTimeframe) => void;
  className?: string;
}

export const AdminDashboardGrowthChart: React.FC<AdminDashboardGrowthChartProps> = ({
  data = [],
  averageGrowthText,
  timeframe = '6m',
  isLoading,
  onTimeframeChange,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<GrowthTimeframe>(timeframe);
  const [activePoint, setActivePoint] = useState<string | null>(null);

  if (isLoading) return <CardSkeleton lines={5} className={className} />;

  const timeframes: { id: GrowthTimeframe; label: string }[] = [
    { id: '7d', label: '7 Hari' },
    { id: '30d', label: '30 Hari' },
    { id: '6m', label: '6 Bulan' },
    { id: '1y', label: '1 Tahun' },
  ];

  const handleTabChange = (tf: GrowthTimeframe) => {
    setActiveTab(tf);
    if (onTimeframeChange) {
      onTimeframeChange(tf);
    }
  };

  const chartData = data || [];
  const latestPoint = chartData[chartData.length - 1];

  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 select-none space-y-6',
        className
      )}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Pertumbuhan Siswa</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Jumlah siswa yang terdaftar dari waktu ke waktu.
          </p>
        </div>

        {/* Growth Rate Pill */}
        {averageGrowthText && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-bold self-start md:self-auto">
            <TrendingUp className="size-3.5 text-emerald-600" />
            <span>{averageGrowthText}</span>
          </div>
        )}

        {/* Timeframe Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl self-start md:self-auto">
          {timeframes.map((tf) => {
            const isActive = activeTab === tf.id;
            return (
              <button
                key={tf.id}
                type="button"
                onClick={() => handleTabChange(tf.id)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                )}
              >
                {tf.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recharts Line Chart */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 30, right: 30, left: -10, bottom: 10 }}
            onMouseMove={(state) => {
              if (state.activeLabel) {
                setActivePoint(String(state.activeLabel));
              }
            }}
            onMouseLeave={() => setActivePoint(null)}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={({ x, y, payload }) => {
                const isSelected = payload.value === (activePoint || latestPoint?.period);
                return (
                  <text
                    x={x}
                    y={Number(y) + 16}
                    textAnchor="middle"
                    fill={isSelected ? '#0f172a' : '#64748b'}
                    fontSize={12}
                    fontWeight={isSelected ? 'bold' : '500'}
                  >
                    {payload.value}
                  </text>
                );
              }}
            />
            <YAxis
              domain={[900, 1300]}
              ticks={[900, 1000, 1100, 1200, 1300]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: '500' }}
              tickFormatter={(v) => v.toLocaleString('id-ID')}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload?.length) {
                  const val = payload[0].value;
                  const formattedVal =
                    typeof val === 'number' ? val.toLocaleString('id-ID') : String(val);
                  return (
                    <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2">
                      <span className="size-2 rounded-full bg-amber-400 shrink-0" />
                      <span>
                        <strong className="font-bold">{label}</strong> — {formattedVal} siswa
                        terdaftar
                      </span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              x={activePoint || latestPoint?.period}
              stroke="#0f766e"
              strokeDasharray="3 3"
              strokeWidth={1.5}
            />
            <Line
              type="monotone"
              dataKey="students"
              stroke="#0f766e"
              strokeWidth={3}
              dot={{
                r: 4.5,
                fill: '#ffffff',
                stroke: '#0f766e',
                strokeWidth: 2.5,
              }}
              activeDot={{
                r: 6.5,
                fill: '#0f766e',
                stroke: '#ffffff',
                strokeWidth: 2.5,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboardGrowthChart;
