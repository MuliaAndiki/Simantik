import { ArrowRight, Check, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import React from 'react';
import { TableLoader } from '@/components/atoms/loading';
import type { PracticeStudentResultItem } from '@/types/service';

export interface PracticeStudentResultsTableProps {
  students: PracticeStudentResultItem[];
  selectedUserId: string | null;
  onSelectStudent: (student: PracticeStudentResultItem) => void;
  onViewResult?: (student: PracticeStudentResultItem) => void;
  totalCompletedCount: number;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  sortFilter: string;
  onSortFilterChange: (val: string) => void;
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
}

export const PracticeStudentResultsTable: React.FC<PracticeStudentResultsTableProps> = ({
  students,
  selectedUserId,
  onSelectStudent,
  onViewResult,
  totalCompletedCount,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortFilter,
  onSortFilterChange,
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getInitials = (name: string) => {
    if (!name) return 'S';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between space-y-0">
      {/* Table Section Header & Filter Bar */}
      <div className="p-5 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Hasil Pengerjaan Siswa
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#EAF6F8] text-[#0E7490] border border-[#0E7490]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E7490]" />
                {totalCompletedCount} Siswa Selesai Mengerjakan
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Lihat hasil pengerjaan setiap siswa pada paket latihan ini.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau email siswa..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0E7490]/20 focus:border-[#0E7490] transition"
            />
          </div>

          {/* Status & Sort Select */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="px-3 py-1.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0E7490]/20 focus:border-[#0E7490] cursor-pointer"
              >
                <option value="all">Semua</option>
                <option value="completed">Selesai</option>
                <option value="in_progress">Sedang Mengerjakan</option>
                <option value="not_started">Belum Mengerjakan</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <span>Urutkan:</span>
              <select
                value={sortFilter}
                onChange={(e) => onSortFilterChange(e.target.value)}
                className="px-3 py-1.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0E7490]/20 focus:border-[#0E7490] cursor-pointer"
              >
                <option value="highest_score">Nilai Tertinggi</option>
                <option value="lowest_score">Nilai Terendah</option>
                <option value="newest">Terbaru</option>
                <option value="name_asc">Nama (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider font-bold text-slate-400">
              <th className="py-3 px-4">SISWA</th>
              <th className="py-3 px-4 text-center">NILAI</th>
              <th className="py-3 px-4 text-center">BENAR</th>
              <th className="py-3 px-4 text-center">SALAH</th>
              <th className="py-3 px-4 text-center">WAKTU PENGERJAAN</th>
              <th className="py-3 px-4 text-center">STATUS</th>
              <th className="py-3 px-4 text-center w-32">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-10">
                  <TableLoader label="Memuat hasil pengerjaan siswa..." />
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                  Tidak ada data siswa yang cocok dengan filter pencarian.
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const isSelected = student.user_id === selectedUserId;
                const isCompleted = student.status === 'completed';
                const isLowScore = student.score < 60;

                return (
                  <tr
                    key={student.user_id}
                    onClick={() => onSelectStudent(student)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-[#F4FBFA] ring-1 ring-inset ring-[#0E7490]/20'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {/* SISWA */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-cyan-100/70 text-[#0E7490] font-bold text-xs flex items-center justify-center border border-cyan-200/60">
                          {getInitials(student.student_name)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-cyan-900 transition leading-snug">
                            {student.student_name}
                          </p>
                          <p className="text-[11px] font-medium text-slate-400">
                            NIS: {student.nis || '-'} • {student.student_email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* NILAI */}
                    <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                      {isCompleted ? (
                        <span
                          className={`inline-block px-3 py-1 rounded-xl font-black text-xs min-w-[42px] text-center ${
                            isLowScore
                              ? 'bg-[#FEF2F2] text-[#DC2626] border border-rose-200'
                              : 'bg-[#134653] text-white shadow-2xs'
                          }`}
                        >
                          {student.score}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold">-</span>
                      )}
                    </td>

                    {/* BENAR */}
                    <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {student.correct_answers}/{student.total_questions}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* SALAH */}
                    <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                          <X className="w-3.5 h-3.5 text-rose-500" />
                          <span>{student.incorrect_answers}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* WAKTU PENGERJAAN */}
                    <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap text-xs text-slate-600 font-medium">
                      {isCompleted
                        ? student.formatted_duration || `${student.duration_minutes} menit`
                        : '-'}
                    </td>

                    {/* STATUS */}
                    <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                      {isCompleted ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F8F3] text-[#059669]">
                          Selesai
                        </span>
                      ) : student.status === 'in_progress' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF7EB] text-[#D97706]">
                          Sedang Mengerjakan
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                          Belum Mengerjakan
                        </span>
                      )}
                    </td>

                    {/* AKSI */}
                    <td className="py-3.5 px-4 text-center align-middle">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onViewResult) {
                            onViewResult(student);
                          } else {
                            onSelectStudent(student);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#134653] hover:bg-[#0B2D38] text-white font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
                      >
                        <span>Lihat Hasil</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
        <div>
          Menampilkan{' '}
          <strong className="font-bold text-slate-800">
            {startItem}-{endItem}
          </strong>{' '}
          dari <strong className="font-bold text-slate-800">{totalItems}</strong> siswa
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="w-8 h-8 rounded-lg border border-slate-200/80 bg-white flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                  isActive
                    ? 'bg-[#134653] text-white'
                    : 'border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {totalPages > 5 && (
            <>
              <span className="px-1 text-slate-400">...</span>
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                  totalPages === currentPage
                    ? 'bg-[#134653] text-white'
                    : 'border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-8 h-8 rounded-lg border border-slate-200/80 bg-white flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span>Baris:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2.5 py-1 bg-white border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};
