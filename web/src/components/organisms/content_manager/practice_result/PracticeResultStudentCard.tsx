import { Calendar, CheckCircle2, Clock, FileText, ShieldCheck } from 'lucide-react';
import React from 'react';

export interface PracticeResultStudentCardProps {
  studentName: string;
  studentEmail: string;
  studentNis: string;
  studentGrade: string;
  packageTitle: string;
  totalQuestions: number;
  durationMinutes: number;
  formattedCompletedAt: string;
  statusLabel?: string;
}

export const PracticeResultStudentCard: React.FC<PracticeResultStudentCardProps> = ({
  studentName,
  studentEmail,
  studentNis,
  studentGrade,
  packageTitle,
  totalQuestions,
  durationMinutes,
  formattedCompletedAt,
  statusLabel = 'Selesai',
}) => {
  const getInitials = (name: string) => {
    if (!name) return 'S';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Student Identity */}
        <div className="flex items-start sm:items-center gap-4">
          {/* Avatar Container with Shield Check Badge */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-100/80 text-[#0E7490] font-black text-lg sm:text-xl flex items-center justify-center border border-cyan-200 shadow-2xs">
              {getInitials(studentName)}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#134653] text-white p-1 rounded-full border-2 border-white shadow-xs">
              <ShieldCheck className="w-3 h-3" />
            </div>
          </div>

          {/* Student Info */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {studentName || 'Nama Siswa'}
              </h2>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-[#E8F8F3] text-[#059669] border border-emerald-200/60">
                <CheckCircle2 className="w-3 h-3" />
                <span>{statusLabel}</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              NIS: <strong className="text-slate-700 font-semibold">{studentNis || '-'}</strong>
              {' • '}
              {studentGrade || 'Kelas XII'}
              {' • '}
              <span className="text-slate-600">{studentEmail}</span>
            </p>

            {/* Package Name Pill */}
            <div className="pt-0.5">
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-[#EAF6F8] text-[#0E7490] border border-[#0E7490]/15">
                Paket Latihan: {packageTitle || 'Pemahaman Wacana'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: 3 Summary Stat Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 lg:shrink-0">
          {/* Jumlah Soal */}
          <div className="flex items-center gap-3 p-3 sm:px-4 sm:py-3 rounded-xl bg-[#EAF6F8]/80 border border-[#0E7490]/15">
            <div className="w-8 h-8 rounded-lg bg-white/80 text-[#0E7490] flex items-center justify-center shrink-0 shadow-2xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                Jumlah Soal
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-900">{totalQuestions} Butir</p>
            </div>
          </div>

          {/* Durasi Waktu */}
          <div className="flex items-center gap-3 p-3 sm:px-4 sm:py-3 rounded-xl bg-[#EAF6F8]/80 border border-[#0E7490]/15">
            <div className="w-8 h-8 rounded-lg bg-white/80 text-[#0E7490] flex items-center justify-center shrink-0 shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                Durasi Waktu
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-900">{durationMinutes} Menit</p>
            </div>
          </div>

          {/* Waktu Selesai */}
          <div className="flex items-center gap-3 p-3 sm:px-4 sm:py-3 rounded-xl bg-[#EAF6F8]/80 border border-[#0E7490]/15">
            <div className="w-8 h-8 rounded-lg bg-white/80 text-[#0E7490] flex items-center justify-center shrink-0 shadow-2xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                Waktu Selesai
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-900 whitespace-nowrap">
                {formattedCompletedAt || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeResultStudentCard;
