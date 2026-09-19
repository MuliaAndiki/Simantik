import { BadgeCheck, EyeOff, FileEdit, Layers } from 'lucide-react';
import type React from 'react';
import type { PracticeStats } from '@/types/ui/practice-manager.types';

export interface PracticeStatCardsProps {
  stats: PracticeStats;
}

export const PracticeStatCards: React.FC<PracticeStatCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. Total Paket */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Paket
          </p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{stats.totalPackages}</p>
          <p className="text-xs font-medium text-slate-500">Semua kategori TKA</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#EAF6F8] text-[#0E7490] flex items-center justify-center shrink-0">
          <Layers className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Draft */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Draft</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{stats.draftCount}</p>
          <p className="text-xs font-medium text-slate-500">Dalam tahap kurasi</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#FEF6E8] text-[#F5B731] flex items-center justify-center shrink-0">
          <FileEdit className="w-6 h-6" />
        </div>
      </div>

      {/* 3. Published */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Published</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">
            {stats.publishedCount}
          </p>
          <p className="text-xs font-medium text-slate-500">Aktif diakses siswa</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8F8F3] text-[#10B981] flex items-center justify-center shrink-0">
          <BadgeCheck className="w-6 h-6" />
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
          <p className="text-xs font-medium text-slate-500">Nonaktif sementara</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#F1F5F9] text-[#64748B] flex items-center justify-center shrink-0">
          <EyeOff className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default PracticeStatCards;
