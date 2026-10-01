import Link from 'next/link';
import type * as React from 'react';
import {
  LegalTableOfContents,
  type TocItem,
} from '@/components/molecules/legal/LegalTableOfContents';
import { LegalDocFooter } from '@/components/organisms/legal/LegalDocFooter';
import { LegalDocNavbar } from '@/components/organisms/legal/LegalDocNavbar';
import { LegalHeroHeader } from '@/components/organisms/legal/LegalHeroHeader';
import { LegalSectionCard } from '@/components/organisms/legal/LegalSectionCard';
import type { LegalDocData } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface LegalDocTemplateProps {
  data: LegalDocData;
  activeRoute: '/help' | '/privacy' | '/terms';
  activeSectionId?: string;
  onSelectSection?: (id: string) => void;
  onPrint?: () => void;
}

export function LegalDocTemplate({
  data,
  activeRoute,
  activeSectionId,
  onSelectSection,
  onPrint,
}: LegalDocTemplateProps) {
  const tocItems: TocItem[] = data.sections.map((sec) => ({
    id: sec.id,
    number: sec.number,
    title: sec.title,
  }));

  const navTabs = [
    { label: 'Bantuan', href: '/help', route: '/help' as const },
    { label: 'Kebijakan Privasi', href: '/privacy', route: '/privacy' as const },
    { label: 'Syarat & Ketentuan', href: '/terms', route: '/terms' as const },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col justify-between text-slate-800 selection:bg-teal-100 selection:text-teal-900">
      {/* Top Main Navbar */}
      <LegalDocNavbar />

      {/* Main Container */}
      <main className="max-w-7xl w-fit mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {/* Mobile Route Switcher Tabs */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none print:hidden">
          {navTabs.map((tab) => {
            const isActive = activeRoute === tab.route;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-medium transition-all',
                  isActive
                    ? 'bg-[#EBF7F6] text-teal-900 font-bold border border-teal-200/70 shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* 2-Column Desktop Grid */}
        <div className="flex flex-col md:flex-row items-start gap-6 lg:gap-8">
          {/* Left Column (Desktop Tabs + Sticky TOC) */}
          <div className="w-full md:w-64 lg:w-72 shrink-0 space-y-5 print:hidden">
            {/* Desktop Vertical Nav Tabs */}
            <div className="hidden md:flex flex-col space-y-1.5 p-1.5 rounded-2xl bg-white/70 border border-slate-200/60 shadow-2xs">
              {navTabs.map((tab) => {
                const isActive = activeRoute === tab.route;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={cn(
                      'px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-medium transition-all text-left block',
                      isActive
                        ? 'bg-[#EBF7F6] text-teal-900 font-bold shadow-2xs border border-teal-200/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    )}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>

            {/* Sticky Table of Contents */}
            <LegalTableOfContents
              sections={tocItems}
              activeSectionId={activeSectionId}
              onSelectSection={onSelectSection}
              sidebarQuestion={data.sidebarQuestion}
            />
          </div>

          {/* Right Column (Hero Header + Sections) */}
          <div className="flex-1 min-w-0 space-y-6 w-full">
            {/* Hero Header */}
            <LegalHeroHeader
              title={data.title}
              lastUpdated={data.lastUpdated}
              greeting={data.intro.greeting}
              paragraphs={data.intro.paragraphs}
              highlightCallout={data.intro.highlightCallout}
              onPrint={onPrint}
            />

            {/* Section Cards */}
            <div className="space-y-6">
              {data.sections.map((sec) => (
                <LegalSectionCard key={sec.id} section={sec} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <LegalDocFooter activeRoute={activeRoute} />
    </div>
  );
}
