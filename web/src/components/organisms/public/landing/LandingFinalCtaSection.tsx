import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export function LandingFinalCtaSection() {
  return (
    <section className="py-16 bg-white space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Help Banner Callout */}
        <div className="p-6 sm:p-7 rounded-3xl bg-cyan-50/70 border border-cyan-200/90 flex flex-col sm:flex-row items-center justify-between gap-5 text-left">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-teal-800 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-black text-slate-900">
                Butuh Bantuan Menggunakan SIMANTIK?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Pelajari panduan navigasi platform, tata cara pengerjaan tryout adaptif, dan
                interpretasi grafik hasil asesmen.
              </p>
            </div>
          </div>

          <Link
            href="/documentation"
            className="w-full sm:w-auto h-11 px-6 rounded-full bg-teal-900 hover:bg-teal-950 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95"
          >
            <span>Buka Dokumentasi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Final Conversion Banner */}
        <div className="p-10 sm:p-14 rounded-[36px] bg-linear-to-r from-slate-900 via-[#1E3A44] to-slate-900 text-white text-center shadow-2xl space-y-8 relative overflow-hidden">
          {/* Subtle Glow Circle */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-2xl mx-auto relative z-10">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-teal-400 block">
              Langkah Awal Menuju Sukses Akademik
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Mulai Perjalanan Belajarmu Bersama SIMANTIK
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Belajar lebih terarah, pahami kemampuanmu secara objektif, dan tingkatkan kompetensimu
              secara berkelanjutan tanpa biaya.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 relative z-10">
            <Link
              href="/register"
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 border-0"
            >
              <span>Mulai Belajar Sekarang</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span>Lihat Jadwal Tryout</span>
            </Link>
          </div>

          {/* 3 Checkmarks Footer */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-300 font-medium relative z-10">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>100% Gratis Selamanya</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Tanpa Perlu Kartu Kredit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Langsung Bisa Digunakan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingFinalCtaSection;
