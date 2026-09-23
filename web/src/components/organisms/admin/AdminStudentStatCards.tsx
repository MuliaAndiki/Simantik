import React from 'react';
import { cn } from '@/utils/classname';

export interface AdminStudentStatCardsProps {
  total: number;
  active: number;
  suspended: number;
  totalAttempts: number;
  className?: string;
}

export const AdminStudentStatCards: React.FC<AdminStudentStatCardsProps> = ({
  total,
  active,
  suspended,
  totalAttempts,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5', className)}>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Total Siswa
        </span>
        <div className="text-3xl font-black text-slate-900 tracking-tight mt-1">{total}</div>
        <p className="text-xs text-slate-500 font-medium mt-1">Akun siswa terdaftar</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Status Aktif
        </span>
        <div className="text-3xl font-black text-emerald-600 tracking-tight mt-1">{active}</div>
        <p className="text-xs text-slate-500 font-medium mt-1">Dapat mengikuti ujian</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Ditangguhkan
        </span>
        <div className="text-3xl font-black text-rose-600 tracking-tight mt-1">{suspended}</div>
        <p className="text-xs text-slate-500 font-medium mt-1">Akses akun dibatasi</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Total Sesi Ujian
        </span>
        <div className="text-3xl font-black text-teal-700 tracking-tight mt-1">{totalAttempts}</div>
        <p className="text-xs text-slate-500 font-medium mt-1">Sesi tryout & latihan</p>
      </div>
    </div>
  );
};

export default AdminStudentStatCards;
