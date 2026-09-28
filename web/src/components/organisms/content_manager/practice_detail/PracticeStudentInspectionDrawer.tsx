import {
  Award,
  CheckCircle2,
  Clock,
  History,
  Info,
  Monitor,
  RotateCcw,
  UserCheck,
} from 'lucide-react';
import React from 'react';
import type { PracticeStudentResultItem } from '@/types/service';

export interface PracticeStudentInspectionDrawerProps {
  student: PracticeStudentResultItem | null;
  packageTitle: string;
  onViewResult?: (student: PracticeStudentResultItem) => void;
}

export const PracticeStudentInspectionDrawer: React.FC<PracticeStudentInspectionDrawerProps> = ({
  student,
  packageTitle,
  onViewResult,
}) => {
  if (!student) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 text-center text-slate-400 space-y-2">
        <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
        <p className="font-bold text-slate-700 text-sm">Pilih Siswa</p>
        <p className="text-xs text-slate-400">
          Klik baris siswa pada tabel untuk melihat detail hasil dan waktu pengerjaan latihan.
        </p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return 'S';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isCompleted = student.status === 'completed';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#0E7490]" />
          <span className="text-xs font-black tracking-wider text-slate-800 uppercase">
            PRATINJAU HASIL SISWA TERPILIH
          </span>
        </div>
        <span className="bg-cyan-100 text-cyan-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
          Aktif Terpilih
        </span>
      </div>

      {/* Selected Student Profile */}
      <div className="flex items-start gap-4">
        <div className="w-13 h-13 rounded-2xl bg-cyan-100 text-cyan-800 font-black text-base flex items-center justify-center shrink-0 border border-cyan-200">
          {getInitials(student.student_name)}
        </div>

        <div className="space-y-1">
          <h3 className="font-black text-slate-900 text-base leading-tight">
            {student.student_name}
          </h3>
          <p className="text-xs font-semibold text-slate-500">NIS: {student.nis || '-'}</p>
          <p className="text-[11px] font-medium text-slate-500">
            {student.grade || 'Kelas Siswa'} • {student.student_email}
          </p>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-700">Akun Siswa Aktif</span>
          </div>
        </div>
      </div>

      {/* Performance Details Box */}
      <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 space-y-3.5 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500 font-medium">Status Pengerjaan</span>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 text-[#059669] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selesai</span>
            </span>
          ) : student.status === 'in_progress' ? (
            <span className="inline-flex items-center gap-1 text-[#D97706] font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Sedang Mengerjakan</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Belum Mengerjakan</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
          <span className="text-slate-500 font-medium">Skor Akhir Latihan</span>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 text-[#0E7490] font-black text-sm bg-cyan-50 px-2.5 py-0.5 rounded-lg border border-cyan-200/60">
              <Award className="w-4 h-4 text-[#0E7490]" />
              <span>{student.score} / 100</span>
            </span>
          ) : (
            <span className="text-slate-400 font-bold">-</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500 font-medium">Hasil Jawaban</span>
          {isCompleted ? (
            <span className="font-bold text-slate-800">
              <strong className="text-emerald-600 font-bold">
                {student.correct_answers} Benar
              </strong>
              {' • '}
              <strong className="text-rose-600 font-bold">{student.incorrect_answers} Salah</strong>
            </span>
          ) : (
            <span className="text-slate-400 font-bold">-</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500 font-medium">Durasi Pengerjaan</span>
          <span className="font-bold text-slate-800">
            {isCompleted ? student.formatted_duration || `${student.duration_minutes} menit` : '-'}
          </span>
        </div>

        <div className="space-y-1 pt-1 border-t border-slate-200/60">
          <span className="text-slate-500 font-medium block">Perangkat &amp; Browser</span>
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Monitor className="w-3.5 h-3.5 text-slate-400" />
            <span>{student.device_browser || 'Desktop (Chrome / Web Client)'}</span>
          </div>
        </div>
      </div>

      {/* Log Sesi Akses & Pengerjaan */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-black text-slate-400 tracking-wider uppercase">
            RIWAYAT PENGERJAAN LATIHAN
          </span>
        </div>

        {isCompleted ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <span className="text-[#0E7490] font-black">→</span>
                <span>Sesi Selesai (Skor: {student.score})</span>
              </div>
              <span className="text-slate-500 font-medium text-[11px]">
                {student.formatted_completed_at || '-'}
              </span>
            </div>

            {onViewResult && (
              <button
                type="button"
                onClick={() => onViewResult(student)}
                className="w-full mt-2 py-2.5 px-4 bg-[#134653] hover:bg-[#0B2D38] text-white text-xs font-bold rounded-xl shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lihat Lembar Jawaban Lengkap</span>
                <span className="text-base font-normal">→</span>
              </button>
            )}
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-400 font-medium">
            {student.status === 'in_progress'
              ? 'Siswa sedang mengerjakan paket latihan ini.'
              : 'Siswa belum pernah memulai paket latihan ini.'}
          </div>
        )}
      </div>

      {/* Bottom Informational Callout */}
      <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-3.5 flex items-start gap-2.5 text-xs">
        <Info className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold text-[#0369A1] block">Informasi Pengerjaan</strong>
          <p className="text-[#0C4A6E] leading-relaxed text-[11px]">
            Hasil skor, jumlah jawaban benar/salah, serta durasi tercatat secara otomatis saat siswa
            mengirimkan lembar jawaban latihan melalui portal SIMANTIK Siswa.
          </p>
        </div>
      </div>
    </div>
  );
};
