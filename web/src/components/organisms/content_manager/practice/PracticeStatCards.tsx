import { BadgeCheck, EyeOff, FileEdit, Layers } from 'lucide-react';
import React from 'react';
import { StatGrid } from '@/components/molecules/stat';
import type { PracticeStats } from '@/types/ui/practice-manager.types';

export interface PracticeStatCardsProps {
  stats: PracticeStats;
}

export const PracticeStatCards: React.FC<PracticeStatCardsProps> = React.memo(({ stats }) => {
  return (
    <StatGrid
      items={[
        {
          key: 'total',
          label: 'Total Paket',
          value: stats.totalPackages,
          subtext: 'Semua kategori TKA',
          icon: Layers,
          iconBoxClass: 'bg-[#EAF6F8] text-[#0E7490]',
        },
        {
          key: 'draft',
          label: 'Draft',
          value: stats.draftCount,
          subtext: 'Dalam tahap kurasi',
          icon: FileEdit,
          iconBoxClass: 'bg-[#FEF6E8] text-[#F5B731]',
        },
        {
          key: 'published',
          label: 'Published',
          value: stats.publishedCount,
          subtext: 'Aktif diakses siswa',
          icon: BadgeCheck,
          iconBoxClass: 'bg-[#E8F8F3] text-[#10B981]',
        },
        {
          key: 'unpublished',
          label: 'Unpublished',
          value: stats.unpublishedCount,
          subtext: 'Nonaktif sementara',
          icon: EyeOff,
          iconBoxClass: 'bg-[#F1F5F9] text-[#64748B]',
        },
      ]}
    />
  );
});

PracticeStatCards.displayName = 'PracticeStatCards';

export default PracticeStatCards;
