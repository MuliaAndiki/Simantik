import { ArrowLeft, Edit3, ShieldAlert, ShieldCheck } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface AdminStudentDetailHeaderProps {
  studentName?: string;
  isInactive?: boolean;
  onBack: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  className?: string;
}

export const AdminStudentDetailHeader: React.FC<AdminStudentDetailHeaderProps> = ({
  isInactive = false,
  onBack,
  onEdit,
  onToggleStatus,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Back button link */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>Kembali ke Daftar Siswa</span>
      </button>

      {/* Main Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Detail Siswa
          </h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100/80">
            Akun Siswa SMA/SMK
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
            className="h-10 px-4 rounded-xl text-xs font-bold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Siswa</span>
          </Button>

          <Button
            type="button"
            onClick={onToggleStatus}
            className={cn(
              'h-10 px-4 rounded-xl text-xs font-bold shadow-2xs gap-1.5 cursor-pointer transition-colors',
              isInactive
                ? 'bg-[#134653] hover:bg-[#0e353f] text-white'
                : 'bg-[#134653] hover:bg-[#0e353f] text-white'
            )}
          >
            {isInactive ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Aktifkan Akun</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                <span>Ubah Status</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentDetailHeader;
