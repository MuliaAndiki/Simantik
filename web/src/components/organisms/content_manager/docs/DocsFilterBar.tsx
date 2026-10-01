import React from 'react';
import { ManagerFilterBar } from '@/components/molecules/filter';
import type { DocsFilterState } from '@/types/ui/content-manager';
import { DOCS_STATUS_FILTER_OPTIONS } from '@/types/ui/content-manager';

interface DocsFilterBarProps {
  filters: DocsFilterState;
  categoryOptions: { value: string; label: string }[];
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
}

export const DocsFilterBar: React.FC<DocsFilterBarProps> = ({
  filters,
  categoryOptions,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
}) => {
  return (
    <ManagerFilterBar
      search={filters.search}
      searchPlaceholder="Cari judul dokumen, topik, kategori..."
      onSearchChange={onSearchChange}
      selects={[
        {
          value: filters.status,
          options: DOCS_STATUS_FILTER_OPTIONS,
          minWidthClass: 'min-w-[150px]',
          onChange: onStatusChange,
        },
        {
          value: filters.category,
          options: categoryOptions,
          minWidthClass: 'min-w-[150px]',
          onChange: onCategoryChange,
        },
      ]}
    />
  );
};
