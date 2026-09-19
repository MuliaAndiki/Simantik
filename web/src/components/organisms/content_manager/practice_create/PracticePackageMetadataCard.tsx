import { ChevronDown } from 'lucide-react';
import type React from 'react';
import type { PracticeManagerCompetencyOption } from '../practice/PracticeFilterBar';

export interface PracticePackageMetadataCardProps {
  title: string;
  competencyId: string;
  description: string;
  competencies: PracticeManagerCompetencyOption[];
  onTitleChange: (val: string) => void;
  onCompetencyChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
}

export const PracticePackageMetadataCard: React.FC<PracticePackageMetadataCardProps> = ({
  title,
  competencyId,
  description,
  competencies,
  onTitleChange,
  onCompetencyChange,
  onDescriptionChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Title & Competency */}
        <div className="lg:col-span-6 space-y-4">
          {/* Nama Paket Soal */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Nama Paket Soal Latihan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Contoh: Memahami Informasi dalam Teks"
              className="w-full px-4 py-2.5 bg-[#EAF6F8]/60 border border-cyan-200/80 rounded-xl text-slate-900 font-bold text-sm focus:outline-none focus:border-cyan-600 focus:bg-white transition"
              required
            />
          </div>

          {/* Kompetensi */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Kompetensi <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={competencyId}
                onChange={(e) => onCompetencyChange(e.target.value)}
                className="w-full appearance-none px-4 pr-10 py-2.5 bg-[#EAF6F8]/60 border border-cyan-200/80 rounded-xl text-slate-800 font-medium text-sm cursor-pointer focus:outline-none focus:border-cyan-600 focus:bg-white transition"
              >
                <option value="">-- Pilih Kompetensi Asesmen --</option>
                {competencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right Column: Deskripsi Ringkas */}
        <div className="lg:col-span-6 space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Deskripsi Ringkas Latihan
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Materi komprehensif mengenai struktur, kaidah kebahasaan, dan analisis logis fenomena dalam teks eksplanasi..."
            className="w-full p-4 bg-[#FEF9EE] border border-amber-200/60 rounded-xl text-slate-700 font-medium text-xs sm:text-sm leading-relaxed placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PracticePackageMetadataCard;
