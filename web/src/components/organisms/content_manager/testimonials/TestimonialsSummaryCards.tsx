import { CheckCircle2, Clock, Layers, XCircle } from 'lucide-react';
import React from 'react';
import { StatGrid } from '@/components/molecules/stat';
import type { TestimonialsStats } from '@/types/ui/content-manager';

interface TestimonialsSummaryCardsProps {
  stats: TestimonialsStats;
}

export const TestimonialsSummaryCards: React.FC<TestimonialsSummaryCardsProps> = ({ stats }) => {
  return (
    <StatGrid
      colsClassName="md:grid-cols-2 lg:grid-cols-4"
      items={[
        {
          key: 'total',
          label: 'Total Testimoni',
          value: stats.total,
          subtext: 'Semua status moderasi',
          valueClass: 'text-2xl font-bold text-slate-800',
          icon: Layers,
          iconBoxClass: 'w-10 h-10 rounded-full bg-[#F4FBFA] text-cyan-600',
          iconClass: 'w-5 h-5',
        },
        {
          key: 'pending',
          label: 'Menunggu Review',
          value: stats.pending,
          subtext: 'Perlu dimoderasi',
          valueClass: 'text-2xl font-bold text-slate-800',
          icon: Clock,
          iconBoxClass: 'w-10 h-10 rounded-full bg-[#FEF7EB] text-amber-500',
          iconClass: 'w-5 h-5',
        },
        {
          key: 'approved',
          label: 'Disetujui',
          value: stats.approved,
          subtext: 'Tampil di landing page',
          valueClass: 'text-2xl font-bold text-slate-800',
          icon: CheckCircle2,
          iconBoxClass: 'w-10 h-10 rounded-full bg-[#E8F8F3] text-emerald-600',
          iconClass: 'w-5 h-5',
        },
        {
          key: 'rejected',
          label: 'Ditolak',
          value: stats.rejected,
          subtext: 'Tidak ditampilkan',
          valueClass: 'text-2xl font-bold text-slate-800',
          icon: XCircle,
          iconBoxClass: 'w-10 h-10 rounded-full bg-rose-50 text-rose-500',
          iconClass: 'w-5 h-5',
        },
      ]}
    />
  );
};
