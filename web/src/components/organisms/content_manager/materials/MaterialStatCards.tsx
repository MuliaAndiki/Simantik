import { BookOpen, CheckCircle2, ClipboardCheck, FileEdit } from 'lucide-react';
import React from 'react';
import { StatGrid } from '@/components/molecules/stat';
import type { MaterialStats } from '@/types/ui/material-manager.types';

interface MaterialStatCardsProps {
  stats: MaterialStats;
}

export const MaterialStatCards: React.FC<MaterialStatCardsProps> = ({ stats }) => {
  return (
    <StatGrid
      items={[
        {
          key: 'total',
          label: 'Total Materi',
          value: stats.totalMaterials,
          subtext: 'Semua unit terdaftar',
          icon: BookOpen,
          iconBoxClass: 'bg-[#EAF6F8] text-[#0E7490]',
        },
        {
          key: 'draft',
          label: 'Draft',
          value: stats.draftCount,
          subtext: 'Tahap penyusunan',
          icon: FileEdit,
          iconBoxClass: 'bg-[#FEF6E8] text-[#F5B731]',
        },
        {
          key: 'review',
          label: 'Review',
          value: stats.reviewCount,
          subtext: 'Menunggu verifikasi',
          icon: ClipboardCheck,
          iconBoxClass: 'bg-[#EBF7FB] text-[#0284C7]',
        },
        {
          key: 'published',
          label: 'Published',
          value: stats.publishedCount,
          subtext: 'Aktif dipelajari siswa',
          icon: CheckCircle2,
          iconBoxClass: 'bg-[#E8F8F3] text-[#10B981]',
        },
      ]}
    />
  );
};
