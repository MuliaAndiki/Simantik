import React from 'react';
import { JENJANG_FILTER_OPTIONS, ManagerFilterBar } from '@/components/molecules/filter';
import type { MaterialFilterState } from '@/types/ui/material-manager.types';

const MATERIAL_STATUSES = ['Semua Status', 'Published', 'In Review', 'Draft'];

interface MaterialFilterBarProps {
  filters: MaterialFilterState;
  totalItems: number;
  displayedCount: number;
  onSearchChange: (val: string) => void;
  onJenjangChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const MaterialFilterBar: React.FC<MaterialFilterBarProps> = ({
  filters,
  totalItems,
  displayedCount,
  onSearchChange,
  onJenjangChange,
  onStatusChange,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <ManagerFilterBar
      search={filters.search}
      searchPlaceholder="Cari judul materi, bab, ID..."
      onSearchChange={onSearchChange}
      selects={[
        { value: filters.jenjang, options: JENJANG_FILTER_OPTIONS, onChange: onJenjangChange },
        { value: filters.status, options: MATERIAL_STATUSES, onChange: onStatusChange },
      ]}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
      counter={`Menampilkan 1-${displayedCount} dari ${totalItems} Materi`}
    />
  );
};
