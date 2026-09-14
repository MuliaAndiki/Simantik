import type * as React from 'react';
import type { PracticeCompetencyOption } from '@/components/molecules/student/PracticeFilterBar';
import type { PracticePackageItem } from '@/components/molecules/student/PracticePackageCard';
import { StudentPracticeTemplate } from '@/components/templates/student/StudentPracticeTemplate';

export interface StudentPracticePageProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCompetency: string;
  onCompetencyChange: (competency: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  competencyOptions?: PracticeCompetencyOption[];
  packages: PracticePackageItem[];
  totalAllPackages?: number;
  onStartPractice?: (packageId: string) => void;
  onViewResult?: (packageId: string) => void;
  onRetryPractice?: (packageId: string) => void;
  onResetFilters?: () => void;
  isFiltered?: boolean;
}

export function StudentPracticePage({
  searchQuery,
  onSearchChange,
  selectedCompetency,
  onCompetencyChange,
  selectedStatus,
  onStatusChange,
  competencyOptions,
  packages,
  totalAllPackages,
  onStartPractice,
  onViewResult,
  onRetryPractice,
  onResetFilters,
  isFiltered = false,
}: StudentPracticePageProps) {
  return (
    <StudentPracticeTemplate
      filterProps={{
        searchQuery,
        onSearchChange,
        selectedCompetency,
        onCompetencyChange,
        selectedStatus,
        onStatusChange,
        competencyOptions,
      }}
      packagesProps={{
        packages,
        totalAllPackages,
        onStartPractice,
        onViewResult,
        onRetryPractice,
        onResetFilters,
        isFiltered,
      }}
    />
  );
}

export default StudentPracticePage;
