import { UserCog } from 'lucide-react';
import React from 'react';
import { AdminSingleSelectDialog } from '@/components/molecules/dialog';
import type { AdminUserListItem, UserRole } from '@/types/service';

export interface AdminContentManagerRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: AdminUserListItem | null;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  isSubmitting?: boolean;
}

const ROLE_OPTIONS = [
  { value: 'content_manager', label: 'Content Manager (Kurasi Materi & Bank Soal)' },
  { value: 'admin', label: 'Admin (Hak Akses Penuh Sistem)' },
  { value: 'student', label: 'Student (Akun Siswa)' },
];

export const AdminContentManagerRoleDialog: React.FC<AdminContentManagerRoleDialogProps> = ({
  open,
  onOpenChange,
  selectedUser,
  role,
  onRoleChange,
  onSubmit,
  isSubmitting = false,
}) => {
  return (
    <AdminSingleSelectDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <>
          <UserCog className="size-5 text-teal-700" />
          Ubah Peran Pengguna (RBAC Role)
        </>
      }
      description={<>Tetapkan peran dan hak akses sistem untuk {selectedUser?.full_name}.</>}
      selectLabel="Pilih Peran Sistem"
      value={role}
      options={ROLE_OPTIONS}
      onValueChange={(val) => onRoleChange(val as UserRole)}
      submitLabel="Perbarui Role"
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default AdminContentManagerRoleDialog;
