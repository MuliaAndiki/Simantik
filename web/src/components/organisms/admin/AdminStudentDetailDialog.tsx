import { GraduationCap } from 'lucide-react';
import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms';
import type { AdminUserDetailResponse } from '@/types/service';

export interface AdminStudentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userDetail: AdminUserDetailResponse | null | undefined;
  isLoading?: boolean;
}

export const AdminStudentDetailDialog: React.FC<AdminStudentDetailDialogProps> = ({
  open,
  onOpenChange,
  userDetail,
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
            <GraduationCap className="size-5 text-teal-700" />
            Detail Profil Akademik Siswa
          </DialogTitle>
        </DialogHeader>

        {isLoading || !userDetail ? (
          <div className="py-8 text-center text-xs text-slate-400 font-medium">
            Memuat data profil siswa...
          </div>
        ) : (
          <div className="space-y-4 py-2 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Nama Lengkap:</span>
                <span className="font-bold text-slate-900">{userDetail.full_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Email:</span>
                <span className="text-slate-700 font-medium">{userDetail.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Status Akun:</span>
                <span className="font-bold capitalize text-emerald-600">{userDetail.status}</span>
              </div>
            </div>

            {userDetail.profile && (
              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-800">Asal Sekolah & Target Pendidikan</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-2xs">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Sekolah</p>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {userDetail.profile.school || '-'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-2xs">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Kelas / Jurusan
                    </p>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {userDetail.profile.grade || '-'} {userDetail.profile.major || ''}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-2xs">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Target Kampus</p>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {userDetail.profile.target_university || '-'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-2xs">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Target Jurusan</p>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {userDetail.profile.target_major || '-'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-100">
                <span className="text-[11px] text-teal-800 font-bold">Total Sesi Ujian</span>
                <p className="text-2xl font-black text-teal-900 mt-0.5">
                  {userDetail.attempt_count} Sesi
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-[11px] text-amber-800 font-bold">Rata-Rata Skor</span>
                <p className="text-2xl font-black text-amber-900 mt-0.5">
                  {userDetail.average_score > 0 ? userDetail.average_score.toFixed(1) : '-'}
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-xl text-xs font-bold text-slate-700 border-slate-200"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminStudentDetailDialog;
