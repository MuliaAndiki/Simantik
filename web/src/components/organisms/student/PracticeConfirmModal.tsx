import { Check, LogOut } from 'lucide-react';
import React from 'react';
import { Button, DialogDescription, DialogHeader, DialogTitle } from '@/components/atoms';
import { ExamDialogShell } from '@/components/molecules/dialog';

export interface PracticeConfirmModalProps {
  isOpen: boolean;
  type: 'exit' | 'submit';
  answeredCount?: number;
  unansweredCount?: number;
  flaggedCount?: number;
  totalQuestions?: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export const PracticeConfirmModal: React.FC<PracticeConfirmModalProps> = ({
  isOpen,
  type,
  answeredCount = 0,
  unansweredCount = 0,
  flaggedCount = 0,
  totalQuestions = 10,
  onCancel,
  onConfirm,
}) => {
  return (
    <ExamDialogShell
      isOpen={isOpen}
      onCancel={onCancel}
      contentClassName="max-w-md p-6 sm:p-7 text-center gap-0"
    >
      {type === 'exit' ? (
        <>
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-6 h-6 text-slate-600" aria-hidden="true" />
          </div>

          <DialogHeader className="text-center gap-1 mb-6">
            <DialogTitle className="text-lg font-bold text-slate-900">
              Keluar dari Sesi Latihan?
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Jawaban yang telah kamu pilih sudah tersimpan otomatis. Kamu bisa kembali dan
              melanjutkan latihan kapan saja.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-11 rounded-2xl border-slate-200 font-semibold text-slate-700 bg-white hover:bg-slate-50 text-sm cursor-pointer shadow-none"
            >
              Lanjutkan Latihan
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirm}
              className="h-11 rounded-2xl font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-sm cursor-pointer shadow-none"
            >
              Ya, Keluar
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4">
            <Check className="w-7 h-7 text-amber-600 stroke-[2.5]" aria-hidden="true" />
          </div>

          <DialogHeader className="text-center gap-1 mb-4">
            <DialogTitle className="text-lg font-bold text-slate-900">
              Kumpulkan Jawaban Latihan?
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Apakah kamu yakin ingin mengakhiri sesi latihan ini? Nilai dan analisis performamu
              akan langsung dievaluasi.
            </DialogDescription>
          </DialogHeader>

          {/* Status Breakdown Pills */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-6 text-xs">
            <div className="flex flex-col items-center">
              <span className="font-bold text-teal-800 text-base">{answeredCount}</span>
              <span className="text-slate-500 text-[11px]">Terjawab</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-amber-600 text-base">{flaggedCount}</span>
              <span className="text-slate-500 text-[11px]">Ragu-ragu</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-slate-600 text-base">{unansweredCount}</span>
              <span className="text-slate-500 text-[11px]">Kosong</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-11 rounded-2xl border-slate-200 font-semibold text-slate-700 bg-white hover:bg-slate-50 text-sm cursor-pointer shadow-none"
            >
              Periksa Kembali
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              className="h-11 rounded-2xl font-bold text-slate-900 bg-[#F5B731] hover:bg-[#E5A721] text-sm cursor-pointer shadow-xs border-0"
            >
              Ya, Kumpulkan
            </Button>
          </div>
        </>
      )}
    </ExamDialogShell>
  );
};
