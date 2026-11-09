import { FileText } from 'lucide-react';
import type * as React from 'react';
import { Card } from '@/components/atoms/card';
import { RichHtml } from '@/components/atoms/rich-html';
import { Skeleton } from '@/components/atoms/skeleton';
import { cn } from '@/utils/classname';

export interface LearningDetailContentCardProps {
  content?: string;
  isLoading?: boolean;
  className?: string;
}

export function LearningDetailContentCard({
  content,
  isLoading = false,
  className,
}: LearningDetailContentCardProps) {
  const hasContent = Boolean(content && content.trim().length > 0);

  return (
    <Card
      className={cn(
        'p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border border-[#E5E7EB] bg-white shadow-xs space-y-6',
        className
      )}
    >
      {/* Section Header */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">Materi</h2>
        <p className="text-xs sm:text-sm text-[#546A72]">
          Area baca terstruktur disesuaikan untuk dokumen modul kurikulum CMS sekolah.
        </p>
      </div>

      <div className="border-b border-[#E5E7EB]" />

      {/* Content Body */}
      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/3 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>

          <div className="rounded-2xl border border-slate-200/80 p-5 bg-slate-50/60 space-y-2.5">
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>

          <div className="space-y-3 pt-2">
            <Skeleton className="h-6 w-1/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-11/12 rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>
        </div>
      ) : hasContent ? (
        <div className="text-[#374151] leading-relaxed text-sm sm:text-base">
          <RichHtml html={content} />
        </div>
      ) : (
        <div className="py-12 px-4 rounded-2xl border border-dashed border-slate-200 text-center space-y-2.5 bg-slate-50/50">
          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">Belum Ada Konten Materi</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Materi ini belum memiliki uraian materi dari kurikulum sekolah.
          </p>
        </div>
      )}
    </Card>
  );
}

export default LearningDetailContentCard;
