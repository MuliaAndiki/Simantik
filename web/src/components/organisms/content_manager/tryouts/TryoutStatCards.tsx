import { CalendarClock, EyeOff, FileCheck2, ShieldCheck } from 'lucide-react';
import type React from 'react';
import { StatGrid } from '@/components/molecules/stat';
import type { TryoutStats } from '@/types/ui/tryout-manager.types';

export interface TryoutStatCardsProps {
  stats: TryoutStats;
}

export const TryoutStatCards: React.FC<TryoutStatCardsProps> = ({ stats }) => {
  return (
    <StatGrid
      items={[
        {
          key: 'total',
          label: 'Total Paket',
          value: stats.totalTryouts,
          subtext: 'Semua paket simulasi',
          icon: FileCheck2,
          iconBoxClass: 'bg-[#EAF6F8] text-[#0E7490]',
        },
        {
          key: 'draft',
          label: 'Draft',
          value: stats.draftCount,
          subtext: 'Konfigurasi naskah',
          icon: CalendarClock,
          iconBoxClass: 'bg-[#FEF6E8] text-[#F5B731]',
        },
        {
          key: 'published',
          label: 'Published',
          value: stats.publishedCount,
          subtext: 'Aktif di portal siswa',
          icon: ShieldCheck,
          iconBoxClass: 'bg-[#E8F8F3] text-[#10B981]',
        },
        {
          key: 'unpublished',
          label: 'Unpublished',
          value: stats.unpublishedCount,
          subtext: 'Akses ditutup sementara',
          icon: EyeOff,
          iconBoxClass: 'bg-[#F1F5F9] text-[#64748B]',
        },
      ]}
    />
  );
};

export default TryoutStatCards;
