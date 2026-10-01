import { BookOpen, Headphones, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export function TutorialSupportBanner() {
  return (
    <section className="py-8">
      <div className="p-8 sm:p-10 rounded-[32px] bg-linear-to-r from-slate-900 via-[#1E3A44] to-slate-900 text-white shadow-xl text-left flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Text */}
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/80 border border-teal-500/40 text-teal-300 text-xs font-bold">
            <Headphones className="w-3.5 h-3.5 text-amber-400" />
            <span>Layanan Bantuan Siswa</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            Masih Membutuhkan Bimbingan Teknis?
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Tim mentor akademik dan customer support EduCourse siap membantu menganalisis kendala
            teknis maupun tata cara penggunaan instrumen ujian SIMANTIK.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch gap-3 shrink-0 relative z-10">
          <Link
            href="/documentation"
            className="h-12 px-6 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Buka Pusat Dokumentasi</span>
          </Link>

          <Link
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="h-12 px-6 rounded-full bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-slate-900" />
            <span>Hubungi WhatsApp Bantuan</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TutorialSupportBanner;
