'use client';

import { LogIn, Menu, User, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SimantikLogo } from '@/components/atoms/auth/SimantikLogo';
import { cn } from '@/utils/classname';

export interface AppHeaderProps {
  className?: string;
}

export const NAV_ITEMS = [
  { label: 'Beranda', href: '/home', match: (p: string) => p === '/' || p === '/home' },
  {
    label: 'Documentation',
    href: '/documentation',
    match: (p: string) => p.startsWith('/documentation'),
  },
  { label: 'Tutorials', href: '/tutorials', match: (p: string) => p.startsWith('/tutorials') },
  {
    label: 'Testimonials',
    href: '/testimonials',
    match: (p: string) => p.startsWith('/testimonials'),
  },
  {
    label: 'Berita',
    href: '/news',
    match: (p: string) => p.startsWith('/news'),
  },
];

export default function AppHeader({ className }: AppHeaderProps) {
  const pathname = usePathname() || '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200 select-none print:hidden',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs py-3'
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-200/60 py-3.5',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3 shrink-0">
          <SimantikLogo href="/home" showSubtitle={false} />
          <div className="hidden lg:flex flex-col text-[11px] leading-tight text-slate-500 font-semibold border-l border-slate-200 pl-3">
            <span className="text-teal-800 font-bold tracking-tight">TKA BAHASA INDONESIA</span>
            <span>Asesmen &amp; Pembelajaran Cerdas</span>
          </div>
        </div>

        {/* Center Pill Navigation (Desktop) */}
        <nav className="hidden md:flex items-center p-1 rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs">
          {NAV_ITEMS.map((item) => {
            const isActive = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-[#EAF6F8] text-teal-900 font-bold border border-cyan-200/90 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions (Desktop) */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <Link
            href="/student/dashboard"
            className="w-9 h-9 rounded-full bg-primary-foreground text-white flex items-center justify-center shadow-2xs hover:opacity-90 transition cursor-pointer"
            aria-label="Akun Pengguna"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/register"
            className="inline-flex items-center justify-center h-8 px-3.5 rounded-full bg-[#F5B731] text-slate-900 font-black text-xs"
          >
            Daftar
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-1 pb-3 border-b border-slate-100">
            {NAV_ITEMS.map((item) => {
              const isActive = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-xs font-bold transition-all',
                    isActive
                      ? 'bg-[#EAF6F8] text-teal-900 border border-cyan-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 flex items-center gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk Akun</span>
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-xl bg-[#F5B731] text-xs font-black text-slate-900 shadow-xs"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
