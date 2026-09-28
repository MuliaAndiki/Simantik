import React from 'react';
import { ManagerFilterBar } from '@/components/molecules/filter';
import type { NewsFilterState } from '@/types/ui/content-manager';
import { NEWS_STATUS_FILTER_OPTIONS } from '@/types/ui/content-manager';

interface NewsFilterBarProps {
  filters: NewsFilterState;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
}

export const NewsFilterBar: React.FC<NewsFilterBarProps> = ({
  filters,
  onSearchChange,
  onStatusChange,
}) => {
  return (
    <ManagerFilterBar
      search={filters.search}
      searchPlaceholder="Cari judul artikel, topik, penulis..."
      onSearchChange={onSearchChange}
      selects={[
        {
          value: filters.status,
          options: NEWS_STATUS_FILTER_OPTIONS,
          minWidthClass: 'min-w-[150px]',
          onChange: onStatusChange,
        },
      ]}
    />
  );
};
