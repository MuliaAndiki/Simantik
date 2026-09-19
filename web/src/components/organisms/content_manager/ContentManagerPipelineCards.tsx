import { BookOpen, FileQuestion } from 'lucide-react';
import React from 'react';
import type { DistribusiBankSoalData, PipelineMateriData } from '@/types/ui';
import { cn } from '@/utils/classname';

const DEFAULT_MATERI_PIPELINE: PipelineMateriData = {
  total: 36,
  siapDigunakanPercentage: 85.7,
  draftCount: 6,
  publishedCount: 24,
  archivedCount: 2,
};

const DEFAULT_BANK_SOAL_DISTRIBUSI: DistribusiBankSoalData = {
  total: 30,
  aktifPercentage: 83.3,
  draftCount: 7,
  publishedCount: 20,
  unpublishedCount: 3,
};

export interface ContentManagerPipelineCardsProps {
  materiPipeline?: PipelineMateriData;
  bankSoalDistribusi?: DistribusiBankSoalData;
  materi?: PipelineMateriData;
  bankSoal?: DistribusiBankSoalData;
  className?: string;
}

export const ContentManagerPipelineCards: React.FC<ContentManagerPipelineCardsProps> = ({
  materiPipeline,
  bankSoalDistribusi,
  materi,
  bankSoal,
  className,
}) => {
  const activeMateri = materi ?? materiPipeline ?? DEFAULT_MATERI_PIPELINE;
  const activeBankSoal = bankSoal ?? bankSoalDistribusi ?? DEFAULT_BANK_SOAL_DISTRIBUSI;

  // Safe percentage calculations for Materi
  const totalMateri = Math.max(1, activeMateri.total);
  const materiDraftPct = (activeMateri.draftCount / totalMateri) * 100;
  const materiPubPct = (activeMateri.publishedCount / totalMateri) * 100;
  const materiArchPct = (activeMateri.archivedCount / totalMateri) * 100;

  // Safe percentage calculations for Bank Soal
  const totalBankSoal = Math.max(1, activeBankSoal.total);
  const bankDraftPct = (activeBankSoal.draftCount / totalBankSoal) * 100;
  const bankPubPct = (activeBankSoal.publishedCount / totalBankSoal) * 100;
  const bankUnpubPct = (activeBankSoal.unpublishedCount / totalBankSoal) * 100;

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 select-none', className)}>
      {/* 1. Status Pipeline Materi Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-2xs flex flex-col justify-between gap-6">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Status Pipeline Materi
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {activeMateri.total} Total Materi Kurikulum
                </span>
              </div>
            </div>

            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#EAF6F8] border border-cyan-200 text-teal-800 text-xs font-bold shrink-0">
              {activeMateri.siapDigunakanPercentage}% Siap Digunakan
            </span>
          </div>

          {/* Multi-segment Progress Bar */}
          <div className="mt-5">
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
              <div
                style={{ width: `${materiDraftPct}%` }}
                className="h-full bg-cyan-400 transition-all duration-500"
                title={`Draft: ${activeMateri.draftCount}`}
              />
              <div
                style={{ width: `${materiPubPct}%` }}
                className="h-full bg-teal-600 transition-all duration-500"
                title={`Published: ${activeMateri.publishedCount}`}
              />
              <div
                style={{ width: `${materiArchPct}%` }}
                className="h-full bg-rose-600 transition-all duration-500"
                title={`Archived: ${activeMateri.archivedCount}`}
              />
            </div>

            {/* Labels below bar */}
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 mt-1.5 px-0.5">
              <span>{activeMateri.draftCount}</span>
              <span>{activeMateri.publishedCount}</span>
              <span>{activeMateri.archivedCount}</span>
            </div>
          </div>
        </div>

        {/* 3 Metric Mini Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-cyan-50/40 border border-cyan-100 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Draft
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 block mt-0.5">
              {activeMateri.draftCount}{' '}
              <span className="text-xs font-medium text-slate-500">item</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              Tahap penulisan
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#EAF6F8]/80 border border-cyan-200 text-left">
            <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
              Published
            </span>
            <span className="text-base sm:text-lg font-black text-teal-950 block mt-0.5">
              {activeMateri.publishedCount}{' '}
              <span className="text-xs font-semibold text-teal-700">aktif</span>
            </span>
            <span className="text-[10px] text-teal-700 font-medium block mt-0.5">
              Akses terbuka
            </span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-left">
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
              Archived
            </span>
            <span className="text-base sm:text-lg font-black text-rose-950 block mt-0.5">
              {activeMateri.archivedCount}{' '}
              <span className="text-xs font-medium text-rose-600">arsip</span>
            </span>
            <span className="text-[10px] text-rose-600 font-medium block mt-0.5">
              Kurikulum lama
            </span>
          </div>
        </div>
      </div>

      {/* 2. Distribusi Bank Soal Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-2xs flex flex-col justify-between gap-6">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100 flex items-center justify-center shrink-0">
                <FileQuestion className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Distribusi Bank Soal
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {activeBankSoal.total} Paket Soal
                </span>
              </div>
            </div>

            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FEF9C3] border border-amber-200 text-amber-800 text-xs font-bold shrink-0">
              {activeBankSoal.aktifPercentage}% Aktif
            </span>
          </div>

          {/* Multi-segment Progress Bar */}
          <div className="mt-5">
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
              <div
                style={{ width: `${bankDraftPct}%` }}
                className="h-full bg-[#D4A373] transition-all duration-500"
                title={`Draft: ${activeBankSoal.draftCount}`}
              />
              <div
                style={{ width: `${bankPubPct}%` }}
                className="h-full bg-teal-600 transition-all duration-500"
                title={`Published: ${activeBankSoal.publishedCount}`}
              />
              <div
                style={{ width: `${bankUnpubPct}%` }}
                className="h-full bg-slate-600 transition-all duration-500"
                title={`Unpublished: ${activeBankSoal.unpublishedCount}`}
              />
            </div>

            {/* Labels below bar */}
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 mt-1.5 px-0.5">
              <span>{activeBankSoal.draftCount}</span>
              <span>{activeBankSoal.publishedCount}</span>
              <span>{activeBankSoal.unpublishedCount}</span>
            </div>
          </div>
        </div>

        {/* 3 Metric Mini Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373]" />
              Draft
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 block mt-0.5">
              {activeBankSoal.draftCount}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              Belum divalidasi
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#EAF6F8]/80 border border-cyan-200 text-left">
            <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              Published
            </span>
            <span className="text-base sm:text-lg font-black text-teal-950 block mt-0.5">
              {activeBankSoal.publishedCount}
            </span>
            <span className="text-[10px] text-teal-700 font-medium block mt-0.5">
              Siap dalam pool
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              Unpublished
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 block mt-0.5">
              {activeBankSoal.unpublishedCount}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              Ditarik / Revisi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagerPipelineCards;
