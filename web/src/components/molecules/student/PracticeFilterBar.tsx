import type * as React from 'react';
import { StudentFilterBar } from '@/components/molecules/filter';

export interface PracticeCompetencyOption {
  value: string;
  label: string;
}

export interface PracticeFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCompetency: string;
  onCompetencyChange: (competency: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  competencyOptions?: PracticeCompetencyOption[];
  className?: string;
}

export const COMPETENCY_FILTER_OPTIONS: PracticeCompetencyOption[] = [
  { value: 'all', label: 'Semua Kompetensi' },
  { value: 'pemahaman-tekstual', label: 'Pemahaman Tekstual' },
  { value: 'pemahaman-inferensial', label: 'Pemahaman Inferensial' },
  { value: 'evaluasi-apresiasi', label: 'Evaluasi & Apresiasi' },
];

export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'belum-dikerjakan', label: 'Belum dikerjakan' },
  { value: 'sudah-dikerjakan', label: 'Sudah dikerjakan' },
] as const;

export function PracticeFilterBar({
  searchQuery,
  onSearchChange,
  selectedCompetency,
  onCompetencyChange,
  selectedStatus,
  onStatusChange,
  competencyOptions = COMPETENCY_FILTER_OPTIONS,
  className,
}: PracticeFilterBarProps) {
  return (
    <StudentFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Cari latihan atau topik bacaan..."
      selects={[
        {
          value: selectedCompetency,
          placeholder: 'Pilih Kompetensi',
          options: competencyOptions,
          onChange: onCompetencyChange,
        },
        {
          value: selectedStatus,
          placeholder: 'Pilih Status',
          widthClass: 'md:w-52',
          options: [...STATUS_FILTER_OPTIONS],
          onChange: onStatusChange,
        },
      ]}
      className={className}
    />
  );
}
