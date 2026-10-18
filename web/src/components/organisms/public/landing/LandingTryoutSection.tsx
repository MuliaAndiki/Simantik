'use client';
import { ArrowRight, CheckSquare, Clock, Flame, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { LandingTryoutPackage } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface LandingTryoutSectionProps {
  packages: LandingTryoutPackage[];
}

export function LandingTryoutSection({ packages }: LandingTryoutSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'latest' | 'popular'>('all');

  const filteredPackages = packages.filter((pkg) => {
    if (activeTab === 'latest') return pkg.badgeType === 'live' || pkg.badgeType === 'standard';
    if (activeTab === 'popular') return pkg.badgeType === 'popular';
    return true;
  });

  return (
    <section className="py-16 bg-slate-50/50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
              Simulasi Ujian Adaptif
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Uji Kemampuanmu
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Kerjakan tryout adaptif dengan timer riil untuk mengetahui kesiapan akademis dan
              mendapatkan diagnosis akurat.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center p-1 rounded-full bg-slate-200/70 shrink-0 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={cn(
                'px-4 py-1.5 rounded-full transition-all cursor-pointer',
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Semua Paket
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('latest')}
              className={cn(
                'px-4 py-1.5 rounded-full transition-all cursor-pointer',
                activeTab === 'latest'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Terbaru
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('popular')}
              className={cn(
                'px-4 py-1.5 rounded-full transition-all cursor-pointer',
                activeTab === 'popular'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Populer
            </button>
          </div>
        </div>

        {/* 3 Tryout Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 relative"
            >
              {/* Top Row: Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-cyan-50 border border-cyan-200 px-3 py-0.5 rounded-full">
                  <span>{pkg.badgeLabel}</span>
                </span>

                <span className="text-xs text-slate-500 font-semibold">{pkg.difficulty}</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 leading-snug">{pkg.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {pkg.description}
                </p>
              </div>

              {/* Info Badges (Questions & Duration) */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-teal-700" />
                  <span>{pkg.totalQuestions} Soal Pilihan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>{pkg.durationMinutes} Menit</span>
                </div>
              </div>

              {/* Action Buttons (Mulai Tryout + Detail) */}
              <div className="flex items-center gap-2.5 pt-1">
                <Link
                  href={pkg.startHref}
                  className="flex-1 h-11 rounded-full bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-2xs transition-transform active:scale-95"
                >
                  <span>Mulai Tryout</span>
                </Link>

                <Link
                  href={pkg.detailHref}
                  className="px-5 h-11 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center transition-colors"
                >
                  <span>Detail</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingTryoutSection;
