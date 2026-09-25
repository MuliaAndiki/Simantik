import { Ban, ShieldCheck } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface AdminStudentInactiveBannerProps {
  suspendedDate?: string;
  onReactivate: () => void;
  className?: string;
}

export const AdminStudentInactiveBanner: React.FC<AdminStudentInactiveBannerProps> = ({
  suspendedDate = '15 September 2026',
  onReactivate,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full bg-rose-50/90 border border-rose-100/90 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs',
        className
      )}
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Ban className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-rose-800 uppercase tracking-wider">
              AKUN NONAKTIF
            </span>
            <span className="text-rose-400 font-bold text-xs">•</span>
            <span className="text-xs font-semibold text-rose-700">
              Ditangguhkan oleh Administrator
            </span>
          </div>
          <p className="text-xs sm:text-xs text-rose-800/90 font-medium leading-relaxed max-w-2xl">
            Akun ini dinonaktifkan oleh administrator pada {suspendedDate}. Siswa tidak dapat login,
            mengerjakan tryout, atau mengakses seluruh bank materi di platform SIMANTIK.
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <Button
          type="button"
          onClick={onReactivate}
          className="h-9 px-4 rounded-xl text-xs font-bold bg-[#134653] hover:bg-[#0e353f] text-white shadow-2xs gap-1.5 cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Proses Reaktivasi</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminStudentInactiveBanner;
