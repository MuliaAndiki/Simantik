import { AlertTriangle, ArrowRight, CheckCircle2, Clock, Lock, ShieldAlert } from 'lucide-react';
import React from 'react';
import { Button, DialogDescription, DialogHeader, DialogTitle } from '@/components/atoms';
import { ExamDialogShell } from '@/components/molecules/dialog';

export interface TryoutPreStartModalProps {
  isOpen: boolean;
  isChecked: boolean;
  durationMinutes?: number;
  totalQuestions?: number;
  onCheckChange: (checked: boolean) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export const TryoutPreStartModal: React.FC<TryoutPreStartModalProps> = ({
  isOpen,
  isChecked,
  durationMinutes = 90,
  totalQuestions = 30,
  onCheckChange,
  onConfirm,
  onClose,
}) => {
  return (
    <ExamDialogShell
      isOpen={isOpen}
      onCancel={onClose}
      contentClassName="max-w-lg p-6 sm:p-8 flex flex-col gap-6"
    >
      <DialogHeader className="text-center sm:text-left gap-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-teal-800 text-xs font-bold w-fit mb-1">
          <ShieldAlert className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
          <span>Tata Tertib Simulasi Tryout</span>
        </div>
        <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Aturan Pengerjaan Tryout
        </DialogTitle>
        <DialogDescription className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
          Harap membaca dan memahami ketentuan sistem adaptif dan proctoring sebelum memulai sesi
          ujian.
        </DialogDescription>
      </DialogHeader>

      {/* List of 4 Rules Cards */}
      <div className="space-y-3">
        {/* Rule 1: Countdown Timer */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-cyan-100/80 text-teal-800 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-900">
              Alokasi Waktu {durationMinutes} Menit ({totalQuestions} Soal)
            </div>
            <div className="text-slate-500 mt-0.5 leading-relaxed">
              Timer berjalan otomatis saat tombol mulai diklik. Jika waktu habis, jawabanmu akan
              langsung dikumpulkan dan dinilai secara otomatis.
            </div>
          </div>
        </div>

        {/* Rule 2: Adaptive Locking */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-amber-950">Mode Pembelajaran Adaptif (Terkunci)</div>
            <div className="text-amber-800/90 mt-0.5 leading-relaxed">
              Soal dikerjakan secara bertahap. Soal berikutnya ditentukan oleh algoritma adaptif,
              sehingga kamu tidak dapat melompati soal ataupun kembali ke butir soal sebelumnya.
            </div>
          </div>
        </div>

        {/* Rule 3: Anti-Cheating & Auto-Submit */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-rose-950">Sistem Anti-Kecurangan Terpadu</div>
            <div className="text-rose-800/90 mt-0.5 leading-relaxed">
              Dilarang meninggalkan layar atau berpindah tab. Batas toleransi maksimal adalah 3 kali
              peringatan. Pelanggaran ke-4 akan langsung memfinalisasi ujian otomatis.
            </div>
          </div>
        </div>
      </div>

      {/* Agreement Checkbox */}
      <label
        htmlFor="tryout-prestart-checkbox"
        className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#EAF6F8]/60 border border-cyan-200 cursor-pointer select-none transition-colors hover:bg-[#EAF6F8]"
      >
        <input
          id="tryout-prestart-checkbox"
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onCheckChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded text-teal-700 focus:ring-teal-600 border-slate-300"
        />
        <span className="text-xs font-semibold text-slate-800 leading-snug">
          Saya memahami seluruh aturan ujian adaptif di atas dan bersedia mengerjakan secara jujur
          serta mandiri.
        </span>
      </label>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="w-full sm:w-auto h-11 px-5 rounded-full border-slate-200 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-50"
        >
          Batal
        </Button>

        <Button
          type="button"
          disabled={!isChecked}
          onClick={onConfirm}
          className="w-full sm:w-auto h-11 px-6 rounded-full font-black text-slate-900 text-xs bg-[#F5B731] hover:bg-[#E5A721] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs flex items-center justify-center gap-2 border-0 cursor-pointer transition-transform active:scale-95"
        >
          <span>Mulai Tryout Sekarang</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" aria-hidden="true" />
        </Button>
      </div>
    </ExamDialogShell>
  );
};

export default TryoutPreStartModal;
