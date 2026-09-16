import { AlertCircle, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms';

export interface PracticeProctoringWarningModalProps {
  isOpen: boolean;
  violationCount: number; // 1, 2, or 3
  onDismiss: () => void;
}

export const PracticeProctoringWarningModal: React.FC<PracticeProctoringWarningModalProps> = ({
  isOpen,
  violationCount,
  onDismiss,
}) => {
  const isDialogActive = isOpen && violationCount >= 1 && violationCount <= 3;

  return (
    <Dialog
      open={isDialogActive}
      onOpenChange={(open) => {
        // Prevent accidental closing by clicking outside during proctoring warning
        if (!open) onDismiss();
      }}
    >
      <DialogContent
        className="w-full max-w-md rounded-[28px] bg-white p-6 sm:p-7 border border-slate-100 shadow-2xl flex flex-col items-center text-center gap-0 [&>button]:hidden"
        overlayClassName="bg-slate-950/70 backdrop-blur-sm fixed inset-0 z-50"
      >
        {/* Level 1 configuration */}
        {violationCount === 1 && (
          <>
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-teal-800 text-xs font-semibold mb-5">
              <Info className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
              <span>Peringatan 1 dari 3</span>
            </div>

            {/* Avatar / Illustration */}
            <div className="w-20 h-20 rounded-full bg-cyan-50 border-2 border-cyan-100 flex items-center justify-center text-4xl mb-4 shadow-xs">
              👧🏻
            </div>

            {/* Title & Description */}
            <DialogHeader className="text-center gap-1 mb-4">
              <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900">
                Jangan Tinggalkan Latihan
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Kamu terdeteksi berpindah tab atau meninggalkan halaman latihan. Silakan kembali ke
                halaman latihan untuk melanjutkan.
              </DialogDescription>
            </DialogHeader>

            {/* Info Box */}
            <div className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-5 text-center leading-relaxed">
              Jika kamu meninggalkan halaman latihan lagi, peringatan berikutnya akan muncul.
            </div>

            {/* Action Button */}
            <Button
              type="button"
              onClick={onDismiss}
              className="w-full h-11 rounded-full font-bold text-slate-900 bg-[#F5B731] hover:bg-[#E5A721] text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer border-0"
            >
              <span>Kembali ke Latihan</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </>
        )}

        {/* Level 2 configuration */}
        {violationCount === 2 && (
          <>
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-semibold mb-5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
              <span>Peringatan 2 dari 3</span>
            </div>

            {/* Avatar / Illustration */}
            <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-4xl mb-4 shadow-xs">
              🧑🏽‍🎓
            </div>

            {/* Title & Description */}
            <DialogHeader className="text-center gap-1 mb-4">
              <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900">
                Perhatian
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Kamu kembali terdeteksi meninggalkan halaman latihan.
              </DialogDescription>
            </DialogHeader>

            {/* Warning Box */}
            <div className="w-full p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 mb-5 flex items-start gap-2 text-left leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                !
              </span>
              <span>
                Ini adalah peringatan ke-2. Tinggal 1 kali toleransi lagi sebelum latihan dihentikan
                otomatis.
              </span>
            </div>

            {/* Action Button */}
            <Button
              type="button"
              onClick={onDismiss}
              className="w-full h-11 rounded-full font-bold text-slate-900 bg-[#F5B731] hover:bg-[#E5A721] text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer border-0"
            >
              <span>Kembali ke Latihan</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </>
        )}

        {/* Level 3 configuration (Peringatan Terakhir) */}
        {violationCount === 3 && (
          <>
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
              <span>Peringatan 3 dari 3 (Toleransi Terakhir)</span>
            </div>

            {/* Avatar / Illustration */}
            <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-4xl mb-4 shadow-xs">
              👩🏻‍💼
            </div>

            {/* Title & Description */}
            <DialogHeader className="text-center gap-1 mb-4">
              <DialogTitle className="text-lg sm:text-xl font-bold text-rose-600">
                Peringatan Terakhir
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                Jika kamu meninggalkan halaman latihan sekali lagi, sesi latihan akan dihentikan
                secara otomatis dan jawabanmu langsung dikumpulkan.
              </DialogDescription>
            </DialogHeader>

            {/* Critical Warning Box */}
            <div className="w-full p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 mb-5 flex items-start gap-2.5 text-left leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                !
              </span>
              <div>
                <div className="font-bold text-rose-700">Batas Toleransi Habis</div>
                <div className="text-rose-600/90 mt-0.5">
                  Toleransi keluar tab ke-4 akan mengunci sesi secara permanen tanpa kesempatan
                  mengulang.
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              type="button"
              onClick={onDismiss}
              className="w-full h-11 rounded-full font-bold text-slate-900 bg-[#F5B731] hover:bg-[#E5A721] text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer border-0"
            >
              <span>Kembali ke Latihan</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
