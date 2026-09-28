import type * as React from 'react';
import type { PracticeCompetencyOption } from '@/components/molecules/student/PracticeFilterBar';
import type { PracticePackageItem } from '@/components/molecules/student/PracticePackageCard';
import type { PracticePreStartModalProps } from '@/components/organisms/student';
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
  isLoading?: boolean;
  onStartPractice?: (packageId: string) => void;
  onViewResult?: (packageId: string, latestAttemptId?: string) => void;
  onRetryPractice?: (packageId: string) => void;
  onResetFilters?: () => void;
  isFiltered?: boolean;
  preStartModalProps?: PracticePreStartModalProps;
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
  isLoading,
  onStartPractice,
  onViewResult,
  onRetryPractice,
  onResetFilters,
  isFiltered = false,
  preStartModalProps,
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
        isLoading,
        onStartPractice,
        onViewResult,
        onRetryPractice,
        onResetFilters,
        isFiltered,
      }}
      preStartModalProps={preStartModalProps}
    />
  );
}

export default StudentPracticePage;
