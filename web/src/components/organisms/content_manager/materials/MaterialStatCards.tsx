import { BookOpen, CheckCircle2, ClipboardCheck, FileEdit } from 'lucide-react';
import React from 'react';
import type { MaterialStats } from '@/types/ui/material-manager.types';

interface MaterialStatCardsProps {
  stats: MaterialStats;
}

export const MaterialStatCards: React.FC<MaterialStatCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. Total Materi */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Materi
          </p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">
            {stats.totalMaterials}
          </p>
          <p className="text-xs font-medium text-slate-500">Semua unit terdaftar</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#EAF6F8] text-[#0E7490] flex items-center justify-center shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Draft */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Draft</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{stats.draftCount}</p>
          <p className="text-xs font-medium text-slate-500">Tahap penyusunan</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#FEF6E8] text-[#F5B731] flex items-center justify-center shrink-0">
          <FileEdit className="w-6 h-6" />
        </div>
      </div>

      {/* 3. Review */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Review</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{stats.reviewCount}</p>
          <p className="text-xs font-medium text-slate-500">Menunggu verifikasi</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#EBF7FB] text-[#0284C7] flex items-center justify-center shrink-0">
          <ClipboardCheck className="w-6 h-6" />
        </div>
      </div>

      {/* 4. Published */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Published</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">
            {stats.publishedCount}
          </p>
          <p className="text-xs font-medium text-slate-500">Aktif dipelajari siswa</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8F8F3] text-[#10B981] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
