import React from 'react';
import { StatGrid } from '@/components/molecules/stat';
import { cn } from '@/utils/classname';

export interface AdminSchoolStatCardsProps {
  total: number;
  negeri: number;
  swasta: number;
  smaCount: number;
  smkCount: number;
  className?: string;
}

export const AdminSchoolStatCards: React.FC<AdminSchoolStatCardsProps> = ({
  total,
  negeri,
  swasta,
  smaCount,
  smkCount,
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
          subtext: 'Seluruh jenjang sekolah',
        },
        {
          key: 'negeri',
          label: 'Sekolah Negeri',
          value: negeri,
          subtext: 'Status kepemilikan negeri',
          valueClass: 'text-emerald-600',
        },
        {
          key: 'swasta',
          label: 'Sekolah Swasta',
          value: swasta,
          subtext: 'Status kepemilikan swasta',
          valueClass: 'text-sky-600',
        },
        {
          key: 'sma-smk',
          label: 'SMA / SMK',
          value: (
            <>
              {smaCount} <span className="text-sm font-semibold text-slate-400">/ {smkCount}</span>
            </>
          ),
          subtext: 'Jenjang sekolah lanjutan',
          valueClass: 'text-teal-700',
        },
      ]}
    />
  );
};

export default AdminSchoolStatCards;
