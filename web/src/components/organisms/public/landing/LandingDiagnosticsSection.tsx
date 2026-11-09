import { AlertCircle, Award, CheckCircle2, Clock, Info, Lightbulb, TrendingUp } from 'lucide-react';
import type { LandingDiagnosticsData } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface LandingDiagnosticsSectionProps {
  diagnostics: LandingDiagnosticsData;
}

export function LandingDiagnosticsSection({ diagnostics }: LandingDiagnosticsSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
            Rapor Evaluasi & Pembahasan Mendalam
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pahami Kekuatan & Area yang Perlu Diperbaiki
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Setelah selesai try out, dapatkan rincian hasil belajar yang memberi tahu bagian mana
            yang sudah dikuasai dan apa yang perlu dipelajari lagi. Hasil evaluasi otomatis
            dikirimkan ke email siswa dalam bentuk dokumen PDF.
          </p>
        </div>

        {/* 3 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 text-left">
          {/* Card 1 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-cyan-50/50 border border-cyan-100 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-cyan-100/90 text-teal-800 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Skor Keseluruhan
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-black text-slate-900">
                  {diagnostics.overallScorePercent}%
                </span>
                <span className="text-xs text-teal-800 font-bold">
                  Predikat: {diagnostics.grade}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100/90 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Akurasi Jawaban
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-black text-slate-900">
                  {diagnostics.accuracyPercent}%
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {diagnostics.answeredRatioText}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/50 border border-sky-100 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-sky-100/90 text-sky-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Waktu Rata-rata
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-black text-slate-900">
                  {diagnostics.avgTimePerQuestion}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Competencies Progress Bars Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50/70 border border-slate-200/90 space-y-6 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              Rincian Penguasaan Kompetensi
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Target Kelulusan Standar: {diagnostics.targetThresholdPercent}%
            </span>
          </div>

          <div className="space-y-5">
            {diagnostics.competencies.map((comp) => (
              <div key={comp.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{comp.name}</span>
                    <span
                      className={cn(
                        'text-[10px] font-extrabold px-2 py-0.5 rounded-full border',
                        comp.isAlert
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-teal-50 text-teal-800 border-teal-200'
                      )}
                    >
                      {comp.statusLabel}
                    </span>
                  </div>

                  <span
                    className={cn(
                      'text-xs font-black',
                      comp.isAlert ? 'text-rose-600' : 'text-slate-900'
                    )}
                  >
                    {comp.scorePercent}%{' '}
                    {comp.isAlert && `(Di Bawah Target ${diagnostics.targetThresholdPercent}%)`}
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      comp.isAlert ? 'bg-rose-500' : 'bg-teal-800'
                    )}
                    style={{ width: `${comp.scorePercent}%` }}
                  />
                </div>

                {comp.alertNote && (
                  <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5 italic">
                    {comp.alertNote}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Principle Callout Box */}
          <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200/90 flex items-start gap-3 text-xs">
            <Lightbulb className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <p className="text-slate-700 leading-relaxed font-medium">
              <span className="font-bold text-teal-950">Prinsip SIMANTIK: </span>
              {diagnostics.principleQuote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingDiagnosticsSection;
