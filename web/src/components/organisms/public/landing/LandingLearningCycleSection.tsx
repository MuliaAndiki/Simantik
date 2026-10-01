import { RefreshCw, Sparkles } from 'lucide-react';
import { ScribbleSparkle, ScribbleUnderline } from '@/components/atoms/doodles/ScribbleDoodles';
import type { LearningCycleStep } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface LandingLearningCycleSectionProps {
  steps: LearningCycleStep[];
}

export function LandingLearningCycleSection({ steps }: LandingLearningCycleSectionProps) {
  return (
    <section id="tentang" className="py-16 bg-slate-50/60 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight relative inline-block">
            Bagaimana SIMANTIK{' '}
            <span className="relative inline-block text-teal-800">
              Membantumu Belajar?
              <ScribbleUnderline variant="double" color="#F5B731" delayMs={150} />
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Satu siklus pembelajaran cerdas yang menghubungkan proses belajar, asesmen terukur,
            analisis mendalam, dan rekomendasi personal.
          </p>
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 text-left">
          {steps.map((st) => (
            <div
              key={st.step}
              className={cn(
                'p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between relative shadow-2xs',
                st.isHighlighted
                  ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-300/40'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              )}
            >
              {/* Step Pill */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span
                  className={cn(
                    'w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm',
                    st.isHighlighted
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'bg-slate-100 text-slate-700'
                  )}
                >
                  {st.step}
                </span>

                {st.highlightBadge && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-200/90 text-amber-950 font-bold text-[10px]">
                    <Sparkles className="w-3 h-3 text-amber-800" />
                    <span>{st.highlightBadge}</span>
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 leading-tight">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {st.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingLearningCycleSection;
