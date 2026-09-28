import type React from 'react';
import { AdminField, AdminFormDialogShell, AdminTextInput } from '@/components/molecules/dialog';

export interface AdminStudentEditFormData {
  fullName: string;
  email: string;
  school: string;
  grade: string;
  major: string;
}

export interface AdminStudentEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: AdminStudentEditFormData;
  onFormDataChange: (data: AdminStudentEditFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

export const AdminStudentEditDialog: React.FC<AdminStudentEditDialogProps> = ({
  open,
  onOpenChange,
  formData,
  onFormDataChange,
  onSubmit,
  isSubmitting = false,
}) => {
  return (
    <AdminFormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Informasi Siswa"
      description="Perbarui data identitas dan profil akademik siswa."
      submitLabel="Simpan Perubahan"
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
    >
      <AdminField label="Nama Lengkap">
        <AdminTextInput
          value={formData.fullName}
          onChange={(e) => onFormDataChange({ ...formData, fullName: e.target.value })}
          required
          placeholder="Contoh: Anindya Humairah"
        />
      </AdminField>

      <AdminField label="Email Siswa">
        <AdminTextInput
          type="email"
          value={formData.email}
          onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
          required
          placeholder="Contoh: anindya@example.com"
        />
      </AdminField>

      <AdminField label="Sekolah Asal">
        <AdminTextInput
          value={formData.school}
          onChange={(e) => onFormDataChange({ ...formData, school: e.target.value })}
          placeholder="Contoh: SMAN 3 Bandung"
        />
      </AdminField>

      <div className="grid grid-cols-2 gap-2.5">
        <AdminField label="Kelas / Tingkat">
          <AdminTextInput
            value={formData.grade}
            onChange={(e) => onFormDataChange({ ...formData, grade: e.target.value })}
            placeholder="Contoh: XII"
          />
        </AdminField>
        <AdminField label="Jurusan">
          <AdminTextInput
            value={formData.major}
            onChange={(e) => onFormDataChange({ ...formData, major: e.target.value })}
            placeholder="Contoh: MIPA 2"
          />
        </AdminField>
      </div>
    </AdminFormDialogShell>
  );
};

export default AdminStudentEditDialog;
