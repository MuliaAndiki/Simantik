import React from 'react';
import { AdminSingleSelectDialog } from '@/components/molecules/dialog';
import type { AdminUserListItem, UserStatus } from '@/types/service';

export interface AdminStudentStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: AdminUserListItem | null;
  status: UserStatus;
  onStatusChange: (status: UserStatus) => void;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  isSubmitting?: boolean;
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active (Akun Aktif & Bisa Ujian)' },
  { value: 'suspended', label: 'Suspended (Tangguhkan / Blokir Akses)' },
  { value: 'inactive', label: 'Inactive (Nonaktif)' },
];

export const AdminStudentStatusDialog: React.FC<AdminStudentStatusDialogProps> = ({
  open,
  onOpenChange,
  selectedUser,
  status,
  onStatusChange,
  onSubmit,
  isSubmitting = false,
}) => {
  return (
    <AdminSingleSelectDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Ubah Status Akun Siswa"
      description={
        <>
          Ubah status akses akun untuk {selectedUser?.full_name} ({selectedUser?.email}).
        </>
      }
      selectLabel="Pilih Status Akun"
      value={status}
      options={STATUS_OPTIONS}
      onValueChange={(val) => onStatusChange(val as UserStatus)}
      submitLabel="Simpan Status"
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default AdminStudentStatusDialog;
