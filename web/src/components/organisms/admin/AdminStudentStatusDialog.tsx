import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms';
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-slate-900">
            Ubah Status Akun Siswa
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Ubah status akses akun untuk {selectedUser?.full_name} ({selectedUser?.email}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Pilih Status Akun</label>
            <Select value={status} onValueChange={(val: UserStatus) => onStatusChange(val)}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active (Akun Aktif & Bisa Ujian)</SelectItem>
                <SelectItem value="suspended">Suspended (Tangguhkan / Blokir Akses)</SelectItem>
                <SelectItem value="inactive">Inactive (Nonaktif)</SelectItem>
              </SelectContent>
            </Select>
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
              className="h-10 px-5 rounded-xl font-bold text-xs bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 border-0 shadow-2xs cursor-pointer transition-transform active:scale-98"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Status'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminStudentStatusDialog;
