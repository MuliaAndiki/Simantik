import {
  ArrowRight,
  BookMarked,
  CheckCircle2,
  ChevronRight,
  Clock,
  RefreshCw,
  Sparkles,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import {
  ScribbleArrow,
  ScribbleCircle,
  ScribbleSparkle,
  ScribbleUnderline,
} from '@/components/atoms/doodles/ScribbleDoodles';
import type { LandingRecommendationData } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface LandingRecommendationSectionProps {
  data: LandingRecommendationData;
}

export function LandingRecommendationSection({ data }: LandingRecommendationSectionProps) {
  return (
    <section className="py-16 bg-slate-50/60 border-t border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 relative">
          <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
            Rekomendasi Presisi
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight relative inline-block">
            Tahu Apa yang Harus{' '}
            <span className="relative inline-block text-teal-800">
              Dipelajari Selanjutnya
              <ScribbleUnderline variant="sketch" color="#0D9488" delayMs={180} />
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            SIMANTIK memberikan rekomendasi materi yang dipersonalisasi berdasarkan hasil belajarmu,
            bukan rekomendasi acak.
          </p>
        </div>

        {/* 4 Steps Flow Pipeline */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          {data.flowSteps.map((step, idx) => (
            <div
              key={step.stepNumber}
              className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto"
            >
              <div
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold w-full sm:w-auto justify-center',
                  step.isHighlighted
                    ? 'bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border border-slate-100'
                )}
              >
                <span
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black',
                    step.isHighlighted ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                  )}
                >
                  {step.stepNumber}
                </span>
                <span>{step.title}</span>
              </div>

              {idx < data.flowSteps.length - 1 && (
                <ChevronRight className="hidden sm:block w-4 h-4 text-slate-400 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Recommendation Feature Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold w-fit">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Rekomendasi Pembelajaran Personal</span>
            </span>

            <span className="text-[11px] font-medium text-slate-500">
              Dihasilkan otomatis berdasarkan Tryout Terakhir
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {data.featuredModule.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-3xl">
              {data.featuredModule.description}
            </p>
          </div>

          {/* 4 Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Kompetensi Target
              </span>
              <span className="font-extrabold text-slate-900 block mt-0.5">
                {data.featuredModule.targetCompetency}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Alasan Kurasi
              </span>
              <span className="font-extrabold text-rose-600 block mt-0.5">
                {data.featuredModule.curationReason}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Estimasi Durasi
              </span>
              <span className="font-extrabold text-slate-900 block mt-0.5">
                {data.featuredModule.estimatedDuration}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Status Progres
              </span>
              <span className="font-extrabold text-slate-700 block mt-0.5">
                {data.featuredModule.progressStatus}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              href={data.featuredModule.learnHref}
              className="w-full sm:w-auto h-11 px-6 rounded-full bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-transform active:scale-95"
            >
              <span>Pelajari Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto h-11 px-6 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <BookMarked className="w-4 h-4 text-slate-500" />
              <span>Simpan ke Rencana Belajar</span>
            </Link>
          </div>
        </div>

        {/* Continuous Learning Flow Dark Banner */}
        <div className="p-8 sm:p-10 rounded-[32px] bg-linear-to-r from-slate-900 via-[#1E3A44] to-slate-900 text-white shadow-xl text-center space-y-8">
          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400 block">
              Continuous Learning Flow
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Siklus Belajar Tanpa Henti
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Setiap siklus belajar dirancang untuk terus memperkuat penguasaan materi hingga kamu
              mencapai kompetensi maksimal.
            </p>
          </div>

          {/* 5 Step Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-left text-xs">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-teal-300 block uppercase">Langkah 1</span>
              <div className="font-extrabold text-white text-sm">1. Belajar Materi</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Bangun pemahaman konsep inti lewat modul ringkas interaktif.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-teal-300 block uppercase">Langkah 2</span>
              <div className="font-extrabold text-white text-sm">2. Uji Tryout</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Uji pemahamanmu dengan simulasi soal berbatas waktu.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-teal-300 block uppercase">Langkah 3</span>
              <div className="font-extrabold text-white text-sm">3. Analisis Hasil</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Identifikasi kompetensi yang kuat dan bagian yang butuh perbaikan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-teal-300 block uppercase">Langkah 4</span>
              <div className="font-extrabold text-white text-sm">4. Rekomendasi Terarah</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Terima kurasi materi spesifik untuk melatih topik yang belum dikuasai.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-400/20 border border-amber-400/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-300 block uppercase">
                  Langkah 5
                </span>
                <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <div className="font-extrabold text-amber-300 text-sm">
                5. Perbaiki &amp; Uji Lagi
              </div>
              <p className="text-[11px] text-slate-200 leading-relaxed">
                Tingkatkan skor, ulangi asesmen, dan saksikan progres kemampuanmu melesat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingRecommendationSection;
