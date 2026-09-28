import React from 'react';
import {
  MaterialActivityHeader,
  MaterialActivityProgressBar,
  MaterialActivityStatCards,
  MaterialStudentActivityTable,
  MaterialStudentInspectionDrawer,
} from '@/components/organisms/content_manager/material_activity';
import type { MaterialStudentActivityItem } from '@/types/service';

export interface MaterialStudentActivityTemplateProps {
  materialTitle: string;
  competencyName?: string;
  status: string;
  totalStudents: number;
  accessedStudents: number;
  unaccessedStudents: number;
  participationRate: number;
  lastUpdatedAt?: string;
  students: MaterialStudentActivityItem[];
  selectedStudent: MaterialStudentActivityItem | null;
  selectedUserId: string | null;
  searchQuery: string;
  statusFilter: string;
  sortFilter: string;
  currentPage: number;
  totalItems: number;
  pageSize: number;
  isLoading?: boolean;
  onBack: () => void;
  onExportData: () => void;
  onViewMaterial: () => void;
  onSelectStudent: (student: MaterialStudentActivityItem) => void;
  onSearchChange: (val: string) => void;
  onStatusFilterChange: (val: string) => void;
  onSortFilterChange: (val: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const MaterialStudentActivityTemplate: React.FC<MaterialStudentActivityTemplateProps> = ({
  materialTitle,
  competencyName,
  status,
  totalStudents,
  accessedStudents,
  unaccessedStudents,
  participationRate,
  lastUpdatedAt,
  students,
  selectedStudent,
  selectedUserId,
  searchQuery,
  statusFilter,
  sortFilter,
  currentPage,
  totalItems,
  pageSize,
  isLoading,
  onBack,
  onExportData,
  onViewMaterial,
  onSelectStudent,
  onSearchChange,
  onStatusFilterChange,
  onSortFilterChange,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      {/* 1. Top Header */}
      <MaterialActivityHeader
        materialTitle={materialTitle}
        competencyName={competencyName}
        status={status}
        onBack={onBack}
        onExportData={onExportData}
        onViewMaterial={onViewMaterial}
      />

      {/* 2. Top Metric Cards */}
      <MaterialActivityStatCards
        totalStudents={totalStudents}
        accessedStudents={accessedStudents}
        unaccessedStudents={unaccessedStudents}
        participationRate={participationRate}
      />

      {/* 3. Progress Summary Bar */}
      <MaterialActivityProgressBar
        totalStudents={totalStudents}
        accessedStudents={accessedStudents}
        unaccessedStudents={unaccessedStudents}
        participationRate={participationRate}
        lastUpdatedAt={lastUpdatedAt}
      />

      {/* 4. Main 2-Column Grid: Students Table & Selected Student Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Table of Students (approx 65% width) */}
        <div className="lg:col-span-8">
          <MaterialStudentActivityTable
            students={students}
            selectedUserId={selectedUserId}
            onSelectStudent={onSelectStudent}
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

        {/* Right Column: Student Inspection Drawer (approx 35% width) */}
        <div className="lg:col-span-4 sticky top-6">
          <MaterialStudentInspectionDrawer
            student={selectedStudent}
            materialTitle={materialTitle}
          />
        </div>
      </div>
    </div>
  );
};

export default MaterialStudentActivityTemplate;
