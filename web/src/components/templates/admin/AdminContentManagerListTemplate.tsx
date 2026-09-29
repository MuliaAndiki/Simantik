import React from 'react';
import {
  AdminContentManagerDataTable,
  AdminContentManagerRoleDialog,
  AdminContentManagerStatCards,
  type AdminContentManagerStatCardsProps,
  AdminUserFilterBar,
  AdminUserStatusDialog,
} from '@/components/organisms/admin';
import type { AdminUserListItem, UserRole, UserStatus } from '@/types/service';
import { cn } from '@/utils/classname';

export interface AdminContentManagerListTemplateProps {
  stats: AdminContentManagerStatCardsProps;
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
  isRoleDialogOpen: boolean;
  onOpenRoleDialogChange: (open: boolean) => void;
  roleFormValue: UserRole;
  onRoleFormValueChange: (role: UserRole) => void;
  onSubmitRoleDialog: (e: React.FormEvent) => Promise<void> | void;
  isSubmittingRole?: boolean;
  onOpenRoleDialog: (user: AdminUserListItem) => void;
  className?: string;
}

export const AdminContentManagerListTemplate: React.FC<AdminContentManagerListTemplateProps> = ({
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
  isRoleDialogOpen,
  onOpenRoleDialogChange,
  roleFormValue,
  onRoleFormValueChange,
  onSubmitRoleDialog,
  isSubmittingRole = false,
  onOpenRoleDialog,
  className,
}) => {
  return (
    <div className={cn('w-full max-w-full mx-auto space-y-6', className)}>
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-3.5 w-1 rounded-full bg-teal-600 shrink-0" aria-hidden="true" />
          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
            Kurator & Editor Konten
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Manajemen Content Manager
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
          Kelola akun kurator materi, pembuat bank soal latihan & tryout, serta atur hak akses peran
          sistem.
        </p>
      </div>

      {/* KPI Stats Cards */}
      <AdminContentManagerStatCards {...stats} />

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-5 md:p-6 space-y-4">
        <AdminUserFilterBar
          variant="content_manager"
          search={search}
          statusFilter={statusFilter}
          isRefreshing={isRefreshing}
          onSearchChange={onSearchChange}
          onStatusChange={onStatusChange}
          onRefresh={onRefresh}
        />

        {/* Data Table */}
        <AdminContentManagerDataTable
          users={users}
          isLoading={isLoading}
          currentPage={currentPage}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onOpenRoleDialog={onOpenRoleDialog}
          onOpenStatusDialog={onOpenStatusDialog}
        />
      </div>

      {/* Status Update Dialog */}
      <AdminUserStatusDialog
        variant="content_manager"
        open={isStatusDialogOpen}
        onOpenChange={onOpenStatusDialogChange}
        selectedUser={selectedUser}
        status={statusFormValue}
        onStatusChange={onStatusFormValueChange}
        onSubmit={onSubmitStatusDialog}
        isSubmitting={isSubmittingStatus}
      />

      {/* Role Update Dialog */}
      <AdminContentManagerRoleDialog
        open={isRoleDialogOpen}
        onOpenChange={onOpenRoleDialogChange}
        selectedUser={selectedUser}
        role={roleFormValue}
        onRoleChange={onRoleFormValueChange}
        onSubmit={onSubmitRoleDialog}
        isSubmitting={isSubmittingRole}
      />
    </div>
  );
};

export default AdminContentManagerListTemplate;
