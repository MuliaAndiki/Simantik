import { Plus } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/atoms';
import {
  AdminSchoolCreateDialog,
  AdminSchoolDataTable,
  AdminSchoolFilterBar,
  AdminSchoolRejectDialog,
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
  verificationFilter: string;
  isRefreshing?: boolean;
  onSearchChange: (val: string) => void;
  onJenjangChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onVerificationChange: (val: string) => void;
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
  onVerify: (school: SchoolResponse) => void;
  onOpenReject: (school: SchoolResponse) => void;
  isVerifyingId?: string | null;
  rejectTargetSchool: SchoolResponse | null;
  isRejectDialogOpen: boolean;
  onOpenRejectDialogChange: (open: boolean) => void;
  rejectReason: string;
  onRejectReasonChange: (value: string) => void;
  onSubmitReject: (e: React.FormEvent) => Promise<void> | void;
  isRejectSubmitting?: boolean;
  className?: string;
}

export const AdminSchoolListTemplate: React.FC<AdminSchoolListTemplateProps> = ({
  stats,
  schools,
  isLoading = false,
  search,
  jenjangFilter,
  statusFilter,
  verificationFilter,
  isRefreshing = false,
  onSearchChange,
  onJenjangChange,
  onStatusChange,
  onVerificationChange,
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
  onVerify,
  onOpenReject,
  isVerifyingId,
  rejectTargetSchool,
  isRejectDialogOpen,
  onOpenRejectDialogChange,
  rejectReason,
  onRejectReasonChange,
  onSubmitReject,
  isRejectSubmitting = false,
  className,
}) => {
  const verificationTabs = [
    { key: 'all', label: 'Semua', count: stats.total },
    {
      key: 'pending',
      label: 'Menunggu Verifikasi',
      count: stats.pending ?? 0,
      highlightPending: true,
    },
    { key: 'verified', label: 'Terverifikasi', count: stats.verified ?? 0 },
    { key: 'rejected', label: 'Ditolak', count: stats.rejected ?? 0 },
  ];

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
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          {verificationTabs.map((tab) => {
            const active = verificationFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onVerificationChange(tab.key)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer border',
                  active
                    ? 'bg-[#134653] text-white border-[#134653] shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-black',
                    active
                      ? 'bg-white/20 text-white'
                      : tab.highlightPending && tab.count > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-white text-slate-600 border border-slate-200'
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

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
          onVerify={onVerify}
          onOpenReject={onOpenReject}
          isVerifyingId={isVerifyingId}
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

      {/* Reject School Modal Dialog */}
      <AdminSchoolRejectDialog
        open={isRejectDialogOpen}
        onOpenChange={onOpenRejectDialogChange}
        school={rejectTargetSchool}
        reason={rejectReason}
        onReasonChange={onRejectReasonChange}
        onSubmit={onSubmitReject}
        isSubmitting={isRejectSubmitting}
      />
    </div>
  );
};

export default AdminSchoolListTemplate;
