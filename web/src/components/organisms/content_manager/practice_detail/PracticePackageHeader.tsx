import { ArrowLeft, Edit3, EyeOff, UploadCloud } from 'lucide-react';
import React from 'react';
import type { PracticePackageResultsResponse } from '@/types/service';

export interface PracticePackageHeaderProps {
  packageData: PracticePackageResultsResponse | null;
  onBack: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  isTogglingStatus?: boolean;
}

export const PracticePackageHeader: React.FC<PracticePackageHeaderProps> = ({
  packageData,
  onBack,
  onEdit,
  onToggleStatus,
  isTogglingStatus = false,
}) => {
  const isPublished = (packageData?.status || 'draft').toLowerCase() === 'published';

  return (
    <div className="space-y-4">
      {/* Top Bar with Back and Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Kembali ke Paket Latihan</span>
        </button>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>Edit Paket</span>
          </button>

          <button
            type="button"
            onClick={onToggleStatus}
            disabled={isTogglingStatus}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer ${
              isPublished
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}
          >
            {isPublished ? (
              <>
                <EyeOff className="w-4 h-4 text-rose-600" />
                <span>Unpublish</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-emerald-600" />
                <span>Publish</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Package Main Title & Badges */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            {packageData?.package_title || 'Memuat Paket Latihan...'}
          </h1>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isPublished
                ? 'bg-[#E8F8F3] text-[#059669] border border-[#059669]/20'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPublished ? 'bg-[#10B981]' : 'bg-slate-400'
              }`}
            />
            {isPublished ? 'Published' : (packageData?.status || 'Draft').toUpperCase()}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-3xl leading-relaxed">
          {packageData?.description ||
            'Latihan untuk mengukur kemampuan siswa dalam memahami informasi tersirat, hubungan antargagasan, dan makna berdasarkan konteks teks.'}
        </p>

        {/* Metadata Badges Row */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold bg-[#EAF6F8] text-[#0E7490] border border-[#0E7490]/20">
            Kompetensi:{' '}
            <strong className="font-bold">{packageData?.competency_name || 'Umum'}</strong>
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold bg-[#EAF6F8] text-[#0E7490] border border-[#0E7490]/20">
            Jumlah Soal:{' '}
            <strong className="font-bold">{packageData?.total_questions || 0} Soal</strong>
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold bg-[#EAF6F8] text-[#0E7490] border border-[#0E7490]/20">
            Status:{' '}
            <strong className="font-bold capitalize">{packageData?.status || 'Draft'}</strong>
          </span>
          {packageData?.formatted_created_at && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold bg-[#EAF6F8] text-[#0E7490] border border-[#0E7490]/20">
              Dibuat: <strong className="font-bold">{packageData.formatted_created_at}</strong>
            </span>
          )}
          {packageData?.formatted_updated_at && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold bg-[#EAF6F8] text-[#0E7490] border border-[#0E7490]/20">
              Diperbarui: <strong className="font-bold">{packageData.formatted_updated_at}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
