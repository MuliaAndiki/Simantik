import { ArrowLeft, LogIn } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { SimantikLogo } from '@/components/atoms/auth/SimantikLogo';
import { cn } from '@/utils/classname';

export interface LegalDocNavbarProps {
  className?: string;
}

export function LegalDocNavbar({ className }: LegalDocNavbarProps) {
  return (
    <header
      className={cn(
        'w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 transition-all print:hidden',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand with TKA Portal Badge */}
        <div className="flex items-center gap-3">
          <SimantikLogo href="/" showSubtitle={false} />
          <span className="hidden sm:inline-flex items-center rounded-full bg-teal-50/90 border border-teal-200/70 text-teal-700 text-[11px] font-semibold px-2.5 py-0.5">
            SMA / SMK TKA Portal
          </span>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-medium px-3.5 py-1.5 shadow-2xs transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold px-4 py-1.5 shadow-2xs transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
