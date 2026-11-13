import type React from 'react';
import { AdminField, AdminFormDialogShell } from '@/components/molecules/dialog';
import type { SchoolResponse } from '@/types/service';

const QUICK_REJECTION_REASONS = [
  'NPSN tidak ditemukan / tidak sesuai data Dapodik',
  'Duplikat dengan sekolah yang sudah terdaftar',
  'Nama atau alamat sekolah belum lengkap/valid',
];

export interface AdminSchoolRejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school: SchoolResponse | null;
  reason: string;
  onReasonChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const AdminSchoolRejectDialog: React.FC<AdminSchoolRejectDialogProps> = ({
  open,
  onOpenChange,
  school,
  reason,
  onReasonChange,
  onSubmit,
  isSubmitting = false,
}) => {
  return (
    <AdminFormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title="Tolak Pengajuan Sekolah"
      description={
        school
          ? `Berikan alasan penolakan untuk ${school.nama} (NPSN: ${school.npsn}) agar pengaju dapat memperbaiki datanya.`
          : 'Berikan alasan penolakan pengajuan sekolah.'
      }
      maxWidthClass="sm:max-w-md"
      submitLabel="Tolak Pengajuan"
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {QUICK_REJECTION_REASONS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onReasonChange(preset)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 cursor-pointer text-left"
            >
              {preset}
            </button>
          ))}
        </div>

        <AdminField
          label={
            <>
              Alasan Penolakan <span className="text-rose-500">*</span>
            </>
          }
        >
          <textarea
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            rows={3}
            placeholder="Jelaskan alasan penolakan minimal 5 karakter..."
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30"
          />
        </AdminField>
      </div>
    </AdminFormDialogShell>
  );
};

export default AdminSchoolRejectDialog;
