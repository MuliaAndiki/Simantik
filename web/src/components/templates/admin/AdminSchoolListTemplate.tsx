import { Plus } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/atoms';
import {
  AdminSchoolCreateDialog,
  AdminSchoolDataTable,
  AdminSchoolFilterBar,
  AdminSchoolStatCards,
  type AdminSchoolStatCardsProps,
  type SchoolFormState,
} from '@/components/organisms/admin';
import type { SchoolResponse } from '@/types/service';
import { cn } from '@/utils/classname';

export interface AdminSchoolListTemplateProps {
  stats: AdminSchoolStatCardsProps;
  schools: SchoolResponse[];
  isLoading?: boolean;
  search: string;
  jenjangFilter: string;
  statusFilter: string;
  isRefreshing?: boolean;
  onSearchChange: (val: string) => void;
  onJenjangChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onRefresh: () => void;
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  isDialogOpen: boolean;
  onOpenDialogChange: (open: boolean) => void;
  dialogMode: 'create' | 'edit';
  formData: SchoolFormState;
  onFormFieldChange: <K extends keyof SchoolFormState>(field: K, value: SchoolFormState[K]) => void;
  onSubmitDialog: (e: React.FormEvent) => Promise<void> | void;
  isSubmitting?: boolean;
  onOpenCreate: () => void;
  onEdit: (school: SchoolResponse) => void;
  onDelete: (school: SchoolResponse) => void;
  className?: string;
}

export const AdminSchoolListTemplate: React.FC<AdminSchoolListTemplateProps> = ({
  stats,
  schools,
  isLoading = false,
  search,
  jenjangFilter,
  statusFilter,
  isRefreshing = false,
  onSearchChange,
  onJenjangChange,
  onStatusChange,
  onRefresh,
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  isDialogOpen,
  onOpenDialogChange,
  dialogMode,
  formData,
  onFormFieldChange,
  onSubmitDialog,
  isSubmitting = false,
  onOpenCreate,
  onEdit,
  onDelete,
  className,
}) => {
  return (
    <div className={cn('w-full max-w-full mx-auto space-y-6', className)}>
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-3.5 w-1 rounded-full bg-teal-600 shrink-0" aria-hidden="true" />
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                Master Data Wilayah
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Manajemen Sekolah
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
              Kelola data resmi NPSN, jenjang pendidikan, status akreditasi, dan sebaran wilayah
              sekolah mitra.
            </p>
          </div>

          <Button
            type="button"
            onClick={onOpenCreate}
            className="h-10 px-5 rounded-xl font-bold text-xs bg-[#134653] hover:bg-[#0B2D38] text-white shadow-xs flex items-center justify-center gap-1.5 border-0 cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Sekolah</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <AdminSchoolStatCards {...stats} />

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-5 md:p-6 space-y-4">
        <AdminSchoolFilterBar
          search={search}
          jenjangFilter={jenjangFilter}
          statusFilter={statusFilter}
          isRefreshing={isRefreshing}
          onSearchChange={onSearchChange}
          onJenjangChange={onJenjangChange}
          onStatusChange={onStatusChange}
          onRefresh={onRefresh}
        />

        {/* Data Table */}
        <AdminSchoolDataTable
          schools={schools}
          isLoading={isLoading}
          currentPage={currentPage}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      {/* Create / Edit Modal Dialog */}
      <AdminSchoolCreateDialog
        open={isDialogOpen}
        onOpenChange={onOpenDialogChange}
        mode={dialogMode}
        formData={formData}
        onChange={onFormFieldChange}
        onSubmit={onSubmitDialog}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AdminSchoolListTemplate;
