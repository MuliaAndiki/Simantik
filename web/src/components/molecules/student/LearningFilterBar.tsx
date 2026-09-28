import type * as React from 'react';
import { StudentFilterBar } from '@/components/molecules/filter';

export interface CompetencyOption {
  value: string;
  label: string;
}

export interface LearningFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCompetency: string;
  onCompetencyChange: (competency: string) => void;
  competencyOptions?: CompetencyOption[];
  className?: string;
}

export const COMPETENCY_OPTIONS: CompetencyOption[] = [
  { value: 'all', label: 'Semua Kompetensi' },
  { value: 'pemahaman-tekstual', label: 'Pemahaman Tekstual' },
  { value: 'pemahaman-inferensial', label: 'Pemahaman Inferensial' },
  { value: 'evaluasi-apresiasi', label: 'Evaluasi & Apresiasi' },
];

export function LearningFilterBar({
  searchQuery,
  onSearchChange,
  selectedCompetency,
  onCompetencyChange,
  competencyOptions = COMPETENCY_OPTIONS,
  className,
}: LearningFilterBarProps) {
  return (
    <StudentFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Cari materi Bahasa Indonesia..."
      selects={[
        {
          value: selectedCompetency,
          placeholder: 'Pilih Kompetensi',
          options: competencyOptions,
          onChange: onCompetencyChange,
        },
      ]}
      className={className}
    />
  );
}
