import { Edit3, ShieldCheck, UserCheck } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface AdminStudentInfoCardProps {
  fullName: string;
  email: string;
  status: string;
  isEmailVerified: boolean;
  registeredDate: string;
  lastUpdatedDate: string;
  onEdit: () => void;
  className?: string;
}

export const AdminStudentInfoCard: React.FC<AdminStudentInfoCardProps> = ({
  fullName,
  email,
  status,
  isEmailVerified,
  registeredDate,
  lastUpdatedDate,
  onEdit,
  className,
}) => {
  const isInactive = status === 'inactive' || status === 'suspended';

  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 space-y-5',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Informasi Akun</h3>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="h-8 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 gap-1.5 shadow-2xs cursor-pointer"
        >
          <Edit3 className="w-3 h-3 text-slate-500" />
          <span>Edit Informasi</span>
        </Button>
      </div>

      {/* 2x3 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Nama Lengkap */}
        <div className="bg-[#f4fafd] rounded-xl p-3.5 border border-sky-50/70 space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Nama Lengkap
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{fullName}</p>
        </div>

        {/* Email Siswa */}
        <div className="bg-[#f4fafd] rounded-xl p-3.5 border border-sky-50/70 space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Email Siswa
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{email}</p>
        </div>

        {/* Status Akun */}
        <div className="bg-[#f4fafd] rounded-xl p-3.5 border border-sky-50/70 space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Status Akun
          </span>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span
              className={cn('w-2 h-2 rounded-full', isInactive ? 'bg-rose-500' : 'bg-emerald-500')}
            />
            <span
              className={cn(
                'text-xs sm:text-sm font-bold',
                isInactive ? 'text-rose-700' : 'text-emerald-700'
              )}
            >
              {isInactive ? 'Nonaktif' : 'Aktif'}
            </span>
          </div>
        </div>

        {/* Verifikasi Email */}
        <div className="bg-[#f4fafd] rounded-xl p-3.5 border border-sky-50/70 space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Verifikasi Email
          </span>
          <div className="flex items-center gap-1.5 pt-0.5">
            {isEmailVerified ? (
              <>
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span className="text-xs sm:text-sm font-bold text-teal-800">
                  Terverifikasi (OTP)
                </span>
              </>
            ) : (
              <span className="text-xs sm:text-sm font-bold text-amber-700">
                Belum Terverifikasi
              </span>
            )}
          </div>
        </div>

        {/* Tanggal Registrasi */}
        <div className="bg-[#f4fafd] rounded-xl p-3.5 border border-sky-50/70 space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Tanggal Registrasi
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">{registeredDate}</p>
        </div>

        {/* Terakhir Diperbarui */}
        <div className="bg-[#f4fafd] rounded-xl p-3.5 border border-sky-50/70 space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Terakhir Diperbarui
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">{lastUpdatedDate}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentInfoCard;
