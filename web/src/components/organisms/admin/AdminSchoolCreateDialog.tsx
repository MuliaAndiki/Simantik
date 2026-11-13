import type React from 'react';
import { AdminFormDialogShell } from '@/components/molecules/dialog';
import {
  SchoolFormFields,
  type SchoolFormState,
} from '@/components/molecules/school/SchoolFormFields';

export type { SchoolFormState };

export interface AdminSchoolCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  formData: SchoolFormState;
  onChange: <K extends keyof SchoolFormState>(field: K, value: SchoolFormState[K]) => void;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const AdminSchoolCreateDialog: React.FC<AdminSchoolCreateDialogProps> = ({
  open,
  onOpenChange,
  mode,
  formData,
  onChange,
  onSubmit,
  isSubmitting = false,
}) => {
  return (
    <AdminFormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={mode === 'create' ? 'Tambah Master Data Sekolah' : 'Edit Data Sekolah'}
      description="Isi data lengkap sekolah sesuai dengan catatan resmi Dapodik Kemendikbudristek."
      maxWidthClass="sm:max-w-lg"
      submitLabel={mode === 'create' ? 'Tambah Sekolah' : 'Simpan Perubahan'}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
    >
      <SchoolFormFields formData={formData} onChange={onChange} disabled={isSubmitting} />
    </AdminFormDialogShell>
  );
};

export default AdminSchoolCreateDialog;
