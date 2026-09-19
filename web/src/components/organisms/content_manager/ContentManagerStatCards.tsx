import { BookOpen, FileCheck, FileEdit, FileQuestion, Globe, Plus } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/atoms';
import type { ContentManagerKpiStats } from '@/types/ui';
import { cn } from '@/utils/classname';

const DEFAULT_STATS: ContentManagerKpiStats = {
  totalMateri: 36,
  materiSubtitle: 'Materi dari sekolah terdaftar',
  paketBankSoal: 30,
  bankSoalSubtitle: 'Soal yang tersedia aktif',
  totalPaketTryout: 12,
  tryoutSubtitle: 'Tryout yang siap dikerjakan',
  kontenPublik: 24,
  kontenPublikSubtitle: 'News, docs, review & video',
};

export interface ContentManagerStatCardsProps {
  stats?: ContentManagerKpiStats;
  onAddMaterial?: () => void;
  onAddQuestion?: () => void;
  onCreateTryout?: () => void;
  onAddNews?: () => void;
  className?: string;
}

export const ContentManagerStatCards: React.FC<ContentManagerStatCardsProps> = ({
  stats = DEFAULT_STATS,
  onAddMaterial,
  onAddQuestion,
  onCreateTryout,
  onAddNews,
  className,
}) => {
  return (
    <section className={cn('w-full space-y-3.5 select-none', className)}>
      {/* Section Header with Teal Bar */}
      <div className="flex items-center gap-2">
        <span className="h-3.5 w-1 rounded-full bg-teal-600 shrink-0" aria-hidden="true" />
        <h2 className="text-xs font-black text-slate-700 tracking-wider uppercase">
          Ringkasan Platform
        </h2>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: TOTAL MATERI */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Materi
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalMateri}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {stats.materiSubtitle || 'Materi dari sekolah terdaftar'}
            </p>
          </div>

          <Button
            type="button"
            onClick={onAddMaterial}
            className="w-full h-9 rounded-xl font-black text-xs bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 shadow-2xs flex items-center justify-center gap-1.5 border-0 cursor-pointer transition-transform active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
            <span>Tambah Materi</span>
          </Button>
        </div>

        {/* Card 2: PAKET BANK SOAL */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Paket Bank Soal
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100 flex items-center justify-center shrink-0">
              <FileQuestion className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.paketBankSoal}{' '}
              <span className="text-sm font-semibold text-slate-500">paket</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {stats.bankSoalSubtitle || 'Soal yang tersedia aktif'}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onAddQuestion}
            className="w-full h-9 rounded-xl font-bold text-xs bg-[#EAF6F8] hover:bg-cyan-100/70 border border-cyan-200 text-teal-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <FileEdit className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Tambah Soal</span>
          </Button>
        </div>

        {/* Card 3: TOTAL PAKET TRYOUT */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Paket Tryout
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
              <FileCheck className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalPaketTryout}{' '}
              <span className="text-sm font-semibold text-slate-500">paket</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {stats.tryoutSubtitle || 'Tryout yang siap dikerjakan'}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onCreateTryout}
            className="w-full h-9 rounded-xl font-bold text-xs bg-[#EAF6F8] hover:bg-cyan-100/70 border border-cyan-200 text-teal-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <FileEdit className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Buat Tryout</span>
          </Button>
        </div>

        {/* Card 4: KONTEN PUBLIK */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Konten Publik
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.kontenPublik}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {stats.kontenPublikSubtitle || 'News, docs, review & video'}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onAddNews}
            className="w-full h-9 rounded-xl font-bold text-xs bg-[#EAF6F8] hover:bg-cyan-100/70 border border-cyan-200 text-teal-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Tambah News</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContentManagerStatCards;
