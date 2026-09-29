import React from 'react';

export interface MaterialActivityProgressBarProps {
  totalStudents: number;
  accessedStudents: number;
  unaccessedStudents: number;
  participationRate: number;
  lastUpdatedAt?: string;
}

export const MaterialActivityProgressBar: React.FC<MaterialActivityProgressBarProps> = ({
  totalStudents,
  accessedStudents,
  unaccessedStudents,
  participationRate,
  lastUpdatedAt = 'Baru saja',
}) => {
  const safeRate = Math.min(100, Math.max(0, participationRate));
  const unaccessedRate = 100 - safeRate;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="font-extrabold text-slate-900 tracking-tight">
            RINGKASAN AKSES MATERI
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 font-medium">
            <strong className="font-bold text-slate-800">{accessedStudents}</strong> dari{' '}
            <strong className="font-bold text-slate-800">{totalStudents}</strong> siswa telah
            mengakses materi ini
          </span>
        </div>

        <div className="text-[11px] font-semibold text-slate-400">
          Terakhir diperbarui: <span className="text-slate-600 font-medium">{lastUpdatedAt}</span>
        </div>
      </div>

      {/* Visual Dual-Color Progress Bar */}
      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
        <div
          className="bg-[#0E7490] h-full transition-all duration-500 rounded-l-full"
          style={{ width: `${safeRate}%` }}
          title={`Sudah diakses: ${safeRate.toFixed(1)}%`}
        />
        <div
          className="bg-slate-200 h-full transition-all duration-500 rounded-r-full"
          style={{ width: `${unaccessedRate}%` }}
          title={`Belum diakses: ${unaccessedRate.toFixed(1)}%`}
        />
      </div>

      {/* Bottom Legend */}
      <div className="flex items-center justify-between gap-4 text-xs font-semibold flex-wrap">
        <div className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0E7490]" />
          <span className="text-slate-700">
            {Math.round(safeRate)}% Sudah Diakses ({accessedStudents} siswa)
          </span>
        </div>

        <div className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-300" />
          <span className="text-slate-500">
            {Math.round(unaccessedRate)}% Belum Diakses ({unaccessedStudents} siswa)
          </span>
        </div>
      </div>
    </div>
  );
};
