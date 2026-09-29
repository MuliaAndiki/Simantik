import React from 'react';
import { AdminSingleSelectDialog } from '@/components/molecules/dialog';
import type { AdminUserListItem, UserStatus } from '@/types/service';

export type AdminUserStatusVariant = 'student' | 'content_manager';

export interface AdminUserStatusDialogProps {
  variant?: AdminUserStatusVariant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: AdminUserListItem | null;
  status: UserStatus;
  onStatusChange: (status: UserStatus) => void;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  isSubmitting?: boolean;
}

const TITLE: Record<AdminUserStatusVariant, string> = {
  student: 'Ubah Status Akun Siswa',
  content_manager: 'Ubah Status Akun Kurator',
};

const OPTIONS: Record<AdminUserStatusVariant, { value: string; label: string }[]> = {
  student: [
    { value: 'active', label: 'Active (Akun Aktif & Bisa Ujian)' },
    { value: 'suspended', label: 'Suspended (Tangguhkan / Blokir Akses)' },
    { value: 'inactive', label: 'Inactive (Nonaktif)' },
  ],
  content_manager: [
    { value: 'active', label: 'Active (Akun Aktif)' },
    { value: 'suspended', label: 'Suspended (Tangguhkan / Blokir)' },
    { value: 'inactive', label: 'Inactive (Nonaktif)' },
  ],
};

export const AdminUserStatusDialog: React.FC<AdminUserStatusDialogProps> = ({
  variant = 'student',
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
      title={TITLE[variant]}
      description={
        <>
          Ubah status akses akun untuk {selectedUser?.full_name} ({selectedUser?.email}).
        </>
      }
      selectLabel="Pilih Status Akun"
      value={status}
      options={OPTIONS[variant]}
      onValueChange={(val) => onStatusChange(val as UserStatus)}
      submitLabel="Simpan Status"
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default AdminUserStatusDialog;
