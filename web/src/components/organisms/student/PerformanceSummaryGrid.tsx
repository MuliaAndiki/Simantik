import { CheckCircle2, FileText, ShieldCheck, Trophy } from 'lucide-react';
import type * as React from 'react';
import { CardSkeleton } from '@/components/atoms/loading';
import { DashboardSectionHeader } from '@/components/molecules/student/DashboardSectionHeader';
import { PerformanceStatCard } from '@/components/molecules/student/PerformanceStatCard';
import { cn } from '@/utils/classname';

export interface PerformanceSummaryGridProps {
  lastTopic?: string;
  lastPackageName?: string;
  lastScore?: number;
  averageComparisonText?: string;
  totalSessions?: number;
  averageCorrectPerSession?: number;
  achievementStatus?: string;
  achievementSubtext?: string;
  isLoading?: boolean;
  onViewHistory?: () => void;
  historyHref?: string;
  className?: string;
}

export function PerformanceSummaryGrid({
  lastTopic,
  lastPackageName,
  lastScore,
  averageComparisonText,
  totalSessions,
  averageCorrectPerSession,
  achievementStatus,
  achievementSubtext,
  isLoading,
  onViewHistory,
  historyHref = '/student/evaluation',
  className,
}: PerformanceSummaryGridProps) {
  if (isLoading) {
    return (
      <section className={cn('space-y-4', className)}>
        <DashboardSectionHeader
          title="Ringkasan Performa"
          subtitle="Aktivitas pengerjaan latihan mandiri yang baru kamu selesaikan"
          actionText="Riwayat Latihan"
          actionHref={historyHref}
          onAction={onViewHistory}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={`performance-skeleton-${i}`} lines={2} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={cn('space-y-4', className)}>
      <DashboardSectionHeader
        title="Ringkasan Performa"
        subtitle="Aktivitas pengerjaan latihan mandiri yang baru kamu selesaikan"
        actionText="Riwayat Latihan"
        actionHref={historyHref}
        onAction={onViewHistory}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <PerformanceStatCard
          label="Latihan Terakhir"
          icon={FileText}
          iconBgColor="bg-[#E0F7FA]"
          iconColor="text-[#0284c7]"
          value={<span className="line-clamp-1">{lastTopic ?? '—'}</span>}
          subtext={lastPackageName}
        />

        <PerformanceStatCard
          label="Nilai Latihan"
          icon={Trophy}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          value={
            <div className="flex items-baseline gap-1">
              <span className="text-xl md:text-2xl font-black text-[#111827]">
                {lastScore ?? '—'}
              </span>
              <span className="text-xs font-semibold text-[#546A72]">/ 100</span>
            </div>
          }
          badge={
            averageComparisonText
              ? {
                  text: averageComparisonText,
                  variant: 'success',
                }
              : undefined
          }
        />

        <PerformanceStatCard
          label="Latihan Dikerjakan"
          icon={CheckCircle2}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          value={`${totalSessions ?? '—'} sesi latihan`}
          subtext={
            averageCorrectPerSession !== undefined
              ? `rata-rata benar ${averageCorrectPerSession} soal/latihan`
              : undefined
          }
        />

        <PerformanceStatCard
          label="Status Capaian"
          icon={ShieldCheck}
          iconBgColor="bg-[#E0F7FA]"
          iconColor="text-[#0d9488]"
          value={
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200/60">
              ✓ {achievementStatus ?? '—'}
            </span>
          }
          subtext={achievementSubtext}
        />
      </div>
    </section>
  );
}
