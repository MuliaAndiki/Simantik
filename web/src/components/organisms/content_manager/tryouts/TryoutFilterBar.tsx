import React from 'react';
import { JENJANG_FILTER_OPTIONS, ManagerFilterBar } from '@/components/molecules/filter';
import type { TryoutFilterState } from '@/types/ui/tryout-manager.types';

export interface TryoutFilterBarProps {
  filters: TryoutFilterState;
  totalItems: number;
  displayedCount: number;
  onSearchChange: (val: string) => void;
  onJenjangChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

const STATUS_OPTIONS = ['Semua Status', 'Published', 'Draft', 'Unpublished'];

export const TryoutFilterBar: React.FC<TryoutFilterBarProps> = ({
  filters,
  totalItems,
  displayedCount,
  onSearchChange,
  onJenjangChange,
  onStatusChange,
  onRefresh,
  isRefreshing = false,
}) => {
  const startItem = totalItems === 0 ? 0 : (filters.page - 1) * filters.perPage + 1;
  const endItem = Math.min(startItem + displayedCount - 1, totalItems);

  return (
    <ManagerFilterBar
      search={filters.search}
      searchPlaceholder="Cari nama tryout, kode..."
      onSearchChange={onSearchChange}
      selects={[
        { value: filters.jenjang, options: JENJANG_FILTER_OPTIONS, onChange: onJenjangChange },
        { value: filters.status, options: STATUS_OPTIONS, onChange: onStatusChange },
      ]}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
      counter={`Menampilkan ${startItem}–${endItem} dari ${totalItems} paket`}
      searchWrapClassName="min-w-[240px]"
    />
  );
};
