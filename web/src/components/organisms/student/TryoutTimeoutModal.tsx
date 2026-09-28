import { ArrowRight, BarChart2, CheckCircle2, Clock, Hourglass, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Button, DialogDescription, DialogHeader, DialogTitle } from '@/components/atoms';
import { ExamDialogShell } from '@/components/molecules/dialog';

export interface TryoutTimeoutModalProps {
  isOpen: boolean;
  tryoutTitle?: string;
  totalQuestions: number;
  answeredCount: number;
  durationMinutes?: number;
  onProceed: () => void;
}

export const TryoutTimeoutModal: React.FC<TryoutTimeoutModalProps> = ({
  isOpen,
  tryoutTitle = 'TKA Bahasa Indonesia #1',
  totalQuestions,
  answeredCount,
  durationMinutes = 75,
  onProceed,
}) => {
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);

  return (
    <ExamDialogShell
      isOpen={isOpen}
      dismissable={false}
      contentClassName="max-w-md p-6 sm:p-7 flex flex-col items-center text-center gap-0 select-none"
    >
      {/* Top Pink/Rose Circle Icon with Lock & Clock */}
      <div className="w-16 h-16 rounded-full overflow-hidden mb-3 flex items-center justify-center shadow-xs">
        <Image
          src="/images/tryout-timeout-lock.png"
          alt="Waktu Habis"
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Timer Ended Capsule */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-3">
        <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0" aria-hidden="true" />
        <span>Timer: 00:00:00 • Sesi Ditutup Otomatis</span>
      </div>

      {/* Title & Description */}
      <DialogHeader className="text-center gap-1.5 mb-4">
        <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Waktu Ujian Telah Habis!
        </DialogTitle>
        <DialogDescription className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
          Waktu {durationMinutes} menit telah berakhir. Jawaban Anda telah dikunci dan berhasil
          disimpan oleh sistem SIMANTIK. Tryout Anda telah selesai.
        </DialogDescription>
      </DialogHeader>

      {/* 1. Ringkasan Akhir Pengerjaan Box */}
      <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-3 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 text-xs font-bold text-slate-900">
          <span className="uppercase tracking-wider">Ringkasan Akhir Pengerjaan</span>
          <span className="font-extrabold text-teal-800">{tryoutTitle}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 text-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Total Soal</span>
            <span className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              {totalQuestions} Soal
            </span>
          </div>
          <div className="flex flex-col border-x border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Terjawab</span>
            <span className="text-base sm:text-lg font-black text-teal-800 mt-0.5">
              {answeredCount} Soal
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Belum Dijawab</span>
            <span className="text-base sm:text-lg font-black text-rose-600 mt-0.5">
              {unansweredCount} Soal
            </span>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-200/80 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Waktu Pengerjaan</span>
          <p className="text-xs font-black text-slate-900 mt-0.5">
            {durationMinutes} Menit Penuh (00:00)
          </p>
        </div>
      </div>

      {/* 2. Sinkronisasi Berkas Ujian Pusmendik Box */}
      <div className="w-full p-3.5 rounded-2xl bg-[#EAF6F8]/80 border border-cyan-200/90 mb-5 text-left text-xs">
        <div className="flex items-center justify-between font-bold text-slate-900 mb-2">
          <div className="flex items-center gap-1.5 text-teal-900">
            <RefreshCw className="w-3.5 h-3.5 text-teal-700 animate-spin" aria-hidden="true" />
            <span>Sinkronisasi Berkas Ujian Pusmendik</span>
          </div>
          <span className="text-teal-800 text-[11px] font-bold">100% Selesai</span>
        </div>

        <div className="space-y-1.5 text-[11px] text-slate-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Mengunci lembar jawaban dan segel integritas... Selesai</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Sinkronisasi kriptografi sesi lokal & cloud... Berhasil</span>
          </div>
          <div className="flex items-center gap-2 text-amber-800 font-medium">
            <Hourglass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Menghitung skor evaluasi kompetensi Pusmendik...</span>
          </div>
        </div>
      </div>

      {/* Action Button: Lihat Hasil & Rapor Tryout */}
      <Button
        type="button"
        onClick={onProceed}
        className="w-full h-12 rounded-full font-black text-slate-900 text-sm bg-[#F5B731] hover:bg-[#E5A721] shadow-xs flex items-center justify-center gap-2 border-0 cursor-pointer transition-transform active:scale-95 mb-2"
      >
        <BarChart2 className="w-4 h-4 text-slate-900" aria-hidden="true" />
        <span>Lihat Hasil & Rapor Tryout</span>
        <ArrowRight className="w-4 h-4 stroke-[3]" aria-hidden="true" />
      </Button>

      <p className="text-[11px] text-slate-400 font-medium">
        Sistem akan mengarahkan otomatis dalam beberapa detik atau klik tombol di atas.
      </p>
    </ExamDialogShell>
  );
};

export default TryoutTimeoutModal;
