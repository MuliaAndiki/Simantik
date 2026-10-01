import { Search, Sparkles, TrendingUp, Video } from 'lucide-react';
import type * as React from 'react';

export interface TutorialHeroSearchProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  popularKeywords: string[];
  onSelectKeyword: (kw: string) => void;
}

export function TutorialHeroSearch({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  popularKeywords,
  onSelectKeyword,
}: TutorialHeroSearchProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearchSubmit();
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-10 bg-linear-to-b from-cyan-50/50 via-white to-white text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Tutorial <span className="text-teal-800">SIMANTIK</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
          Pelajari cara menggunakan fitur SIMANTIK melalui tutorial yang mudah diikuti untuk
          memaksimalkan persiapan Tes Kemampuan Akademik Bahasa Indonesia SMA.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto space-y-3 pt-2">
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-white border-2 border-slate-200/90 shadow-sm focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100 transition-all text-left">
            <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Cari tutorial, topik video, atau cara penggunaan..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden py-1 px-1 font-medium"
            />
            <button
              type="button"
              onClick={onSearchSubmit}
              className="px-6 py-2.5 rounded-xl bg-teal-900 hover:bg-teal-950 text-white font-bold text-xs sm:text-sm shrink-0 transition-transform active:scale-95 cursor-pointer"
            >
              Cari Tutorial
            </button>
          </div>

          {/* Popular Keywords */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-slate-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Populer:</span>
            </div>
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
    </section>
  );
}

export default TutorialHeroSearch;
