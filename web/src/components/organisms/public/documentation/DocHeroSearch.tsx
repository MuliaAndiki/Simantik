import { Award, CheckCircle2, Search, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';
import type * as React from 'react';

export interface DocHeroSearchProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  popularKeywords: string[];
  onSelectKeyword: (kw: string) => void;
}

export function DocHeroSearch({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  popularKeywords,
  onSelectKeyword,
}: DocHeroSearchProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearchSubmit();
    }
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-12 bg-linear-to-b from-cyan-50/50 via-white to-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Title & Search Bar */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-teal-800 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>Pusat Pengetahuan &amp; Panduan Resmi</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Documentation <span className="text-[#F5B731]">SIMANTIK</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-2xl">
              Temukan panduan komprehensif, standar asesmen kompetensi, dan petunjuk operasional
              untuk mengoptimalkan pengalaman belajar TKA Bahasa Indonesia kamu.
            </p>

            {/* Interactive Search Input Box */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-white border-2 border-slate-200/90 shadow-sm focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Cari artikel, topik, atau kata kunci panduan..."
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden py-1 px-1 font-medium"
                />
                <button
                  type="button"
                  onClick={onSearchSubmit}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shrink-0 transition-transform active:scale-95 cursor-pointer"
                >
                  Cari
                </button>
              </div>

              {/* Popular Tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Populer:</span>
                {popularKeywords.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => onSelectKeyword(kw)}
                    className="px-3 py-1 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Illustration Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm rounded-3xl bg-linear-to-tr from-cyan-100/60 to-white p-4 border border-cyan-100 shadow-lg flex flex-col items-center">
              {/* Top Verified Badge */}
              <div className="self-end inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-teal-800 text-[11px] font-bold shadow-2xs mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>100% Terverifikasi</span>
              </div>

              {/* Illustration */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                <Image
                  src="/illustrations/login-illustration.png"
                  alt="Documentation Hub"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Bottom Kurikulum Capsule */}
              <div className="w-full p-3 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center gap-2.5 text-left -mt-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">KURIKULUM MERDEKA</div>
                  <div className="text-[11px] text-slate-500">Standar BSKAP Terpadu</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DocHeroSearch;
