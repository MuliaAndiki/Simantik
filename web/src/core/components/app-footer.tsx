import {
  BookOpen,
  CheckCircle2,
  FileText,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { SimantikLogo } from '@/components/atoms/auth/SimantikLogo';
import { cn } from '@/utils/classname';

export interface AppFooterProps {
  className?: string;
  themeVariant?: 'dark' | 'light';
}

export default function AppFooter({ className, themeVariant = 'dark' }: AppFooterProps) {
  const isDark = themeVariant === 'dark';

  return (
    <footer
      className={cn(
        'w-full pt-14 pb-8 transition-colors select-none print:hidden border-t',
        isDark
          ? 'bg-[#1E3A44] border-slate-700/60 text-slate-300'
          : 'bg-[#F8FAFC] border-slate-200/90 text-slate-600',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-700/50">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SimantikLogo href="/home" showSubtitle={false} />
            </div>

            <p className="text-xs sm:text-[13px] leading-relaxed opacity-90">
              Platform pembelajaran adaptif dan asesmen cerdas berbasis kompetensi. Membimbing
              siklus belajar, uji kemampuan, analisis kelemahan, rekomendasi tepat sasaran, hingga
              optimalisasi hasil belajar.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs opacity-80">
              <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>bantuan@simantik.id</span>
            </div>
          </div>

          {/* Column 2: Navigasi */}
          <div className="space-y-3">
            <h3
              className={cn(
                'text-xs font-bold uppercase tracking-wider',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              Navigasi
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              <li>
                <Link href="/home" className="hover:text-amber-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/home#tentang" className="hover:text-amber-400 transition-colors">
                  Tentang SIMANTIK
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-amber-400 transition-colors">
                  Warta &amp; Berita
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="hover:text-amber-400 transition-colors">
                  Documentation Hub
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="hover:text-amber-400 transition-colors">
                  Video Tutorials
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-amber-400 transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition-colors">
                  Modul Pembelajaran
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition-colors">
                  Tryout Adaptif
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Bantuan & Kebijakan */}
          <div className="space-y-3">
            <h3
              className={cn(
                'text-xs font-bold uppercase tracking-wider',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              Bantuan &amp; Kebijakan
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              <li>
                <Link href="/help" className="hover:text-amber-400 transition-colors">
                  Pusat Bantuan &amp; FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-400 transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition-colors">
                  Syarat &amp; Ketentuan Layanan
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="hover:text-amber-400 transition-colors">
                  Panduan Siswa &amp; Guru
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-amber-400 transition-colors">
                  Kontak Layanan
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Ikuti Kami / Akreditasi */}
          <div className="space-y-3">
            <h3
              className={cn(
                'text-xs font-bold uppercase tracking-wider',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              Standar &amp; Kurikulum
            </h3>
            <p className="text-xs leading-relaxed opacity-90">
              Materi dan bank soal disusun merujuk pada standar capaian BSKAP Kemendikbudristek
              terpadu untuk siswa SMA/SMK se-Indonesia.
            </p>

            {/* Social Media Link Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <Link
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </Link>
              <Link
                href="/documentation"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"
                aria-label="Dokumentasi"
              >
                <BookOpen className="w-4 h-4" />
              </Link>
              <Link
                href="/terms"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"
                aria-label="Legal"
              >
                <FileText className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs opacity-75">
          <div>© 2026 SIMANTIK EdTech Platform. Hak cipta dilindungi undang-undang.</div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:underline">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:underline">
              Syarat &amp; Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
