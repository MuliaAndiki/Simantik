import { CalendarClock, EyeOff, FileCheck2, ShieldCheck } from 'lucide-react';
import type React from 'react';
import type { TryoutStats } from '@/types/ui/tryout-manager.types';

export interface TryoutStatCardsProps {
  stats: TryoutStats;
}

export const TryoutStatCards: React.FC<TryoutStatCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. Total Paket */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Paket
          </p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{stats.totalTryouts}</p>
          <p className="text-xs font-medium text-slate-500">Semua paket simulasi</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#EAF6F8] text-[#0E7490] flex items-center justify-center shrink-0">
          <FileCheck2 className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Draft */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Draft</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{stats.draftCount}</p>
          <p className="text-xs font-medium text-slate-500">Konfigurasi naskah</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#FEF6E8] text-[#F5B731] flex items-center justify-center shrink-0">
          <CalendarClock className="w-6 h-6" />
        </div>
      </div>

      {/* 3. Published */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Published</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">
            {stats.publishedCount}
          </p>
          <p className="text-xs font-medium text-slate-500">Aktif di portal siswa</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8F8F3] text-[#10B981] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
      </div>

      {/* 4. Unpublished */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Unpublished
          </p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">
            {stats.unpublishedCount}
          </p>
          <p className="text-xs font-medium text-slate-500">Akses ditutup sementara</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#F1F5F9] text-[#64748B] flex items-center justify-center shrink-0">
          <EyeOff className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default TryoutStatCards;
