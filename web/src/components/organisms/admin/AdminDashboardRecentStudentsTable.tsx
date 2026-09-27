import { ArrowRight, ChevronDown } from 'lucide-react';
import React from 'react';
import type { RecentStudentItem } from '@/types/service';
import { cn } from '@/utils/classname';

export interface AdminDashboardRecentStudentsTableProps {
  students?: RecentStudentItem[];
  totalStudents?: number;
  sortOrder?: 'newest' | 'oldest';
  onSortChange?: () => void;
  onManageStudent?: (id: string) => void;
  onViewAllStudents?: () => void;
  className?: string;
}

export const AdminDashboardRecentStudentsTable: React.FC<
  AdminDashboardRecentStudentsTableProps
> = ({
  students = [],
  totalStudents = 1248,
  sortOrder = 'newest',
  onSortChange,
  onManageStudent,
  onViewAllStudents,
  className,
}) => {
  const displayStudents = students || [];

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (name.slice(0, 2) || 'ST').toUpperCase();
  };

  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 select-none space-y-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Tabel Siswa Terbaru</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Daftar siswa sekolah yang baru mendaftar pada portal SIMANTIK
          </p>
        </div>

        {/* Sort Filter Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-500 font-medium">Urutkan:</span>
          <button
            type="button"
            onClick={onSortChange}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          >
            <span>{sortOrder === 'newest' ? 'Terbaru' : 'Terlama'}</span>
            <ChevronDown className="size-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto -mx-5 sm:mx-0">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 font-bold">Nama Siswa</th>
              <th className="py-3 px-4 font-bold">Email Sekolah</th>
              <th className="py-3 px-4 font-bold">Tanggal Daftar</th>
              <th className="py-3 px-4 font-bold">Status</th>
              <th className="py-3 px-4 font-bold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {displayStudents.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                  Belum ada siswa terdaftar.
                </td>
              </tr>
            ) : (
              displayStudents.map((student) => {
                const isActive =
                  student.status === 'active' ||
                  student.status === 'verified' ||
                  student.status === 'Aktif';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Nama Siswa */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {getInitials(student.full_name)}
                        </div>
                        <span className="font-bold text-slate-900 truncate">
                          {student.full_name}
                        </span>
                      </div>
                    </td>

                    {/* Email Sekolah */}
                    <td className="py-3.5 px-4 font-medium text-slate-600 font-mono text-[11px]">
                      {student.email}
                    </td>

                    {/* Tanggal Daftar */}
                    <td className="py-3.5 px-4 font-medium text-slate-500">
                      {student.formatted_date ||
                        new Date(student.registered_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>Aktif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                          <span className="size-1.5 rounded-full bg-rose-500 shrink-0" />
                          <span>Nonaktif</span>
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onManageStudent?.(student.id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                      >
                        Kelola Akun
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-slate-500 font-medium">
          Menampilkan {displayStudents.length} siswa pendaftaran terbaru
        </span>

        {onViewAllStudents && (
          <button
            type="button"
            onClick={onViewAllStudents}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#134E48] hover:bg-[#0F3D39] text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-98 self-start sm:self-auto"
          >
            <span>Lihat Semua Siswa ({totalStudents.toLocaleString('id-ID')})</span>
            <ArrowRight className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardRecentStudentsTable;
