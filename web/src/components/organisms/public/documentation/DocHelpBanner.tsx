import { HelpCircle, MessageSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function DocHelpBanner() {
  return (
    <section className="py-8">
      <div className="p-8 sm:p-10 rounded-[32px] bg-linear-to-r from-slate-900 via-[#1E3A44] to-slate-900 text-white shadow-xl text-left flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Text */}
        <div className="space-y-3 max-w-2xl relative z-10">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            Masih memiliki pertanyaan seputar ujian atau kendala teknis?
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Tim akademik dan tim bantuan sistem SIMANTIK siap membantu memandu kamu kapan saja agar
            persiapan TKA Bahasa Indonesia berjalan lancar tanpa hambatan teknis.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch gap-3 shrink-0 relative z-10">
          <Link
            href="/help"
            className="h-12 px-6 rounded-full bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-slate-900" />
            <span>Buka Pusat Bantuan</span>
          </Link>

          <Link
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="h-12 px-6 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Tanya Admin WhatsApp</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default DocHelpBanner;
