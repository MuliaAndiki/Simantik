import React from 'react';
import { AdminFilterBar } from '@/components/molecules/filter';

export type AdminUserFilterVariant = 'student' | 'content_manager';

export interface AdminUserFilterBarProps {
  variant?: AdminUserFilterVariant;
  searchPlaceholder?: string;
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

const DEFAULT_PLACEHOLDER: Record<AdminUserFilterVariant, string> = {
  student: 'Cari berdasarkan Nama Siswa atau Email...',
  content_manager: 'Cari berdasarkan Nama atau Email kurator...',
};

export const AdminUserFilterBar: React.FC<AdminUserFilterBarProps> = ({
  variant = 'student',
  searchPlaceholder,
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
      searchPlaceholder={searchPlaceholder ?? DEFAULT_PLACEHOLDER[variant]}
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

export default AdminUserFilterBar;
