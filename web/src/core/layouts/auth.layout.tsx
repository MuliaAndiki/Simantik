import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { SimantikLogo } from '@/components/atoms/auth/SimantikLogo';

type Props = {
  children: React.ReactNode;
};

export default function AuthLayoutRoot({ children }: Props) {
  return (
    <section className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#EBF7F6] via-[#F3FAF9] to-[#FCFDFD] relative overflow-hidden selection:bg-teal-100 selection:text-teal-900">
      {/* Soft background ambient gradient blooms */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal-100/60 blur-3xl -z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-100/50 blur-3xl -z-0"
        aria-hidden="true"
      />

      {/* Header / Navbar */}
      <nav className="w-full px-6 py-5 sm:px-10 lg:px-14 flex items-center justify-between z-10 max-w-7xl mx-auto">
        <SimantikLogo />
      </nav>

      {/* Main Content Viewport */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        {children}
      </div>

      {/* Footer */}
      <footer className="w-full px-6 py-6 sm:px-10 lg:px-14 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 z-10 max-w-7xl mx-auto">
        <p className="text-center sm:text-left">
          © 2026 <span className="font-semibold text-slate-700">SIMANTIK</span>. Platform Belajar
          &amp; Asesmen Terintegrasi SMA/SMK.
        </p>

        <div className="flex items-center gap-3 sm:gap-4 text-slate-500">
          <Link href="/help" className="hover:text-slate-800 transition-colors">
            Bantuan
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/privacy" className="hover:text-slate-800 transition-colors">
            Kebijakan Privasi
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/terms" className="hover:text-slate-800 transition-colors">
            Syarat &amp; Ketentuan
          </Link>
        </div>
      </footer>
    </section>
  );
}
