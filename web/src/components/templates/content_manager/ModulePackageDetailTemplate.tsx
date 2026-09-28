import React from 'react';
import {
  ModulePackageHeader,
  ModulePackageMaterialsTable,
} from '@/components/organisms/content_manager/module_detail';
import type { LearningModuleDetailResponse, MaterialResponse } from '@/types/service';

export interface ModulePackageDetailTemplateProps {
  module: LearningModuleDetailResponse | null;
  materials: MaterialResponse[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onBack: () => void;
  onCreateMaterial: () => void;
  onViewActivities: (material: MaterialResponse) => void;
  onEditMaterial: (material: MaterialResponse) => void;
  onDownloadMaterial?: (material: MaterialResponse) => void;
  onDeleteMaterial: (material: MaterialResponse) => void;
  isLoading?: boolean;
}

export const ModulePackageDetailTemplate: React.FC<ModulePackageDetailTemplateProps> = ({
  module,
  materials,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onBack,
  onCreateMaterial,
  onViewActivities,
  onEditMaterial,
  onDownloadMaterial,
  onDeleteMaterial,
  isLoading = false,
}) => {
  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      {/* 1. Header with Module Overview */}
      <ModulePackageHeader module={module} onBack={onBack} onCreateMaterial={onCreateMaterial} />

      {/* 2. Materials Table with 3-dots actions */}
      <ModulePackageMaterialsTable
        materials={materials}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        currentPage={currentPage}
        totalItems={totalItems}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onViewActivities={onViewActivities}
        onEditMaterial={onEditMaterial}
        onDownloadMaterial={onDownloadMaterial}
        onDeleteMaterial={onDeleteMaterial}
        onCreateMaterial={onCreateMaterial}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ModulePackageDetailTemplate;
