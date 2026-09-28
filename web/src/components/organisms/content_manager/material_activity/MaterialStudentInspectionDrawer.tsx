import { CheckCircle2, Clock, History, Info, Monitor, RotateCcw, UserCheck } from 'lucide-react';
import React from 'react';
import type { MaterialStudentActivityItem } from '@/types/service';

export interface MaterialStudentInspectionDrawerProps {
  student: MaterialStudentActivityItem | null;
  materialTitle: string;
}

export const MaterialStudentInspectionDrawer: React.FC<MaterialStudentInspectionDrawerProps> = ({
  student,
  materialTitle,
}) => {
  if (!student) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 text-center text-slate-400 space-y-2">
        <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
        <p className="font-bold text-slate-700 text-sm">Pilih Siswa</p>
        <p className="text-xs text-slate-400">
          Klik baris siswa pada tabel di sebelah kiri untuk melihat rincian aktivitas dan riwayat
          akses.
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#0E7490]" />
          <span className="text-xs font-black tracking-wider text-slate-800 uppercase">
            PRATINJAU AKSES SISWA TERPILIH
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

      {/* Access Details Box */}
      <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 space-y-3 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500 font-medium">Status Materi Ini</span>
          {student.is_accessed ? (
            <span className="inline-flex items-center gap-1 text-[#059669] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sudah Diakses</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Belum Diakses</span>
            </span>
          )}
        </div>

        <div className="space-y-1">
          <span className="text-slate-500 font-medium block">Terakhir Mengakses Materi Ini</span>
          <p className="font-bold text-slate-900">
            {student.is_accessed && student.formatted_last_accessed
              ? student.formatted_last_accessed
              : 'Belum pernah mengakses'}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-slate-500 font-medium block">Perangkat &amp; Browser</span>
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Monitor className="w-3.5 h-3.5 text-slate-400" />
            <span>{student.device_browser || 'Desktop (Chrome / Web Client)'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
          <span className="text-slate-500 font-medium">Riwayat Akses Modul Ini</span>
          <span className="bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded-md text-[11px]">
            {student.access_count || (student.is_accessed ? 1 : 0)} kali sesi akses
          </span>
        </div>
      </div>

      {/* Log Sesi Akses Modul */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-black text-slate-400 tracking-wider uppercase">
            LOG SESI AKSES MODUL
          </span>
        </div>

        {student.logs && student.logs.length > 0 ? (
          <div className="space-y-2">
            {student.logs.map((log, i) => {
              const isFirst = i === student.logs.length - 1;
              const isLast = i === 0;

              return (
                <div
                  key={`${log.session_number}-${log.timestamp}`}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    {isLast ? (
                      <span className="text-[#0E7490] font-black">→</span>
                    ) : (
                      <RotateCcw className="w-3 h-3 text-slate-400" />
                    )}
                    <span>
                      Sesi {log.session_number}{' '}
                      {isLast ? '(Terakhir)' : isFirst ? '(Akses Perdana)' : ''}
                    </span>
                  </div>

                  <span className="text-slate-500 font-medium text-[11px]">
                    {log.formatted_time || log.timestamp}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-400 font-medium">
            {student.is_accessed
              ? '1 Sesi Akses Tercatat'
              : 'Belum ada riwayat sesi akses siswa ini.'}
          </div>
        )}
      </div>

      {/* Bottom Informational Callout */}
      <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-3.5 flex items-start gap-2.5 text-xs">
        <Info className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold text-[#0369A1] block">Informasi Akses</strong>
          <p className="text-[#0C4A6E] leading-relaxed text-[11px]">
            Status &quot;Diakses&quot; tercatat otomatis saat siswa membuka modul materi ini minimal
            satu kali melalui portal SIMANTIK Siswa.
          </p>
        </div>
      </div>
    </div>
  );
};
