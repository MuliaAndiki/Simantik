import Link from 'next/link';
import type * as React from 'react';
import { cn } from '@/utils/classname';

export interface LegalDocFooterProps {
  activeRoute?: '/help' | '/privacy' | '/terms';
  className?: string;
}

export function LegalDocFooter({ activeRoute, className }: LegalDocFooterProps) {
  return (
    <footer
      className={cn(
        'w-full bg-[#133E4D] text-white py-10 sm:py-12 mt-16 print:hidden border-t border-teal-900/40',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Left Brand info */}
        <div className="space-y-3 max-w-md">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-[#133E4D] font-extrabold flex items-center justify-center text-sm shadow-xs">
              S
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">SIMANTIK</span>
          </div>

          <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed">
            Platform pendidikan dan evaluasi untuk membantu persiapan TKA Bahasa Indonesia.
          </p>

          <p className="text-[11px] text-teal-200/50">
            © 2026 SIMANTIK. Seluruh hak cipta dilindungi undang-undang.
          </p>
        </div>

        {/* Right Nav Links */}
        <div className="flex flex-col gap-3 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-teal-100/90 font-medium">
            <Link href="/" className="hover:text-amber-300 transition-colors">
              Tentang SIMANTIK
            </Link>
            <Link
              href="/privacy"
              className={cn(
                'transition-colors',
                activeRoute === '/privacy' ? 'text-amber-300 font-semibold' : 'hover:text-amber-300'
              )}
            >
              Kebijakan Privasi
            </Link>
            <Link
              href="/terms"
              className={cn(
                'transition-colors',
                activeRoute === '/terms' ? 'text-amber-300 font-semibold' : 'hover:text-amber-300'
              )}
            >
              Syarat &amp; Ketentuan
            </Link>
          </div>

          <div className="flex items-center gap-4 text-teal-100/90 font-medium">
            <Link
              href="/help"
              className={cn(
                'transition-colors',
                activeRoute === '/help' ? 'text-amber-300 font-semibold' : 'hover:text-amber-300'
              )}
            >
              Pusat Bantuan
            </Link>
            <span className="text-teal-500/50">•</span>
            <a href="mailto:bantuan@simantik.id" className="hover:text-amber-300 transition-colors">
              Hubungi Kami
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
