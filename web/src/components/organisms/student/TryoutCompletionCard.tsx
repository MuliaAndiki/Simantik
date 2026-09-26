import {
  ArrowRight,
  CheckCircle2,
  CheckSquare,
  Clock,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Button } from '@/components/atoms/button';
import { cn } from '@/utils/classname';

export interface TryoutCompletionCardProps {
  tryoutTitle?: string;
  totalQuestions: number;
  answeredCount: number;
  durationMinutes: number;
  timeTakenMinutes?: number;
  studentEmail?: string;
  submittedAtFormatted?: string;
  isAutoSubmitted?: boolean;
  onBackToDashboard: () => void;
  onReviewAnswers?: () => void;
  className?: string;
}

export const TryoutCompletionCard: React.FC<TryoutCompletionCardProps> = ({
  tryoutTitle = 'Tryout TKA Bahasa Indonesia',
  totalQuestions = 30,
  answeredCount = 30,
  durationMinutes = 75,
  timeTakenMinutes = 68,
  studentEmail = 'anindya@smanmosaarun.sch.id',
  submittedAtFormatted = 'Hari ini, 11:15 WIB',
  isAutoSubmitted = false,
  onBackToDashboard,
  onReviewAnswers,
  className,
}) => {
  const isAllAnswered = answeredCount >= totalQuestions;

  return (
    <div
      className={cn('w-full max-w-xl mx-auto flex flex-col items-center select-none', className)}
    >
      {/* Centered Master Card */}
      <div className="w-full bg-white rounded-[32px] border border-slate-100 shadow-xl p-6 sm:p-9 flex flex-col items-center text-center gap-6">
        {/* Top Avatar with Yellow Checkmark Badge */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
          <Image
            src="/images/tryout-avatar-success.png"
            alt="Tryout Selesai"
            width={96}
            height={96}
            priority
            className="w-full h-full object-contain"
          />
        </div>

        {/* Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#EAF6F8] border border-cyan-200 text-teal-800 text-xs font-bold -mt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
          <span className="uppercase tracking-wider">SIMANTIK TKA BAHASA INDONESIA</span>
        </div>

        {/* Title & Subtitle */}
        <div className="-mt-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tryout Selesai!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Kamu sudah menyelesaikan {tryoutTitle}
          </p>

          {/* Submission Timestamp Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 font-medium mt-3">
            <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>Diserahkan pada: {submittedAtFormatted}</span>
          </div>
        </div>

        {/* 2 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
          {/* Card 1: Pengerjaan */}
          <div className="p-4 rounded-2xl bg-[#F0FDF9] border border-teal-100/90 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-100/80 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
              <CheckSquare className="w-5 h-5 text-teal-700" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Pengerjaan
              </span>
              <span className="text-sm sm:text-base font-black text-slate-900 block mt-0.5">
                {answeredCount} dari {totalQuestions} soal
              </span>
              <span className="text-[11px] text-teal-700 font-semibold block mt-0.5">
                {isAllAnswered
                  ? 'Seluruh soal terjawab lengkap'
                  : `${totalQuestions - answeredCount} butir belum terisi`}
              </span>
            </div>
          </div>

          {/* Card 2: Durasi Sesi */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100/90 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-5 h-5 text-amber-700" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Durasi Sesi
              </span>
              <span className="text-sm sm:text-base font-black text-slate-900 block mt-0.5">
                Waktu: {timeTakenMinutes} menit
              </span>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                Dari alokasi batas {durationMinutes} menit
              </span>
            </div>
          </div>
        </div>

        {/* Status Saved Card */}
        <div className="w-full p-4 rounded-2xl bg-[#EAF6F8]/80 border border-cyan-200/90 flex items-start gap-3.5 text-left">
          <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-teal-950 flex items-center gap-1.5">
              <span>
                {isAutoSubmitted ? 'Sesi difinalisasi otomatis' : 'Jawaban berhasil disimpan'}
              </span>
              <span className="w-2 h-2 rounded-full bg-teal-500" />
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
              Seluruh jawaban kamu telah dikunci dan berhasil disimpan oleh sistem SIMANTIK. Tryout
              kamu telah selesai.
            </p>
          </div>
        </div>

        {/* Email Notification Card */}
        <div className="w-full p-5 rounded-2xl bg-cyan-50/40 border border-cyan-100/80 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Mail className="w-4 h-4 text-teal-700" aria-hidden="true" />
                <span>Hasil tryout akan dikirim</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hasil tryout akan dikirim ke email yang terdaftar di akun SIMANTIK:
              </p>

              {/* Email Address Capsule */}
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{studentEmail}</span>
              </div>

              {/* You will receive section */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Kamu akan menerima:
                </span>
                <div className="space-y-1 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Nilai hasil tryout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Detail jawaban</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Pembahasan soal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Illustration */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white border border-cyan-100 p-1 flex items-center justify-center shadow-2xs shrink-0 self-center">
              <Image
                src="/images/tryout-email-student.png"
                alt="Pengiriman Hasil Tryout"
                width={128}
                height={128}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto print:hidden">
          <Button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto h-12 px-6 rounded-full font-black text-slate-700 border-2 border-slate-300 bg-white hover:bg-slate-50 text-sm flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Cetak Hasil
          </Button>
          {onReviewAnswers && (
            <Button
              type="button"
              onClick={onReviewAnswers}
              className="w-full sm:w-auto h-12 px-8 rounded-full font-black text-teal-900 border-2 border-teal-700 bg-white hover:bg-teal-50 text-sm flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              Pembahasan & Review Soal
            </Button>
          )}
          <Button
            type="button"
            onClick={onBackToDashboard}
            className="w-full sm:w-auto h-12 px-8 rounded-full font-black text-slate-900 text-sm bg-[#F5B731] hover:bg-[#E5A721] shadow-xs flex items-center justify-center gap-2 border-0 cursor-pointer transition-transform active:scale-95"
          >
            Kembali ke Dashboard
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Support Footer Note */}
      <div className="text-center text-xs text-slate-500 leading-relaxed mt-6 max-w-md">
        Butuh bantuan atau salah mencantumkan alamat email? Silakan hubungi proktor sekolah atau
        layanan bantuan di{' '}
        <span className="font-semibold text-teal-800">Pusat Dukungan SIMANTIK</span>.
      </div>
    </div>
  );
};

export default TryoutCompletionCard;
