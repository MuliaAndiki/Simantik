import React from 'react';
import { AdminFilterBar } from '@/components/molecules/filter';

export interface AdminSchoolFilterBarProps {
  search: string;
  jenjangFilter: string;
  statusFilter: string;
  verificationFilter?: string;
  isRefreshing?: boolean;
  onSearchChange: (val: string) => void;
  onJenjangChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onVerificationChange?: (val: string) => void;
  onRefresh: () => void;
  className?: string;
}

const JENJANG_OPTIONS = [
  { value: 'all', label: 'Semua Jenjang' },
  { value: 'sma', label: 'SMA' },
  { value: 'smk', label: 'SMK' },
  { value: 'smp', label: 'SMP' },
  { value: 'sd', label: 'SD' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'negeri', label: 'Negeri' },
  { value: 'swasta', label: 'Swasta' },
];

const VERIFICATION_OPTIONS = [
  { value: 'all', label: 'Semua Verifikasi' },
  { value: 'pending', label: 'Menunggu Verifikasi' },
  { value: 'verified', label: 'Terverifikasi' },
  { value: 'rejected', label: 'Ditolak' },
];

export const AdminSchoolFilterBar: React.FC<AdminSchoolFilterBarProps> = ({
  search,
  jenjangFilter,
  statusFilter,
  verificationFilter = 'all',
  isRefreshing = false,
  onSearchChange,
  onJenjangChange,
  onStatusChange,
  onVerificationChange,
  onRefresh,
  className,
}) => {
  const selects = [
    {
      value: jenjangFilter,
      placeholder: 'Semua Jenjang',
      widthClass: 'w-[140px]',
      options: JENJANG_OPTIONS,
      onChange: onJenjangChange,
    },
    {
      value: statusFilter,
      placeholder: 'Semua Status',
      widthClass: 'w-[140px]',
      options: STATUS_OPTIONS,
      onChange: onStatusChange,
    },
  ];

  if (onVerificationChange) {
    selects.push({
      value: verificationFilter,
      placeholder: 'Semua Verifikasi',
      widthClass: 'w-[175px]',
      options: VERIFICATION_OPTIONS,
      onChange: onVerificationChange,
    });
  }

  return (
    <AdminFilterBar
      search={search}
      searchPlaceholder="Cari berdasarkan NPSN, Nama Sekolah, atau Wilayah..."
      onSearchChange={onSearchChange}
      selects={selects}
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
      className={className}
    />
  );
};

export default AdminSchoolFilterBar;
