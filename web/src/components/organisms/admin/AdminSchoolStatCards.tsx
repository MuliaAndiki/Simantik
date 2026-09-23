import React from 'react';
import { cn } from '@/utils/classname';

export interface AdminSchoolStatCardsProps {
  total: number;
  negeri: number;
  swasta: number;
  smaCount: number;
  smkCount: number;
  className?: string;
}

export const AdminSchoolStatCards: React.FC<AdminSchoolStatCardsProps> = ({
  total,
  negeri,
  swasta,
  smaCount,
  smkCount,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5', className)}>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Total Terdaftar
        </span>
        <div className="text-3xl font-black text-slate-900 tracking-tight mt-1">{total}</div>
        <p className="text-xs text-slate-500 font-medium mt-1">Seluruh jenjang sekolah</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Sekolah Negeri
        </span>
        <div className="text-3xl font-black text-emerald-600 tracking-tight mt-1">{negeri}</div>
        <p className="text-xs text-slate-500 font-medium mt-1">Status kepemilikan negeri</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Sekolah Swasta
        </span>
        <div className="text-3xl font-black text-sky-600 tracking-tight mt-1">{swasta}</div>
        <p className="text-xs text-slate-500 font-medium mt-1">Status kepemilikan swasta</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          SMA / SMK
        </span>
        <div className="text-3xl font-black text-teal-700 tracking-tight mt-1">
          {smaCount} <span className="text-sm font-semibold text-slate-400">/ {smkCount}</span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1">Jenjang sekolah lanjutan</p>
      </div>
    </div>
  );
};

export default AdminSchoolStatCards;
