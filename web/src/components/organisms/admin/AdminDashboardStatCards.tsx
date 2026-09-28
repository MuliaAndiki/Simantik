import { BookOpen, CheckSquare, ClipboardCheck, UserCheck, Users } from 'lucide-react';
import React from 'react';
import { CardSkeleton } from '@/components/atoms/loading';
import { cn } from '@/utils/classname';

export interface AdminDashboardStatCardsProps {
  totalStudents?: number;
  activeStudents?: number;
  activeStudentsPercent?: number;
  studentGrowthRate?: string;
  totalMaterials?: number;
  totalPracticePackages?: number;
  totalTryouts?: number;
  completedTryouts?: number;
  liveTryouts?: number;
  isLoading?: boolean;
  className?: string;
}

export const AdminDashboardStatCards: React.FC<AdminDashboardStatCardsProps> = ({
  totalStudents,
  activeStudents,
  activeStudentsPercent,
  studentGrowthRate,
  totalMaterials,
  totalPracticePackages,
  totalTryouts,
  completedTryouts,
  liveTryouts,
  isLoading = false,
  className,
}) => {
  if (isLoading) {
    return (
      <section className={cn('w-full select-none', className)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={`admin-stat-skeleton-${i}`} lines={2} />
          ))}
        </div>
      </section>
    );
  }

  const displayTotalStudents = totalStudents ?? 0;
  const displayActiveStudents = activeStudents ?? 0;
  const activePercentText =
    activeStudentsPercent !== undefined ? `${Math.round(activeStudentsPercent)}% Aktif` : '—';

  const displayTotalMaterials = totalMaterials ?? 0;
  const displayTotalPackages = totalPracticePackages ?? 0;
  const displayTotalTryouts = totalTryouts ?? 0;
  const displayCompletedTryouts = completedTryouts ?? 0;
  const displayLiveTryouts = liveTryouts ?? 0;

  const stats = [
    {
      id: 'total-students',
      label: 'Total Siswa',
      value: displayTotalStudents.toLocaleString('id-ID'),
      icon: Users,
      iconBg: 'bg-teal-50 text-teal-600 border-teal-100',
      badgeText: studentGrowthRate ?? '—',
      badgeBg: 'bg-emerald-50 text-emerald-700',
      footerLeft: 'Terdaftar di sistem',
      footerRight: '100%',
      footerRightClass: 'font-bold text-slate-900',
    },
    {
      id: 'active-students',
      label: 'Siswa Aktif',
      value: displayActiveStudents.toLocaleString('id-ID'),
      icon: UserCheck,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
      badgeText: activePercentText,
      badgeBg: 'bg-sky-50 text-sky-700',
      footerLeft: 'Rasio Keaktifan',
      footerRight: 'Tinggi',
      footerRightClass: 'font-bold text-emerald-600',
    },
    {
      id: 'total-materials',
      label: 'Total Materi',
      value: displayTotalMaterials.toLocaleString('id-ID'),
      icon: BookOpen,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      badgeText: '+2 baru',
      badgeBg: 'bg-amber-50 text-amber-700',
      footerLeft: 'TKA Bahasa Indonesia',
      footerRight: '12 Bab',
      footerRightClass: 'font-bold text-slate-900',
    },
    {
      id: 'total-packages',
      label: 'Total Paket Latihan',
      value: displayTotalPackages.toLocaleString('id-ID'),
      icon: ClipboardCheck,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badgeText: 'Aktif',
      badgeBg: 'bg-emerald-50 text-emerald-700',
      footerLeft: 'Rata-rata 25 soal',
      footerRight: 'Tersedia',
      footerRightClass: 'font-bold text-slate-900',
    },
    {
      id: 'total-tryouts',
      label: 'Total Tryout',
      value: displayTotalTryouts.toLocaleString('id-ID'),
      icon: CheckSquare,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      badgeText: 'Nasional',
      badgeBg: 'bg-purple-50 text-purple-700',
      footerLeft: `${displayCompletedTryouts} Terlaksana`,
      footerRight: `${displayLiveTryouts} Live`,
      footerRightClass: 'font-bold text-amber-600',
    },
  ];

  return (
    <section className={cn('w-full select-none', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between gap-3"
            >
              {/* Header: Icon & Badge */}
              <div className="flex items-start justify-between gap-2">
                <div
                  className={cn(
                    'size-9 rounded-xl border flex items-center justify-center shrink-0',
                    stat.iconBg
                  )}
                >
                  <Icon className="size-4.5" />
                </div>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[11px] font-bold tracking-tight',
                    stat.badgeBg
                  )}
                >
                  {stat.badgeText}
                </span>
              </div>

              {/* Body: Metric Number & Label */}
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {isLoading ? '...' : stat.value}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
              </div>

              {/* Footer: Sub-metrics */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                <span className="text-slate-500 text-[11px] truncate">{stat.footerLeft}</span>
                <span className={cn('text-[11px] shrink-0', stat.footerRightClass)}>
                  {stat.footerRight}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AdminDashboardStatCards;
