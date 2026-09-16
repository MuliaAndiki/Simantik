import { ShieldCheck, X } from 'lucide-react';
import React from 'react';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms';

export interface PracticePreStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isChecked: boolean;
  onCheckChange: (checked: boolean) => void;
}

export const PracticePreStartModal: React.FC<PracticePreStartModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isChecked,
  onCheckChange,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="w-full max-w-lg rounded-[28px] bg-white p-6 sm:p-7 border border-slate-100 shadow-2xl overflow-hidden [&>button]:hidden gap-0"
        overlayClassName="bg-slate-950/70 backdrop-blur-sm fixed inset-0 z-50"
      >
        {/* Top bar with Badge and Close button */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-teal-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-teal-700" aria-hidden="true" />
            <span>Konfirmasi Integritas Sesi</span>
          </div>

          <DialogClose asChild>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Tutup modal aturan"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </DialogClose>
        </div>

        {/* Header with Illustration */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 p-2 text-3xl shadow-xs">
            👩‍🎓
          </div>
          <DialogHeader className="text-left gap-1">
            <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              Siap Mengerjakan Latihan?
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Sebelum mulai, perhatikan aturan berikut agar latihan berjalan dengan baik dan nilaimu
              tercatat akurat.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* 4 Rules items */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/90 border border-slate-100 text-xs sm:text-sm font-medium text-slate-800">
            <span className="w-6 h-6 rounded-full bg-[#234E52] text-white flex items-center justify-center font-bold text-xs shrink-0">
              1
            </span>
            <span>Pastikan kamu tetap berada di halaman latihan selama mengerjakan.</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/90 border border-slate-100 text-xs sm:text-sm font-medium text-slate-800">
            <span className="w-6 h-6 rounded-full bg-[#234E52] text-white flex items-center justify-center font-bold text-xs shrink-0">
              2
            </span>
            <span>Jangan berpindah ke tab atau halaman lain selama latihan berlangsung.</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/90 border border-slate-100 text-xs sm:text-sm font-medium text-slate-800">
            <span className="w-6 h-6 rounded-full bg-[#234E52] text-white flex items-center justify-center font-bold text-xs shrink-0">
              3
            </span>
            <span>
              Setiap kali kamu keluar dari tab latihan, sistem akan memberikan peringatan.
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/90 border border-slate-100 text-xs sm:text-sm font-medium text-slate-800">
            <span className="w-6 h-6 rounded-full bg-[#234E52] text-white flex items-center justify-center font-bold text-xs shrink-0">
              4
            </span>
            <span>
              Jika kamu keluar dari tab lebih dari 3 kali, latihan akan dihentikan secara otomatis.
            </span>
          </div>
        </div>

        {/* Warning Alert Box */}
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-900 mb-4">
          <div className="flex items-center gap-1.5 font-bold text-xs text-rose-700 uppercase tracking-wide">
            <svg
              className="w-4 h-4 text-rose-600 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>PENTING: BATAS TOLERANSI KELUAR TAB</span>
          </div>
          <p className="text-xs text-rose-700/90 mt-1 font-medium leading-relaxed">
            <span className="font-bold">3 kali peringatan masih diperbolehkan.</span> Jika keluar
            tab untuk ke-4 kalinya, latihan akan otomatis dihentikan dan jawaban langsung dikirim.
          </p>
        </div>

        {/* Agreement Checkbox */}
        <label className="flex items-center gap-2.5 mb-5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => onCheckChange(e.target.checked)}
            className="w-4 h-4 rounded text-amber-500 border-slate-300 focus:ring-amber-400 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-xs sm:text-sm font-medium text-slate-700">
            Saya sudah membaca dan memahami aturan latihan.
          </span>
        </label>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-11 rounded-2xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border-slate-200 text-sm cursor-pointer shadow-none"
          >
            Kembali
          </Button>
          <Button
            type="button"
            disabled={!isChecked}
            onClick={onConfirm}
            className="h-11 rounded-2xl font-bold text-slate-900 bg-[#F5B731] hover:bg-[#E5A721] text-sm flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-0"
          >
            <span>Mulai Latihan</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
