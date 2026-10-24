import { ArrowLeft, Send, ShieldCheck } from 'lucide-react';
import React from 'react';
import { Button, DialogDescription, DialogHeader, DialogTitle } from '@/components/atoms';
import { ExamDialogShell } from '@/components/molecules/dialog';

export interface TryoutConfirmModalProps {
  isOpen: boolean;
  type: 'exit' | 'submit';
  answeredCount: number;
  totalQuestions: number;
  remainingTimeFormatted?: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const TryoutConfirmModal: React.FC<TryoutConfirmModalProps> = ({
  isOpen,
  type,
  answeredCount,
  totalQuestions,
  remainingTimeFormatted = '24:15',
  isSubmitting = false,
  onCancel,
  onConfirm,
}) => {
  const isExit = type === 'exit';
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);
  const percentComplete =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const isAllAnswered = unansweredCount === 0;

  // Format "01 : 13 : 44" -> "01:13:44" agar pas di dalam kartu tanpa overflow
  const cleanRemainingTime = (remainingTimeFormatted || '00:00:00').replace(/\s*:\s*/g, ':');

  return (
    <ExamDialogShell
      isOpen={isOpen}
      onCancel={onCancel}
      contentClassName="w-full max-w-lg sm:max-w-xl p-5 sm:p-7 border flex flex-col items-center text-center gap-0 select-none max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden"
    >
      {/* Title & Description */}
      <DialogHeader className="text-center gap-1 mb-4 sm:mb-5 max-w-lg mx-auto">
        <DialogTitle className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug">
          {isExit
            ? 'Konfirmasi Akhiri & Keluar Tryout'
            : isAllAnswered
              ? 'Luar Biasa! Semua Soal Telah Terjawab'
              : 'Konfirmasi Kumpulkan Lembar Jawaban'}
        </DialogTitle>
        <DialogDescription className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed mt-1">
          {isExit
            ? 'Apakah kamu yakin ingin menyelesaikan dan keluar dari sesi tryout sekarang? Jawaban yang tersimpan akan langsung dikumpulkan.'
            : isAllAnswered
              ? `Kamu telah menjawab seluruh ${totalQuestions} butir soal tryout dengan lengkap. Apakah kamu yakin ingin mengirimkan lembar jawaban sekarang?`
              : `Kamu telah menjawab ${answeredCount} dari ${totalQuestions} butir soal (${unansweredCount} belum terisi). Apakah kamu yakin ingin mengirimkan lembar jawaban sekarang?`}
        </DialogDescription>
      </DialogHeader>

      {/* 4 Stats Cards in Light Cyan Container */}
      <div className="w-full p-2.5 sm:p-3 rounded-2xl bg-[#EAF6F8]/80 border border-cyan-100/80 mb-4 sm:mb-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {/* Total Soal */}
          <div className="bg-white rounded-xl px-2 py-2.5 sm:px-2.5 sm:py-3 shadow-2xs flex flex-col items-center justify-center border border-slate-100 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center truncate max-w-full">
              Total Soal
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 mt-0.5 tabular-nums">
              {totalQuestions}
            </span>
            <span className="text-[10px] text-slate-500 font-medium truncate max-w-full">
              Soal Ujian
            </span>
          </div>

          {/* Terjawab */}
          <div className="bg-white rounded-xl px-2 py-2.5 sm:px-2.5 sm:py-3 shadow-2xs flex flex-col items-center justify-center border border-slate-100 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center truncate max-w-full">
              Terjawab
            </span>
            <span className="text-base sm:text-lg font-black text-teal-800 mt-0.5 tabular-nums">
              {answeredCount}
            </span>
            <span className="text-[10px] text-teal-700 font-bold truncate max-w-full">
              {percentComplete}% Lengkap
            </span>
          </div>

          {/* Belum Dijawab */}
          <div className="bg-white rounded-xl px-2 py-2.5 sm:px-2.5 sm:py-3 shadow-2xs flex flex-col items-center justify-center border border-slate-100 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center truncate max-w-full">
              Belum Dijawab
            </span>
            <span
              className={`text-base sm:text-lg font-black mt-0.5 tabular-nums ${
                unansweredCount === 0 ? 'text-slate-900' : 'text-rose-600'
              }`}
            >
              {unansweredCount}
            </span>
            <span className="text-[10px] text-slate-500 font-medium truncate max-w-full">
              {unansweredCount === 0 ? 'Semua Terisi' : 'Belum Terisi'}
            </span>
          </div>

          {/* Sisa Waktu */}
          <div className="bg-white rounded-xl px-2 py-2.5 sm:px-2.5 sm:py-3 shadow-2xs flex flex-col items-center justify-center border border-slate-100 min-w-0 overflow-hidden">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center truncate max-w-full">
              Sisa Waktu
            </span>
            <span className="text-xs sm:text-sm md:text-base font-black text-teal-800 mt-0.5 font-mono tracking-tight tabular-nums truncate max-w-full">
              {cleanRemainingTime}
            </span>
            <span className="text-[10px] text-slate-500 font-medium truncate max-w-full">
              Waktu Tersisa
            </span>
          </div>
        </div>
      </div>

      {/* Information Box with ShieldCheck */}
      <div className="w-full p-3 sm:p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200/90 mb-5 sm:mb-6 flex items-start gap-2.5 sm:gap-3 text-left text-xs">
        <ShieldCheck
          className="w-4 h-4 sm:w-5 sm:h-5 text-teal-700 shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <div className="font-bold text-teal-950 text-xs sm:text-sm leading-snug">
            {isExit
              ? 'Sesi Ujian Akan Segera Ditutup'
              : isAllAnswered
                ? 'Seluruh Lembar Jawaban Telah Lengkap'
                : 'Perhatian: Ada Soal Belum Terjawab'}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mt-0.5">
            {isExit
              ? 'Setelah keluar, jawaban yang telah tersimpan akan dievaluasi dan kamu tidak dapat melanjutkan ujian ini kembali.'
              : isAllAnswered
                ? 'Tidak ada soal yang terlewat atau bertanda ragu-ragu. Setelah dikirim, jawaban akan dikunci dan tidak dapat diubah. Pastikan seluruh jawaban Anda sudah diperiksa sebelum mengirimkan tryout.'
                : 'Masih ada butir soal yang belum terjawab atau bertanda ragu-ragu. Setelah dikirim, jawaban akan dikunci dan tidak dapat diubah.'}
          </p>
        </div>
      </div>

      {/* Action Buttons matching Submit.png */}
      <div className="w-full flex flex-col-reverse sm:flex-row items-center gap-2.5 sm:gap-3 shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full sm:flex-1 h-11 sm:h-12 rounded-full bg-[#EAF6F8] hover:bg-cyan-100/70 border border-cyan-200 text-teal-800 font-bold text-xs sm:text-sm cursor-pointer transition-colors px-3 sm:px-4 flex items-center justify-center gap-1.5 min-w-0"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Periksa Kembali Jawaban</span>
        </Button>

        <Button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className="w-full sm:flex-1 h-11 sm:h-12 rounded-full font-black text-xs sm:text-sm bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 shadow-xs flex items-center justify-center gap-1.5 border-0 cursor-pointer transition-transform active:scale-95 px-3 sm:px-4 min-w-0"
        >
          {!isSubmitting && <Send className="w-4 h-4 text-slate-900 shrink-0" aria-hidden="true" />}
          <span className="truncate">
            {isExit ? 'Ya, Akhiri & Keluar' : 'Ya, Kumpulkan & Selesaikan'}
          </span>
        </Button>
      </div>
    </ExamDialogShell>
  );
};

export default TryoutConfirmModal;
