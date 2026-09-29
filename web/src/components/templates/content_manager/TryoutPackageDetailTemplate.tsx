import React from 'react';
import {
  TryoutDetailHeader,
  TryoutMetadataAndCognitiveCard,
  TryoutStudentResultsTable,
} from '@/components/organisms/content_manager/tryout_detail';
import type { TryoutPackageResultsResponse, TryoutStudentResultItem } from '@/types/service';

export interface TryoutPackageDetailTemplateProps {
  packageData: TryoutPackageResultsResponse | null;
  students: TryoutStudentResultItem[];
  isLoading: boolean;
  search: string;
  onSearchChange: (search: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortFilter: string;
  onSortFilterChange: (sort: string) => void;
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onBack: () => void;
  onEdit: () => void;
  onManageQuestions: () => void;
  onToggleStatus: () => void;
  isTogglingStatus?: boolean;
  onViewStudentResult: (student: TryoutStudentResultItem) => void;
  onRefresh: () => void;
}

export const TryoutPackageDetailTemplate: React.FC<TryoutPackageDetailTemplateProps> = ({
  packageData,
  students,
  isLoading,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortFilter,
  onSortFilterChange,
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onBack,
  onEdit,
  onManageQuestions,
  onToggleStatus,
  isTogglingStatus = false,
  onViewStudentResult,
  onRefresh,
}) => {
  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      {/* Top Header & Package Meta */}
      <TryoutDetailHeader
        packageData={packageData}
        onBack={onBack}
        onEdit={onEdit}
        onManageQuestions={onManageQuestions}
        onToggleStatus={onToggleStatus}
        isTogglingStatus={isTogglingStatus}
      />

      {/* Package Configuration & Cognitive Pool Distribution Card */}
      <TryoutMetadataAndCognitiveCard packageData={packageData} />

      {/* 4 KPI Cards & Student Attempt Table */}
      <TryoutStudentResultsTable
        packageData={packageData}
        students={students}
        isLoading={isLoading}
        search={search}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        sortFilter={sortFilter}
        onSortFilterChange={onSortFilterChange}
        currentPage={currentPage}
        totalItems={totalItems}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onViewStudentResult={onViewStudentResult}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default TryoutPackageDetailTemplate;
