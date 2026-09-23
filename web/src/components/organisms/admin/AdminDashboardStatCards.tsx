import { Award, School, Trophy, Users } from 'lucide-react';
import React from 'react';
import { cn } from '@/utils/classname';

export interface AdminDashboardStatCardsProps {
  totalStudents: number;
  totalSchools: number;
  totalTryouts: number;
  totalQuestions: number;
  completedAttempts: number;
  averageScore: number;
  isLoading?: boolean;
  className?: string;
}

export const AdminDashboardStatCards: React.FC<AdminDashboardStatCardsProps> = ({
  totalStudents,
  totalSchools,
  totalTryouts,
  totalQuestions,
  completedAttempts,
  averageScore,
  isLoading = false,
  className,
}) => {
  return (
    <section className={cn('w-full space-y-3.5 select-none', className)}>
      <div className="flex items-center gap-2">
        <span className="h-3.5 w-1 rounded-full bg-teal-600 shrink-0" aria-hidden="true" />
        <h2 className="text-xs font-black text-slate-700 tracking-wider uppercase">
          Metrik Utama Platform
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: TOTAL SISWA */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Siswa Terdaftar
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {isLoading ? '...' : totalStudents}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Akun siswa SMA / SMK terdaftar
            </p>
          </div>
        </div>

        {/* Card 2: SEKOLAH MITRA */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Sekolah Terdaftar
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
              <School className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {isLoading ? '...' : totalSchools}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">Data resmi NPSN terverifikasi</p>
          </div>
        </div>

        {/* Card 3: PAKET TRYOUT & BANK SOAL */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Paket Tryout & Soal
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {isLoading ? '...' : totalTryouts}{' '}
              <span className="text-sm font-semibold text-slate-500">paket</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {totalQuestions} butir soal adaptif C1–C5
            </p>
          </div>
        </div>

        {/* Card 4: AKTIVITAS UJIAN */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Sesi Ujian Selesai
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {isLoading ? '...' : completedAttempts}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Rata-rata skor: {averageScore > 0 ? averageScore.toFixed(1) : '-'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardStatCards;
