import React from 'react';
import { cn } from '@/utils/classname';

export interface AdminDashboardHeroProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const AdminDashboardHero: React.FC<AdminDashboardHeroProps> = ({
  title = 'Dashboard',
  subtitle,
  className,
}) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-baseline gap-2 select-none', className)}>
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
      <p className="text-xs sm:text-sm text-slate-500 font-medium">{subtitle}</p>
    </div>
  );
};

export default AdminDashboardHero;
