import React from 'react';
import {
  PracticePackageHeader,
  PracticePackageStatCards,
  PracticeStudentInspectionDrawer,
  PracticeStudentResultsTable,
} from '@/components/organisms/content_manager/practice_detail';
import type { PracticePackageResultsResponse, PracticeStudentResultItem } from '@/types/service';

export interface PracticePackageDetailTemplateProps {
  packageData: PracticePackageResultsResponse | null;
  students: PracticeStudentResultItem[];
  selectedStudent: PracticeStudentResultItem | null;
  selectedUserId: string | null;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  sortFilter: string;
  onSortFilterChange: (val: string) => void;
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onBack: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onSelectStudent: (student: PracticeStudentResultItem) => void;
  onViewResult?: (student: PracticeStudentResultItem) => void;
  isLoading?: boolean;
  isTogglingStatus?: boolean;
}

export const PracticePackageDetailTemplate: React.FC<PracticePackageDetailTemplateProps> = ({
  packageData,
  students,
  selectedStudent,
  selectedUserId,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortFilter,
  onSortFilterChange,
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onBack,
  onEdit,
  onToggleStatus,
  onSelectStudent,
  onViewResult,
  isLoading = false,
  isTogglingStatus = false,
}) => {
  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      {/* 1. Header with Title & Action Buttons */}
      <PracticePackageHeader
        packageData={packageData}
        onBack={onBack}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
        isTogglingStatus={isTogglingStatus}
      />

      {/* 2. 4 Summary KPI Stat Cards */}
      <PracticePackageStatCards
        totalStudentsCompleted={packageData?.total_students_completed ?? 0}
        averageScore={packageData?.average_score ?? 0}
        highestScore={packageData?.highest_score ?? 0}
        highestScoreStudentName={packageData?.highest_score_student_name ?? '-'}
        lowestScore={packageData?.lowest_score ?? 0}
        lowestScoreStudentName={packageData?.lowest_score_student_name ?? '-'}
      />

      {/* 3. Main 2-Column Grid: Student Results Table + Selected Student Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Table) */}
        <div className="lg:col-span-8">
          <PracticeStudentResultsTable
            students={students}
            selectedUserId={selectedUserId}
            onSelectStudent={onSelectStudent}
            onViewResult={onViewResult}
            totalCompletedCount={packageData?.total_students_completed ?? 0}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={onStatusFilterChange}
            sortFilter={sortFilter}
            onSortFilterChange={onSortFilterChange}
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column (Inspection Drawer) */}
        <div className="lg:col-span-4 sticky top-6">
          <PracticeStudentInspectionDrawer
            student={selectedStudent}
            packageTitle={packageData?.package_title || 'Paket Latihan'}
            onViewResult={onViewResult}
          />
        </div>
      </div>
    </div>
  );
};

export default PracticePackageDetailTemplate;
