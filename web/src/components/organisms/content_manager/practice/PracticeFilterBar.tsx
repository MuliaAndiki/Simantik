import type React from 'react';
import { JENJANG_FILTER_OPTIONS, ManagerFilterBar } from '@/components/molecules/filter';
import type { PracticeFilterState } from '@/types/ui/practice-manager.types';

export interface PracticeManagerCompetencyOption {
  id: string;
  name: string;
}

export interface PracticeManagerFilterBarProps {
  filters: PracticeFilterState;
  competencies?: PracticeManagerCompetencyOption[];

  onSearchChange: (val: string) => void;
  onJenjangChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onCompetencyChange: (val: string) => void;
  onQuotaChange: (val: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

const STATUS_OPTIONS = ['Semua Status', 'Published', 'Draft', 'Unpublished'];
const QUOTA_OPTIONS = ['Semua Kuota Soal', '< 20 Soal', '20 - 30 Soal', '> 30 Soal'];

export const PracticeManagerFilterBar: React.FC<PracticeManagerFilterBarProps> = ({
  filters,
  competencies = [],
  onSearchChange,
  onJenjangChange,
  onStatusChange,
  onCompetencyChange,
  onQuotaChange,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <ManagerFilterBar
      search={filters.search}
      searchPlaceholder="Cari nama paket latihan..."
      onSearchChange={onSearchChange}
      selects={[
        { value: filters.jenjang, options: JENJANG_FILTER_OPTIONS, onChange: onJenjangChange },
        { value: filters.status, options: STATUS_OPTIONS, onChange: onStatusChange },
        {
          value: filters.competencyId,
          options: [
            { value: 'Semua Kompetensi', label: 'Semua Kompetensi' },
            ...competencies.map((comp) => ({ value: comp.id, label: comp.name })),
          ],
          minWidthClass: 'min-w-[160px]',
          onChange: onCompetencyChange,
        },
        {
          value: filters.quota,
          options: QUOTA_OPTIONS,
          minWidthClass: 'min-w-[140px]',
          onChange: onQuotaChange,
        },
      ]}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
      className="xl:flex-row xl:items-center"
    />
  );
};
