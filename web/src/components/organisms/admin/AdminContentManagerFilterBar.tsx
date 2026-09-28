import React from 'react';
import { AdminFilterBar } from '@/components/molecules/filter';

export interface AdminContentManagerFilterBarProps {
  search: string;
  statusFilter: string;
  isRefreshing?: boolean;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onRefresh: () => void;
  className?: string;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'active', label: 'Aktif' },
  { value: 'suspended', label: 'Ditangguhkan' },
  { value: 'inactive', label: 'Nonaktif' },
];

export const AdminContentManagerFilterBar: React.FC<AdminContentManagerFilterBarProps> = ({
  search,
  statusFilter,
  isRefreshing = false,
  onSearchChange,
  onStatusChange,
  onRefresh,
  className,
}) => {
  return (
    <AdminFilterBar
      search={search}
      searchPlaceholder="Cari berdasarkan Nama atau Email kurator..."
      onSearchChange={onSearchChange}
      selects={[
        {
          value: statusFilter,
          placeholder: 'Status Akun',
          options: STATUS_OPTIONS,
          onChange: onStatusChange,
        },
      ]}
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
      className={className}
    />
  );
};

export default AdminContentManagerFilterBar;
