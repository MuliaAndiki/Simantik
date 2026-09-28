import type * as React from 'react';
import type { CompetencyOption } from '@/components/molecules/student/LearningFilterBar';
import type { LearningMaterialItem } from '@/components/molecules/student/LearningMaterialItemCard';
import { StudentLearningTemplate } from '@/components/templates/student/StudentLearningTemplate';

export interface StudentLearningPageProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCompetency: string;
  onCompetencyChange: (competency: string) => void;
  competencyOptions?: CompetencyOption[];
  materials: LearningMaterialItem[];
  isLoading?: boolean;
  onLearnMaterial?: (materialId: string) => void;
  onResetFilters?: () => void;
  isFiltered?: boolean;
}

export function StudentLearningPage({
  searchQuery,
  onSearchChange,
  selectedCompetency,
  onCompetencyChange,
  competencyOptions,
  materials,
  isLoading,
  onLearnMaterial,
  onResetFilters,
  isFiltered = false,
}: StudentLearningPageProps) {
  return (
    <StudentLearningTemplate
      filterProps={{
        searchQuery,
        onSearchChange,
        selectedCompetency,
        onCompetencyChange,
        competencyOptions,
      }}
      materialsProps={{
        materials,
        isLoading,
        onLearnMaterial,
        onResetFilters,
        isFiltered,
      }}
    />
  );
}

export default StudentLearningPage;
