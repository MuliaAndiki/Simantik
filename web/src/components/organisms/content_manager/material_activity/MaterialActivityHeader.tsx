import { ArrowLeft, Download, Eye } from 'lucide-react';
import React from 'react';

export interface MaterialActivityHeaderProps {
  materialTitle: string;
  competencyName?: string;
  status: string;
  onBack: () => void;
  onExportData: () => void;
  onViewMaterial: () => void;
}

export const MaterialActivityHeader: React.FC<MaterialActivityHeaderProps> = ({
  materialTitle,
  competencyName = 'Umum',
  status,
  onBack,
  onExportData,
  onViewMaterial,
}) => {
  const isPublished = (status || 'published').toLowerCase() === 'published';

  return (
    <div className="space-y-4">
      {/* Top Bar with Back Button and Main Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Kembali ke Detail Materi</span>
        </button>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            type="button"
            onClick={onExportData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-cyan-800 border border-cyan-200/80 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-700" />
            <span>Ekspor Data</span>
          </button>

          <button
            type="button"
            onClick={onViewMaterial}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-900" />
            <span>Lihat Materi</span>
          </button>
        </div>
      </div>

      {/* Badges and Material Main Title */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#EAF6F8] text-[#0E7490] border border-[#0E7490]/20">
            {competencyName.toUpperCase()}
          </span>
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
            {isPublished ? 'PUBLISHED' : status.toUpperCase()}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
          {materialTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Pantau siswa yang telah mengakses materi ini secara terperinci dan real-time.
        </p>
      </div>
    </div>
  );
};
