import type React from 'react';
import {
  CompetencyCreatableSelect,
  type CompetencyDropdownActionProps,
} from '@/components/molecules/input/CompetencyCreatableSelect';
import type { MaterialMetadata } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface MaterialMetadataCardProps extends CompetencyDropdownActionProps {
  metadata?: MaterialMetadata;
  categories?: string[];
  onChange?: (next: Partial<MaterialMetadata>) => void;
  className?: string;
}

const DEFAULT_METADATA: MaterialMetadata = {
  judulMateri: 'Memahami Teks Eksplanasi',
  competencyId: '',
  kategoriPembelajaran: '',
  deskripsiRingkas:
    'Materi komprehensif mengenai struktur, kaidah kebahasaan, dan analisis logis fenomena dalam teks eksplanasi.',
  idDokumen: 'DOC-SIM-2025-014',
};

export const MaterialMetadataCard: React.FC<MaterialMetadataCardProps> = ({
  metadata = DEFAULT_METADATA,
  competencies = [],
  onCreateCompetency,
  onRequestDeleteCompetency,
  isCreatingCompetency = false,
  deletingCompetencyId = null,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-2xs space-y-5 select-none',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-1 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
          <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-wider uppercase">
            Metadata Materi
          </h2>
        </div>
        <span className="text-xs font-bold text-slate-500 tracking-wide">
          ID Dokumen: {metadata.idDokumen || 'DOC-SIM-2025-014'}
        </span>
      </div>

      {/* Form Fields Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Judul Materi */}
          <div className="lg:col-span-8 space-y-1.5">
            <label htmlFor="material-title" className="text-xs font-bold text-slate-700 block">
              Judul Materi <span className="text-rose-500">*</span>
            </label>
            <input
              id="material-title"
              type="text"
              value={metadata.judulMateri}
              onChange={(e) => onChange?.({ judulMateri: e.target.value })}
              placeholder="Masukkan judul materi pembelajaran..."
              className="w-full bg-[#F0F8FF] hover:bg-[#EBF5FE] border border-sky-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all"
            />
          </div>

          {/* Kategori Pembelajaran / Kompetensi */}
          <div className="lg:col-span-4 space-y-1.5">
            <label htmlFor="material-category" className="text-xs font-bold text-slate-700 block">
              Kompetensi / Subtes
            </label>
            <CompetencyCreatableSelect
              id="material-category"
              value={metadata.competencyId || ''}
              onChange={(competencyId, comp) =>
                onChange?.({
                  competencyId,
                  kategoriPembelajaran: comp?.name ?? '',
                })
              }
              competencies={competencies}
              noneLabel="-- Umum / Tanpa Kompetensi Khusus --"
              onCreateCompetency={onCreateCompetency}
              onRequestDeleteCompetency={onRequestDeleteCompetency}
              isCreatingCompetency={isCreatingCompetency}
              deletingCompetencyId={deletingCompetencyId}
              triggerClassName="bg-[#F0F8FF] hover:bg-[#EBF5FE] border-sky-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800"
            />
          </div>
        </div>

        {/* Deskripsi Ringkas Materi */}
        <div className="space-y-1.5">
          <label htmlFor="material-description" className="text-xs font-bold text-slate-700 block">
            Deskripsi Ringkas Materi
          </label>
          <input
            id="material-description"
            type="text"
            value={metadata.deskripsiRingkas}
            onChange={(e) => onChange?.({ deskripsiRingkas: e.target.value })}
            placeholder="Tuliskan deskripsi ringkas materi..."
            className="w-full bg-[#F0F8FF] hover:bg-[#EBF5FE] border border-sky-100 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default MaterialMetadataCard;
