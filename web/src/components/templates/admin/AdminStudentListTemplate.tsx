import React from 'react';
import {
  AdminStudentDataTable,
  AdminStudentDetailDialog,
  AdminStudentStatCards,
  type AdminStudentStatCardsProps,
  AdminUserFilterBar,
  AdminUserStatusDialog,
} from '@/components/organisms/admin';
import type { AdminUserDetailResponse, AdminUserListItem, UserStatus } from '@/types/service';
import { cn } from '@/utils/classname';

export interface AdminStudentListTemplateProps {
  stats: AdminStudentStatCardsProps;
  users: AdminUserListItem[];
  isLoading?: boolean;
  search: string;
  statusFilter: string;
  isRefreshing?: boolean;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onRefresh: () => void;
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  selectedUser: AdminUserListItem | null;
  isStatusDialogOpen: boolean;
  onOpenStatusDialogChange: (open: boolean) => void;
  statusFormValue: UserStatus;
  onStatusFormValueChange: (status: UserStatus) => void;
  onSubmitStatusDialog: (e: React.FormEvent) => Promise<void> | void;
  isSubmittingStatus?: boolean;
  onOpenStatusDialog: (user: AdminUserListItem) => void;
  detailUserId: string | null;
  onOpenDetailDialog: (userId: string) => void;
  onCloseDetailDialog: () => void;
  userDetail: AdminUserDetailResponse | null | undefined;
  isDetailLoading?: boolean;
  className?: string;
}

export const AdminStudentListTemplate: React.FC<AdminStudentListTemplateProps> = ({
  stats,
  users,
  isLoading = false,
  search,
  statusFilter,
  isRefreshing = false,
  onSearchChange,
  onStatusChange,
  onRefresh,
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  selectedUser,
  isStatusDialogOpen,
  onOpenStatusDialogChange,
  statusFormValue,
  onStatusFormValueChange,
  onSubmitStatusDialog,
  isSubmittingStatus = false,
  onOpenStatusDialog,
  detailUserId,
  onOpenDetailDialog,
  onCloseDetailDialog,
  userDetail,
  isDetailLoading = false,
  className,
}) => {
  return (
    <div className={cn('w-full max-w-full mx-auto space-y-6', className)}>
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-3.5 w-1 rounded-full bg-teal-600 shrink-0" aria-hidden="true" />
          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
            Pengguna Siswa
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Manajemen Siswa
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
          Daftar akun siswa SMA/SMK, pantau progres pengerjaan ujian, dan kelola status keaktifan
          akun.
        </p>
      </div>

      {/* KPI Stats Cards */}
      <AdminStudentStatCards {...stats} />

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-5 md:p-6 space-y-4">
        <AdminUserFilterBar
          variant="student"
          search={search}
          statusFilter={statusFilter}
          isRefreshing={isRefreshing}
          onSearchChange={onSearchChange}
          onStatusChange={onStatusChange}
          onRefresh={onRefresh}
        />

        {/* Data Table */}
        <AdminStudentDataTable
          users={users}
          isLoading={isLoading}
          currentPage={currentPage}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onOpenStatusDialog={onOpenStatusDialog}
          onOpenDetailDialog={onOpenDetailDialog}
        />
      </div>

      {/* Status Update Dialog */}
      <AdminUserStatusDialog
        variant="student"
        open={isStatusDialogOpen}
        onOpenChange={onOpenStatusDialogChange}
        selectedUser={selectedUser}
        status={statusFormValue}
        onStatusChange={onStatusFormValueChange}
        onSubmit={onSubmitStatusDialog}
        isSubmitting={isSubmittingStatus}
      />

      {/* Detail Dialog */}
      <AdminStudentDetailDialog
        open={!!detailUserId}
        onOpenChange={(open) => !open && onCloseDetailDialog()}
        userDetail={userDetail}
        isLoading={isDetailLoading}
      />
    </div>
  );
};

export default AdminStudentListTemplate;
