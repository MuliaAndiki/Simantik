import React from 'react';
import { AdminSingleSelectDialog } from '@/components/molecules/dialog';
import type { AdminUserListItem, UserStatus } from '@/types/service';

export interface AdminContentManagerStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: AdminUserListItem | null;
  status: UserStatus;
  onStatusChange: (status: UserStatus) => void;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  isSubmitting?: boolean;
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active (Akun Aktif)' },
  { value: 'suspended', label: 'Suspended (Tangguhkan / Blokir)' },
  { value: 'inactive', label: 'Inactive (Nonaktif)' },
];

export const AdminContentManagerStatusDialog: React.FC<AdminContentManagerStatusDialogProps> = ({
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
      title="Ubah Status Akun Kurator"
      description={
        <>
          Ubah status akun untuk {selectedUser?.full_name} ({selectedUser?.email}).
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

export default AdminContentManagerStatusDialog;
