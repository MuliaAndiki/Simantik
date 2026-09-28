import { AlertCircle, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import React from 'react';
import { Button, DialogDescription, DialogHeader, DialogTitle } from '@/components/atoms';
import { ExamDialogShell } from '@/components/molecules/dialog';
import { cn } from '@/utils/classname';

export interface PracticeProctoringWarningModalProps {
  isOpen: boolean;
  violationCount: number; // 1, 2, or 3
  onDismiss: () => void;
}

interface WarningLevelConfig {
  badgeClass: string;
  badgeIcon: React.ReactNode;
  badgeText: string;
  avatarClass: string;
  avatar: string;
  title: string;
  titleClass?: string;
  description: string;
  infoBox: React.ReactNode;
}

const WARNING_LEVELS: Record<number, WarningLevelConfig> = {
  1: {
    badgeClass: 'bg-cyan-50 border-cyan-200 text-teal-800',
    badgeIcon: <Info className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />,
    badgeText: 'Peringatan 1 dari 3',
    avatarClass: 'bg-cyan-50 border-cyan-100',
    avatar: '👧🏻',
    title: 'Jangan Tinggalkan Latihan',
    description:
      'Kamu terdeteksi berpindah tab atau meninggalkan halaman latihan. Silakan kembali ke halaman latihan untuk melanjutkan.',
    infoBox: (
      <div className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-5 text-center leading-relaxed">
        Jika kamu meninggalkan halaman latihan lagi, peringatan berikutnya akan muncul.
      </div>
    ),
  },
  2: {
    badgeClass: 'bg-amber-50 border-amber-300 text-amber-800',
    badgeIcon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />,
    badgeText: 'Peringatan 2 dari 3',
    avatarClass: 'bg-amber-50 border-amber-200',
    avatar: '🧑🏽‍🎓',
    title: 'Perhatian',
    description: 'Kamu kembali terdeteksi meninggalkan halaman latihan.',
    infoBox: (
      <div className="w-full p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 mb-5 flex items-start gap-2 text-left leading-relaxed">
        <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
          !
        </span>
        <span>
          Ini adalah peringatan ke-2. Tinggal 1 kali toleransi lagi sebelum latihan dihentikan
          otomatis.
        </span>
      </div>
    ),
  },
  3: {
    badgeClass: 'bg-rose-50 border-rose-200 text-rose-700',
    badgeIcon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />,
    badgeText: 'Peringatan 3 dari 3 (Toleransi Terakhir)',
    avatarClass: 'bg-rose-50 border-rose-200',
    avatar: '👩🏻‍💼',
    title: 'Peringatan Terakhir',
    titleClass: 'text-rose-600',
    description:
      'Jika kamu meninggalkan halaman latihan sekali lagi, sesi latihan akan dihentikan secara otomatis dan jawabanmu langsung dikumpulkan.',
    infoBox: (
      <div className="w-full p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 mb-5 flex items-start gap-2.5 text-left leading-relaxed">
        <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
          !
        </span>
        <div>
          <div className="font-bold text-rose-700">Batas Toleransi Habis</div>
          <div className="text-rose-600/90 mt-0.5">
            Toleransi keluar tab ke-4 akan mengunci sesi secara permanen tanpa kesempatan mengulang.
          </div>
        </div>
      </div>
    ),
  },
};

export const PracticeProctoringWarningModal: React.FC<PracticeProctoringWarningModalProps> = ({
  isOpen,
  violationCount,
  onDismiss,
}) => {
  const isDialogActive = isOpen && violationCount >= 1 && violationCount <= 3;
  const config = WARNING_LEVELS[violationCount];
  if (!config) return null;

  return (
    <ExamDialogShell
      isOpen={isDialogActive}
      onCancel={onDismiss}
      contentClassName="max-w-md p-6 sm:p-7 flex flex-col items-center text-center gap-0"
    >
      <div
        className={cn(
          'inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-semibold mb-5',
          config.badgeClass
        )}
      >
        {config.badgeIcon}
        <span>{config.badgeText}</span>
      </div>

      <div
        className={cn(
          'w-20 h-20 rounded-full border-2 flex items-center justify-center text-4xl mb-4 shadow-xs',
          config.avatarClass
        )}
      >
        {config.avatar}
      </div>

      <DialogHeader className="text-center gap-1 mb-4">
        <DialogTitle
          className={cn('text-lg sm:text-xl font-bold text-slate-900', config.titleClass)}
        >
          {config.title}
        </DialogTitle>
        <DialogDescription className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          {config.description}
        </DialogDescription>
      </DialogHeader>

      {config.infoBox}

      <Button
        type="button"
        onClick={onDismiss}
        className="w-full h-11 rounded-full font-bold text-slate-900 bg-[#F5B731] hover:bg-[#E5A721] text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer border-0"
      >
        <span>Kembali ke Latihan</span>
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Button>
    </ExamDialogShell>
  );
};
