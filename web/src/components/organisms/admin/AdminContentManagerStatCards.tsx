import React from 'react';
import { cn } from '@/utils/classname';

export interface AdminContentManagerStatCardsProps {
  total: number;
  active: number;
  suspended: number;
  className?: string;
}

export const AdminContentManagerStatCards: React.FC<AdminContentManagerStatCardsProps> = ({
  total,
  active,
  suspended,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5', className)}>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Total Content Manager
        </span>
        <div className="text-3xl font-black text-slate-900 tracking-tight mt-1">{total}</div>
        <p className="text-xs text-slate-500 font-medium mt-1">Kurator kurikulum terdaftar</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Status Aktif
        </span>
        <div className="text-3xl font-black text-emerald-600 tracking-tight mt-1">{active}</div>
        <p className="text-xs text-slate-500 font-medium mt-1">Hak akses kurasi konten</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Ditangguhkan
        </span>
        <div className="text-3xl font-black text-rose-600 tracking-tight mt-1">{suspended}</div>
        <p className="text-xs text-slate-500 font-medium mt-1">Hak akses dinonaktifkan</p>
      </div>
    </div>
  );
};

export default AdminContentManagerStatCards;
