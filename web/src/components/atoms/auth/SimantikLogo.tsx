import Link from 'next/link';
import type * as React from 'react';
import { cn } from '@/utils/classname';

export interface SimantikLogoProps {
  className?: string;
  showSubtitle?: boolean;
  centered?: boolean;
  href?: string;
}

export function SimantikLogo({
  className,
  showSubtitle = true,
  centered = false,
  href = '/',
}: SimantikLogoProps) {
  const content = (
    <div
      className={cn(
        'flex items-center gap-3 select-none group transition-opacity hover:opacity-95',
        centered && 'justify-center',
        className
      )}
    >
      {/* Stylized SIMANTIK Book Emblem */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700 text-white shadow-sm shadow-teal-500/20 ring-1 ring-teal-400/30">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 drop-shadow-xs"
          aria-hidden="true"
        >
          {/* Open Book */}
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h7" />
          <path d="m16 14 2 2 4-4" className="stroke-amber-300" strokeWidth="2.5" />
        </svg>
        {/* Subtle accent highlight badge */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
      </div>

      {/* Brand Text */}
      <div className={cn('flex flex-col', centered && 'text-center')}>
        <span className="font-extrabold tracking-tight text-lg text-slate-800 leading-tight">
          SIMANTIK
        </span>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-teal-600 tracking-normal">
            Platform Belajar &amp; Asesmen SMA/SMK
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
