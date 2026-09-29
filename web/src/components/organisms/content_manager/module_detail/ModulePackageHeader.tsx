import { ArrowLeft, BookOpen, Layers, Plus } from 'lucide-react';
import React from 'react';
import { JenjangBadge, StatusPill, type StatusPillTone } from '@/components/molecules/table';
import type { LearningModuleDetailResponse } from '@/types/service';

export interface ModulePackageHeaderProps {
  module: LearningModuleDetailResponse | null;
  onBack: () => void;
  onCreateMaterial: () => void;
}

export const ModulePackageHeader: React.FC<ModulePackageHeaderProps> = ({
  module,
  onBack,
  onCreateMaterial,
}) => {
  const statusTone: Record<string, StatusPillTone & { label: string }> = {
    published: {
      pill: 'bg-[#E8F8F3] text-[#059669]',
      dot: 'bg-[#10B981]',
      label: 'Published',
    },
    in_review: {
      pill: 'bg-[#FEF7EB] text-[#D97706]',
      dot: 'bg-[#F5B731]',
      label: 'In Review',
    },
    draft: {
      pill: 'bg-[#F1F5F9] text-[#64748B]',
      dot: 'bg-[#94A3B8]',
      label: 'Draft',
    },
  };

  const currentStatus = (module?.status || 'draft').toLowerCase();
  const tone = statusTone[currentStatus] || statusTone.draft;

  return (
    <div className="space-y-4">
      {/* Top Bar with Back and Create Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Kembali ke Daftar Modul</span>
        </button>

        <button
          type="button"
          onClick={onCreateMaterial}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#134653] hover:bg-[#0B2D38] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Materi Baru</span>
        </button>
      </div>

      {/* Module Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              {module?.label && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#EAF6F8] text-[#0E7490] border border-[#0E7490]/20">
                  {module.label}
                </span>
              )}
              {module?.jenjang && <JenjangBadge value={module.jenjang} />}
              <StatusPill label={tone.label} tone={tone} />
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {module?.title || 'Memuat Modul Pembelajaran...'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-3xl leading-relaxed">
              {module?.description ||
                'Daftar paket materi dan bahan ajar yang terstruktur di dalam modul pembelajaran ini.'}
            </p>
          </div>

          <div className="flex sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 shrink-0 pt-2 md:pt-0">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-50/70 border border-cyan-100 text-cyan-900">
              <Layers className="w-4 h-4 text-cyan-700" />
              <span className="text-xs sm:text-sm font-bold">
                {module?.materials_count ?? module?.materials?.length ?? 0} Paket Materi
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
