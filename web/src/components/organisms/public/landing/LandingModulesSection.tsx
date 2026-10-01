import { ArrowRight, BookOpen, Clock, Flame } from 'lucide-react';
import Link from 'next/link';
import type { LandingModuleItem } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface LandingModulesSectionProps {
  modules: LandingModuleItem[];
}

export function LandingModulesSection({ modules }: LandingModulesSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header with Title and Explore Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
              Modul Pembelajaran Mandiri
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Belajar Sesuai Kebutuhanmu
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Temukan materi interaktif yang dirancang untuk mengasah pemahaman fondasional dan
              logika aplikatif.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-teal-800 hover:text-teal-950 transition-colors shrink-0"
          >
            <span>Jelajahi Semua Modul</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Module Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 text-left">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className={cn(
                'p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-5 shadow-2xs hover:shadow-md',
                mod.isPriority
                  ? 'bg-amber-50/40 border-amber-200/90'
                  : 'bg-white border-slate-200/90'
              )}
            >
              {/* Category & Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-teal-800 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full">
                  {mod.category}
                </span>

                {mod.isPriority && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                    <Flame className="w-3 h-3 text-rose-600" />
                    <span>Prioritas</span>
                  </span>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 leading-tight">{mod.title}</h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span>{mod.level}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{mod.duration}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Progress Belajar</span>
                  <span
                    className={
                      mod.isPriority ? 'font-black text-rose-600' : 'font-bold text-slate-700'
                    }
                  >
                    {mod.progressPercent}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      mod.isPriority ? 'bg-rose-500' : 'bg-teal-600'
                    )}
                    style={{ width: `${mod.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* CTA Action Button */}
              <Link
                href={mod.href}
                className={cn(
                  'w-full h-10 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95',
                  mod.isPriority
                    ? 'bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 shadow-2xs font-black'
                    : 'bg-[#EAF6F8] hover:bg-cyan-100/80 text-teal-900 border border-cyan-200/80'
                )}
              >
                <span>Pelajari Modul</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingModulesSection;
