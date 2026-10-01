import { Award, BookCheck, Sparkles, Users } from 'lucide-react';
import type { ImpactMetricItem } from '@/types/ui';

export interface TestimonialHeroMetricsProps {
  metrics: ImpactMetricItem[];
}

export function TestimonialHeroMetrics({ metrics }: TestimonialHeroMetricsProps) {
  return (
    <section className="pt-12 pb-8 text-center space-y-8">
      <div className="max-w-3xl mx-auto px-4 space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Apa Kata Pengguna?
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
          Lihat pengalaman pengguna setelah menggunakan SIMANTIK dalam mempersiapkan Tes Kemampuan
          Akademik Bahasa Indonesia dengan metodologi adaptif dan standar resmi.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
          {metrics.map((m, idx) => (
            <div
              key={m.label}
              className="p-6 sm:p-7 rounded-3xl bg-cyan-50/60 border border-cyan-100/90 shadow-2xs space-y-1 text-center"
            >
              <div className="text-3xl sm:text-4xl font-black text-teal-900 tracking-tight">
                {m.value}
              </div>
              <div className="text-xs sm:text-[13px] font-bold text-slate-800 pt-1">{m.label}</div>
              <div className="text-xs text-slate-500 font-medium">{m.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialHeroMetrics;
