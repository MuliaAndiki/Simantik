import { Archive, Calendar, CheckCircle2, Edit3 } from 'lucide-react';
import React from 'react';
import type { NewsStats } from '@/types/ui/content-manager';

interface NewsSummaryCardsProps {
  stats: NewsStats;
}

export const NewsSummaryCards: React.FC<NewsSummaryCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center justify-between shadow-2xs">
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Artikel
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-800">{stats.total}</h3>
            {stats.totalChange && (
              <span className="text-[11px] font-semibold text-cyan-600">{stats.totalChange}</span>
            )}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#F4FBFA] flex items-center justify-center text-cyan-600">
          <Calendar className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center justify-between shadow-2xs">
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Published</p>
          <h3 className="text-2xl font-bold text-slate-800">{stats.published}</h3>
          <p className="text-[11px] font-medium text-slate-500">Aktif di Portal Siswa</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#E8F8F3] flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center justify-between shadow-2xs">
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Draft</p>
          <h3 className="text-2xl font-bold text-slate-800">{stats.draft}</h3>
          <p className="text-[11px] font-medium text-slate-500">Tahap Penulisan</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#FEF7EB] flex items-center justify-center text-amber-500">
          <Edit3 className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center justify-between shadow-2xs">
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Unpublished
          </p>
          <h3 className="text-2xl font-bold text-slate-800">{stats.unpublished}</h3>
          <p className="text-[11px] font-medium text-rose-500">Diarsipkan / Kedaluwarsa</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
          <Archive className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
