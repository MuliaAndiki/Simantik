import React from 'react';
import { StatGrid } from '@/components/molecules/stat';
import { cn } from '@/utils/classname';

export interface AdminSchoolStatCardsProps {
  total: number;
  negeri: number;
  swasta: number;
  smaCount: number;
  smkCount: number;
  pending?: number;
  verified?: number;
  rejected?: number;
  className?: string;
}

export const AdminSchoolStatCards: React.FC<AdminSchoolStatCardsProps> = ({
  total,
  negeri,
  swasta,
  smaCount,
  smkCount,
  pending = 0,
  verified = 0,
  rejected = 0,
  className,
}) => {
  return (
    <StatGrid
      colsClassName="sm:grid-cols-4 sm:gap-5 grid-cols-2"
      className={cn(className)}
      items={[
        {
          key: 'total',
          label: 'Total Terdaftar',
          value: total,
          subtext: `${negeri} Negeri • ${swasta} Swasta (${smaCount} SMA / ${smkCount} SMK)`,
        },
        {
          key: 'pending',
          label: 'Menunggu Verifikasi',
          value: pending,
          subtext: 'Pengajuan baru dari siswa',
          valueClass: 'text-amber-600',
        },
        {
          key: 'verified',
          label: 'Terverifikasi',
          value: verified,
          subtext: 'Tampil di pencarian publik',
          valueClass: 'text-emerald-600',
        },
        {
          key: 'rejected',
          label: 'Ditolak',
          value: rejected,
          subtext: 'Perlu perbaikan data pengaju',
          valueClass: 'text-rose-600',
        },
      ]}
    />
  );
};

export default AdminSchoolStatCards;
