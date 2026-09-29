import { ArrowLeft, Edit3, EyeOff, Layers, UploadCloud } from 'lucide-react';
import React from 'react';
import type { TryoutPackageResultsResponse } from '@/types/service';

export interface TryoutDetailHeaderProps {
  packageData: TryoutPackageResultsResponse | null;
  onBack: () => void;
  onEdit: () => void;
  onManageQuestions: () => void;
  onToggleStatus: () => void;
  isTogglingStatus?: boolean;
}

export const TryoutDetailHeader: React.FC<TryoutDetailHeaderProps> = ({
  packageData,
  onBack,
  onEdit,
  onManageQuestions,
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
          <span>Kembali ke Daftar Tryout</span>
        </button>

        <div className="flex items-center gap-2.5 self-start sm:self-center flex-wrap">
          <button
            type="button"
            onClick={onManageQuestions}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#134653] hover:bg-[#0B2D38] text-white rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Kelola Butir Soal Adaptif</span>
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>Edit Tryout</span>
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
                <span>Tutup Akses (Unpublish)</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-emerald-600" />
                <span>Publikasikan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Package Main Title & Badges */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            {packageData?.tryout_title || 'Memuat Paket Tryout...'}
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
            {isPublished ? 'PUBLISHED' : (packageData?.status || 'Draft').toUpperCase()}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-4xl leading-relaxed">
          {packageData?.description ||
            'Simulasi ujian terstandar dengan algoritma adaptif tingkat kognitif C1-C5 untuk mengukur kesiapan siswa secara komprehensif.'}
        </p>
      </div>
    </div>
  );
};

export default TryoutDetailHeader;
