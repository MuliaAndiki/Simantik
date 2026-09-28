import { BookOpen, Edit3, FileText, HelpCircle } from 'lucide-react';
import React from 'react';
import { CardSkeleton } from '@/components/atoms/loading';
import type { ContentStatusBreakdown } from '@/types/service';
import { cn } from '@/utils/classname';

export interface AdminDashboardContentStatusProps {
  materials?: ContentStatusBreakdown;
  practices?: ContentStatusBreakdown;
  tryouts?: ContentStatusBreakdown;
  isLoading?: boolean;
  className?: string;
}

export const AdminDashboardContentStatus: React.FC<AdminDashboardContentStatusProps> = ({
  materials,
  practices,
  tryouts,
  isLoading,
  className,
}) => {
  if (isLoading) return <CardSkeleton lines={4} className={className} />;
  const materialData = materials ?? {
    total: 0,
    published: 0,
    review: 0,
    draft: 0,
  };

  const practiceData = practices ?? {
    total: 0,
    published: 0,
    review: 0,
    draft: 0,
  };

  const tryoutData = tryouts ?? {
    total: 0,
    published: 0,
    review: 0,
    draft: 0,
  };

  const items = [
    {
      id: 'materials',
      title: 'Materi Modul',
      icon: BookOpen,
      iconColor: 'text-amber-600',
      totalLabel: `${materialData.total} Total`,
      published: materialData.published,
      review: materialData.review,
      draft: materialData.draft,
    },
    {
      id: 'practices',
      title: 'Paket Soal Latihan',
      icon: HelpCircle,
      iconColor: 'text-teal-600',
      totalLabel: `${practiceData.total} Paket`,
      published: practiceData.published,
      review: practiceData.review,
      draft: practiceData.draft,
    },
    {
      id: 'tryouts',
      title: 'Paket Tryout',
      icon: FileText,
      iconColor: 'text-purple-600',
      totalLabel: `${tryoutData.total} Paket`,
      published: tryoutData.published,
      review: tryoutData.review,
      draft: tryoutData.draft,
    },
  ];

  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 flex flex-col justify-between select-none',
        className
      )}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Status Konten</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Kurasi modul, butir soal, dan jadwal ujian
            </p>
          </div>
          <div className="text-teal-600 p-1.5 rounded-lg bg-teal-50/70 border border-teal-100">
            <Edit3 className="size-4" />
          </div>
        </div>

        {/* Content Items List */}
        <div className="space-y-3 mt-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/40 hover:bg-slate-50/80 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={cn('size-4 shrink-0', item.iconColor)} />
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{item.totalLabel}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200/70 font-semibold text-slate-700 text-[11px]">
                    <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{item.published} Published</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200/70 font-semibold text-slate-700 text-[11px]">
                    <span className="size-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{item.review} Review</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200/70 font-semibold text-slate-700 text-[11px]">
                    <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
                    <span>{item.draft} Draft</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContentStatus;
