import React from 'react';
import { AdminFilterBar } from '@/components/molecules/filter';

export interface AdminStudentFilterBarProps {
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

export const AdminStudentFilterBar: React.FC<AdminStudentFilterBarProps> = ({
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
      searchPlaceholder="Cari berdasarkan Nama Siswa atau Email..."
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

export default AdminStudentFilterBar;
