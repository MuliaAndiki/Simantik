import React from 'react';
import { cn } from '@/utils/classname';

export interface AdminDashboardHeroProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const AdminDashboardHero: React.FC<AdminDashboardHeroProps> = ({
  title = 'Pusat Kendali Administrator SIMANTIK',
  subtitle = 'Pantau statistik pengerjaan tryout siswa, kelola master data sekolah, dan awasi distribusi materi kurikulum merdeka secara realtime.',
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-6 md:p-8',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="h-3.5 w-1 rounded-full bg-teal-600 shrink-0" aria-hidden="true" />
        <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
          Super Admin Portal
        </span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
      <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed max-w-3xl">
        {subtitle}
      </p>
    </div>
  );
};

export default AdminDashboardHero;
