import type React from 'react';
import { JENJANG_FILTER_OPTIONS, ManagerFilterBar } from '@/components/molecules/filter';
import {
  CompetencyCreatableSelect,
  type CompetencyDropdownActionProps,
} from '@/components/molecules/input/CompetencyCreatableSelect';
import type { PracticeFilterState } from '@/types/ui/practice-manager.types';
import {
  ALL_COMPETENCY_FILTER_VALUE,
  type CompetencyOptionItem,
  UNCATEGORIZED_COMPETENCY_FILTER_VALUE,
} from '@/utils/competency.util';

export type PracticeManagerCompetencyOption = CompetencyOptionItem;

export interface PracticeManagerFilterBarProps extends CompetencyDropdownActionProps {
  filters: PracticeFilterState;

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
  onCreateCompetency,
  onRequestDeleteCompetency,
  isCreatingCompetency = false,
  deletingCompetencyId = null,
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
          value: filters.quota,
          options: QUOTA_OPTIONS,
          minWidthClass: 'min-w-[140px]',
          onChange: onQuotaChange,
        },
      ]}
      extraFilters={
        <div className="w-full sm:w-auto sm:min-w-[210px]">
          <CompetencyCreatableSelect
            compact
            value={filters.competencyId}
            onChange={(val) => onCompetencyChange(val)}
            competencies={competencies}
            allowNone={false}
            allOptionValue={ALL_COMPETENCY_FILTER_VALUE}
            allOptionLabel="Semua Kompetensi"
            uncategorizedOptionValue={UNCATEGORIZED_COMPETENCY_FILTER_VALUE}
            uncategorizedOptionLabel="Tanpa Kompetensi"
            onCreateCompetency={onCreateCompetency}
            onRequestDeleteCompetency={onRequestDeleteCompetency}
            isCreatingCompetency={isCreatingCompetency}
            deletingCompetencyId={deletingCompetencyId}
          />
        </div>
      }
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
      className="xl:flex-row xl:items-center"
    />
  );
};
