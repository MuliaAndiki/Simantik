import { Archive, Calendar, CheckCircle2, Edit3 } from 'lucide-react';
import React from 'react';
import { StatGrid } from '@/components/molecules/stat';
import type { NewsStats } from '@/types/ui/content-manager';

interface NewsSummaryCardsProps {
  stats: NewsStats;
}

export const NewsSummaryCards: React.FC<NewsSummaryCardsProps> = ({ stats }) => {
  return (
    <StatGrid
      colsClassName="md:grid-cols-2 lg:grid-cols-4"
      items={[
        {
          key: 'total',
          label: 'Total Artikel',
          value: (
            <span className="inline-flex items-baseline gap-2">
              {stats.total}
              {stats.totalChange && (
                <span className="text-[11px] font-semibold text-cyan-600">{stats.totalChange}</span>
              )}
            </span>
          ),
          valueClass: 'text-2xl font-bold text-slate-800',
          icon: Calendar,
          iconBoxClass: 'w-10 h-10 rounded-full bg-[#F4FBFA] text-cyan-600',
          iconClass: 'w-5 h-5',
        },
        {
          key: 'published',
          label: 'Published',
          value: stats.published,
          subtext: 'Aktif di Portal Siswa',
          valueClass: 'text-2xl font-bold text-slate-800',
          icon: CheckCircle2,
          iconBoxClass: 'w-10 h-10 rounded-full bg-[#E8F8F3] text-emerald-600',
          iconClass: 'w-5 h-5',
        },
        {
          key: 'draft',
          label: 'Draft',
          value: stats.draft,
          subtext: 'Tahap Penulisan',
          valueClass: 'text-2xl font-bold text-slate-800',
          icon: Edit3,
          iconBoxClass: 'w-10 h-10 rounded-full bg-[#FEF7EB] text-amber-500',
          iconClass: 'w-5 h-5',
        },
        {
          key: 'unpublished',
          label: 'Unpublished',
          value: stats.unpublished,
          subtext: 'Diarsipkan / Kedaluwarsa',
          valueClass: 'text-2xl font-bold text-slate-800',
          icon: Archive,
          iconBoxClass: 'w-10 h-10 rounded-full bg-rose-50 text-rose-500',
          iconClass: 'w-5 h-5',
        },
      ]}
    />
  );
};
