import type React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from '@/components/atoms';
import type { AdminUserDetailResponse } from '@/types/service';

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-slate-900">
            Edit Informasi Siswa
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Perbarui data identitas dan profil akademik siswa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-3.5 py-2">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
            <Input
              value={formData.fullName}
              onChange={(e) => onFormDataChange({ ...formData, fullName: e.target.value })}
              required
              className="h-10 rounded-xl bg-slate-50 text-xs font-semibold"
              placeholder="Contoh: Anindya Humairah"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Siswa</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
              required
              className="h-10 rounded-xl bg-slate-50 text-xs font-semibold"
              placeholder="Contoh: anindya@example.com"
            />
          </div>

          {/* School */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Sekolah Asal</label>
            <Input
              value={formData.school}
              onChange={(e) => onFormDataChange({ ...formData, school: e.target.value })}
              className="h-10 rounded-xl bg-slate-50 text-xs font-semibold"
              placeholder="Contoh: SMAN 3 Bandung"
            />
          </div>

          {/* Grade & Major */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Kelas / Tingkat</label>
              <Input
                value={formData.grade}
                onChange={(e) => onFormDataChange({ ...formData, grade: e.target.value })}
                className="h-10 rounded-xl bg-slate-50 text-xs font-semibold"
                placeholder="Contoh: XII"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Jurusan</label>
              <Input
                value={formData.major}
                onChange={(e) => onFormDataChange({ ...formData, major: e.target.value })}
                className="h-10 rounded-xl bg-slate-50 text-xs font-semibold"
                placeholder="Contoh: MIPA 2"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-xl text-xs font-bold text-slate-700 border-slate-200"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 rounded-xl font-bold text-xs bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 border-0 shadow-2xs cursor-pointer"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminStudentEditDialog;
