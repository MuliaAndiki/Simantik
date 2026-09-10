import { Icon } from '@iconify/react';
import Link from 'next/link';
import * as React from 'react';

import {
  ComingSoonFeatures,
  ComingSoonFooter,
  ComingSoonHero,
  type ComingSoonHeroProps,
} from '@/components/organisms';
import { cn } from '@/utils/classname';

export interface ComingSoonTemplateProps extends ComingSoonHeroProps {
  showFeatures?: boolean;
  showFooter?: boolean;
  navAction?: React.ReactNode;
}

/**
 * Atomic Template for the Coming Soon page.
 * Combines Hero, Features, and Footer organisms with a cohesive
 * Educourse-inspired aesthetic and progressive elevation.
 */
export function ComingSoonTemplate({
  showFeatures = true,
  showFooter = true,
  navAction,
  className,
  targetDate,
  title,
  highlightText,
  description,
  badgeText,
  onSubscribe,
  ...props
}: ComingSoonTemplateProps) {
  return (
    <div
      className={cn(
        'relative min-h-screen flex flex-col justify-between bg-[#FAFCFD] text-[#111827] overflow-x-hidden font-sans',
        className
      )}
      {...props}
    >
      {/* Subtle Background Radial Depth Glows */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#E0F7FA]/70 via-[#F0FDFF]/50 to-transparent blur-3xl -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-48 w-96 h-96 bg-[#F7CE46]/10 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 -left-48 w-96 h-96 bg-[#4CA7B1]/10 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />

      {/* Top Navbar Header */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center size-10 rounded-2xl bg-[#F7CE46] text-[#1A4D5C] font-extrabold text-xl shadow-sm group-hover:scale-105 transition-transform duration-200">
            S
          </div>
          <div className="text-left">
            <span className="font-extrabold text-lg sm:text-xl text-[#1A4D5C] tracking-tight block leading-tight">
              SIMANTIK
            </span>
            <span className="text-[10px] sm:text-xs text-[#7A9099] font-medium tracking-wide">
              by educourse.id
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {navAction ?? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-xs font-semibold text-[#546A72] shadow-xs">
              <span className="size-2 rounded-full bg-[#28DE25] animate-pulse" />
              <span>Pengembangan Aktif</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center">
        <ComingSoonHero
          badgeText={badgeText}
          title={title}
          highlightText={highlightText}
          description={description}
          targetDate={targetDate}
          onSubscribe={onSubscribe}
        />

        {showFeatures && <ComingSoonFeatures />}
      </main>

      {/* Footer */}
      {showFooter && <ComingSoonFooter />}
    </div>
  );
}
