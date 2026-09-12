import { ListOrdered } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { cn } from '@/utils/classname';

export interface TocItem {
  id: string;
  number: string;
  title: string;
}

export interface LegalTableOfContentsProps {
  sections: TocItem[];
  activeSectionId?: string;
  onSelectSection?: (id: string) => void;
  sidebarQuestion?: {
    question: string;
    actionText: string;
    href: string;
  };
  className?: string;
}

export function LegalTableOfContents({
  sections,
  activeSectionId,
  onSelectSection,
  sidebarQuestion = {
    question: 'Punya pertanyaan hukum?',
    actionText: 'Kontak',
    href: 'mailto:kontak@simantik.id',
  },
  className,
}: LegalTableOfContentsProps) {
  return (
    <aside
      className={cn(
        'bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs sticky top-28',
        className
      )}
      aria-label="Daftar Isi"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-teal-50 text-teal-700">
            <ListOrdered className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-slate-800 text-sm tracking-tight">Daftar Isi</h2>
        </div>
        <span className="inline-flex items-center rounded-full bg-slate-100/90 text-slate-600 text-[11px] font-semibold px-2.5 py-0.5">
          {sections.length} Bagian
        </span>
      </div>

      {/* Nav List */}
      <nav className="max-h-[calc(100vh-320px)] overflow-y-auto space-y-0.5 pr-1 -mr-1 scroll-smooth">
        {sections.map((section) => {
          const isActive = activeSectionId === section.id;
          return (
            <button
              type="button"
              key={section.id}
              onClick={() => onSelectSection?.(section.id)}
              className={cn(
                'w-full flex items-center justify-between text-left py-2 px-2.5 rounded-xl text-xs transition-all group',
                isActive
                  ? 'bg-teal-50/90 text-teal-800 font-semibold shadow-2xs border border-teal-200/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal'
              )}
            >
              <span className="truncate pr-2 group-hover:translate-x-0.5 transition-transform duration-150">
                {parseInt(section.number, 10)}. {section.title}
              </span>
              <span
                className={cn(
                  'text-[10px] font-mono shrink-0 px-1.5 py-0.5 rounded-md transition-colors',
                  isActive
                    ? 'bg-teal-100/80 text-teal-700 font-bold'
                    : 'text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100'
                )}
              >
                {section.number}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Question Action */}
      {sidebarQuestion && (
        <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{sidebarQuestion.question}</span>
          <Link
            href={sidebarQuestion.href}
            className="text-teal-700 hover:text-teal-800 font-semibold hover:underline"
          >
            {sidebarQuestion.actionText}
          </Link>
        </div>
      )}
    </aside>
  );
}
