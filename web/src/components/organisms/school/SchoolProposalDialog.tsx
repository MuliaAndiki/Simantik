import { Info } from 'lucide-react';
import type React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms';
import {
  type SchoolFormErrors,
  SchoolFormFields,
  type SchoolFormState,
} from '@/components/molecules/school/SchoolFormFields';

export interface SchoolProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: SchoolFormState;
  errors?: SchoolFormErrors;
  onChange: <K extends keyof SchoolFormState>(field: K, value: SchoolFormState[K]) => void;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const SchoolProposalDialog: React.FC<SchoolProposalDialogProps> = ({
  open,
  onOpenChange,
  formData,
  errors,
  onChange,
  onSubmit,
  isSubmitting = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-slate-900">
            Ajukan Sekolah Baru
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Sekolahmu belum ditemukan? Ajukan data resmi sekolahmu agar diverifikasi oleh admin
            SIMANTIK.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-2.5 rounded-xl border border-teal-100 bg-teal-50/70 px-3.5 py-2.5 text-xs text-teal-900">
          <Info className="size-4 text-teal-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Pastikan <strong>NPSN</strong> dan nama sekolah sesuai data Dapodik. Setelah diajukan,
            Anda tetap dapat langsung menggunakannya sementara menunggu verifikasi admin.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 pt-1">
          <SchoolFormFields
            formData={formData}
            onChange={onChange}
            errors={errors}
            disabled={isSubmitting}
          />

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-10 rounded-xl text-xs font-bold text-slate-700 border-slate-200 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="h-10 px-5 rounded-xl font-bold text-xs bg-[#134653] hover:bg-[#0B2D38] text-white border-0 shadow-2xs cursor-pointer"
            >
              {isSubmitting ? 'Mengirim Pengajuan...' : 'Ajukan Sekolah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SchoolProposalDialog;
