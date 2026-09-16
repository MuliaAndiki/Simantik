import { ArrowLeft, Clock, LogOut } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/atoms/button';
import { cn } from '@/utils/classname';

export interface TryoutHeaderProps {
  title?: string;
  currentQuestionNumber: number;
  totalQuestions: number;
  formattedTime: string;
  isUrgent?: boolean;
  onBack?: () => void;
  onExit?: () => void;
  className?: string;
}

export const TryoutHeader: React.FC<TryoutHeaderProps> = ({
  title = 'Tryout TKA Bahasa Indonesia #1',
  currentQuestionNumber,
  totalQuestions,
  formattedTime,
  isUrgent = false,
  onBack,
  onExit,
  className,
}) => {
  const paddedCurrent = String(currentQuestionNumber).padStart(2, '0');

  return (
    <header className={cn('w-full flex flex-col gap-4', className)}>
      {/* 1. Breadcrumb row */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors border-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Kembali</span>
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-xs font-semibold text-slate-500">Tryout TKA Bahasa Indonesia</span>
      </div>

      {/* 2. Main title & floating countdown timer bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Exam Title & Question Progress Indicator */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Soal <span className="font-bold text-slate-900">{paddedCurrent}</span> dari{' '}
            <span>{totalQuestions} Soal</span>
          </p>
        </div>

        {/* Right: Sisa Waktu Ujian Countdown Clock + Exit Button */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Timer Capsule matching design */}
          <div
            className={cn(
              'flex items-center gap-3 px-4 py-2 rounded-2xl border transition-colors shadow-xs',
              isUrgent
                ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                : 'bg-[#EAF6F8] border-cyan-100/90 text-slate-900'
            )}
          >
            <div
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                isUrgent ? 'bg-rose-100 text-rose-600' : 'bg-cyan-100/80 text-teal-800'
              )}
            >
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-slate-500">
                Sisa Waktu Ujian
              </span>
              <span className="text-base sm:text-lg font-black tracking-widest font-mono text-slate-900">
                {formattedTime}
              </span>
            </div>
          </div>

          {/* Exit / Submit Action Button */}
          <Button
            type="button"
            variant="outline"
            onClick={onExit}
            aria-label="Akhiri Ujian"
            title="Akhiri Ujian"
            className="w-12 h-12 rounded-2xl bg-[#EAF6F8] hover:bg-slate-200 border border-cyan-100 text-slate-700 flex items-center justify-center cursor-pointer transition-colors shadow-xs shrink-0"
          >
            <LogOut className="w-5 h-5 text-slate-700" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TryoutHeader;
