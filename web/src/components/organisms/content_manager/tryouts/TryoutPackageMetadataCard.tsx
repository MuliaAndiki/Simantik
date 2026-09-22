import { ChevronDown, Clock, Layers, ListOrdered } from 'lucide-react';
import type React from 'react';
import type { SchoolLevel } from '@/types/service';
import { SCHOOL_LEVEL_OPTIONS } from '@/types/ui/material-manager.types';

export interface TryoutPackageMetadataCardProps {
  title: string;
  durationMinutes: number;
  totalQuestions: number;
  jenjang: SchoolLevel;
  description: string;
  onTitleChange: (val: string) => void;
  onDurationChange: (val: number) => void;
  onJenjangChange: (val: SchoolLevel) => void;
  onDescriptionChange: (val: string) => void;
}

export const TryoutPackageMetadataCard: React.FC<TryoutPackageMetadataCardProps> = ({
  title,
  durationMinutes,
  totalQuestions,
  jenjang,
  description,
  onTitleChange,
  onDurationChange,
  onJenjangChange,
  onDescriptionChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Title & Key Parameters */}
        <div className="lg:col-span-7 space-y-4">
          {/* Nama Paket Tryout */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Nama Paket Tryout Adaptif <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Contoh: Tryout TKA Bahasa Indonesia — Simulasi Resmi 2026"
              className="w-full px-4 py-2.5 bg-[#EAF6F8]/60 border border-cyan-200/80 rounded-xl text-slate-900 font-bold text-sm focus:outline-none focus:border-cyan-600 focus:bg-white transition"
              required
            />
          </div>

          {/* Grid: Jenjang, Durasi, Kuota Soal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Jenjang */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <Layers className="w-3 h-3 text-cyan-700" />
                <span>Jenjang</span>
              </label>
              <div className="relative">
                <select
                  value={jenjang}
                  onChange={(e) => onJenjangChange(e.target.value as SchoolLevel)}
                  className="w-full appearance-none px-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-xs cursor-pointer focus:outline-none focus:border-cyan-600 focus:bg-white transition"
                >
                  {SCHOOL_LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Durasi */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-700" />
                <span>Durasi</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  value={durationMinutes}
                  onChange={(e) => onDurationChange(Number(e.target.value))}
                  className="w-full px-3 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-xs focus:outline-none focus:border-cyan-600 focus:bg-white transition"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400 pointer-events-none">
                  Menit
                </span>
              </div>
            </div>

            {/* Target Soal */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <ListOrdered className="w-3 h-3 text-cyan-700" />
                <span>Total Soal</span>
              </label>
              <div className="relative">
                <div className="w-full px-3 pr-12 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-bold text-xs cursor-not-allowed">
                  {totalQuestions}
                </div>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400 pointer-events-none">
                  Soal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Deskripsi Ringkas */}
        <div className="lg:col-span-5 space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Deskripsi &amp; Petunjuk Ujian
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Simulasi ujian adaptif resmi berstandar nasional. Setiap butir soal menguji kompetensi siswa secara adaptif..."
            className="w-full p-3.5 bg-[#FEF9EE] border border-amber-200/60 rounded-xl text-slate-700 font-medium text-xs sm:text-sm leading-relaxed placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default TryoutPackageMetadataCard;
