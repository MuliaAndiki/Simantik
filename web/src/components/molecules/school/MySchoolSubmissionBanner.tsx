import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/atoms';
import type { SchoolResponse } from '@/types/service';

export interface MySchoolSubmissionBannerProps {
  submissions: SchoolResponse[];
  onSelectSubmission?: (school: SchoolResponse) => void;
  onResubmit?: (school: SchoolResponse) => void;
}

export const MySchoolSubmissionBanner: React.FC<MySchoolSubmissionBannerProps> = ({
  submissions,
  onSelectSubmission,
  onResubmit,
}) => {
  if (!submissions.length) return null;

  const latest = submissions[0];

  if (latest.verificationStatus === 'rejected') {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-left text-xs text-rose-900 space-y-1.5">
        <div className="flex items-start gap-2">
          <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-bold">
              Pengajuan Sekolah Ditolak: {latest.nama} (NPSN {latest.npsn})
            </p>
            {latest.rejectionReason && (
              <p className="text-rose-700 leading-relaxed">Alasan: {latest.rejectionReason}</p>
            )}
          </div>
        </div>
        {onResubmit && (
          <div className="pl-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onResubmit(latest)}
              className="h-7 px-2.5 text-[11px] font-semibold border-rose-300 text-rose-800 hover:bg-rose-100 cursor-pointer"
            >
              Perbaiki & Ajukan Ulang
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (latest.verificationStatus === 'pending') {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-left text-xs text-amber-900 space-y-1.5">
        <div className="flex items-start gap-2">
          <Clock className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-0.5">
            <p className="font-bold">
              Menunggu Verifikasi Admin: {latest.nama} (NPSN {latest.npsn})
            </p>
            <p className="text-amber-700 leading-relaxed">
              Sekolah yang Anda ajukan sedang ditinjau admin dan sudah dapat dipilih sementara oleh
              akun Anda.
            </p>
          </div>
        </div>
        {onSelectSubmission && (
          <div className="pl-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSelectSubmission(latest)}
              className="h-7 px-2.5 text-[11px] font-semibold border-amber-300 text-amber-800 hover:bg-amber-100 cursor-pointer"
            >
              Pilih Sekolah Ini
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-left text-xs text-emerald-900">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
        <p className="font-semibold">
          Pengajuan disetujui: {latest.nama} (NPSN {latest.npsn}) kini terverifikasi.
        </p>
      </div>
    </div>
  );
};
