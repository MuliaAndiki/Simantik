import React from 'react';
import { ManagerFilterBar } from '@/components/molecules/filter';
import type { TutorialFilterState } from '@/types/ui/content-manager';
import { TUTORIAL_STATUS_FILTER_OPTIONS } from '@/types/ui/content-manager';

interface TutorialsFilterBarProps {
  filters: TutorialFilterState;
  categoryOptions: { value: string; label: string }[];
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
}

export const TutorialsFilterBar: React.FC<TutorialsFilterBarProps> = ({
  filters,
  categoryOptions,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
}) => {
  return (
    <ManagerFilterBar
      search={filters.search}
      searchPlaceholder="Cari judul video, kategori..."
      onSearchChange={onSearchChange}
      selects={[
        {
          value: filters.status,
          options: TUTORIAL_STATUS_FILTER_OPTIONS,
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
