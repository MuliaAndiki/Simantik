import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Filter,
  GraduationCap,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import React from 'react';
import { TableLoader } from '@/components/atoms/loading';
import { ManagerPagination, TableEmptyRow } from '@/components/molecules/table';
import type { TryoutPackageResultsResponse, TryoutStudentResultItem } from '@/types/service';

export interface TryoutStudentResultsTableProps {
  packageData: TryoutPackageResultsResponse | null;
  students: TryoutStudentResultItem[];
  isLoading: boolean;
  search: string;
  onSearchChange: (search: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortFilter: string;
  onSortFilterChange: (sort: string) => void;
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onViewStudentResult: (student: TryoutStudentResultItem) => void;
  onRefresh: () => void;
}

export const TryoutStudentResultsTable: React.FC<TryoutStudentResultsTableProps> = ({
  packageData,
  students,
  isLoading,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortFilter,
  onSortFilterChange,
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onViewStudentResult,
  onRefresh,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  const totalCompleted = packageData?.total_students_completed ?? 0;
  const totalEnrolled = packageData?.total ?? students.length ?? 0;
  const avgScore = packageData?.average_score?.toFixed(1) ?? '0.0';
  const highestScore = packageData?.highest_score?.toFixed(1) ?? '0.0';
  const lowestScore = packageData?.lowest_score?.toFixed(1) ?? '0.0';

  const completedRatio =
    totalEnrolled > 0 ? Math.round((totalCompleted / Math.max(totalEnrolled, 1)) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 4 Summary / KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Siswa Selesai */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Siswa Selesai
            </span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-800">
              <UserCheck className="w-4 h-4 text-cyan-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{totalCompleted}</span>
              <span className="text-xs font-bold text-slate-400">/ {totalEnrolled} Siswa</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-cyan-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(completedRatio, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              {completedRatio}% telah mengumpulkan ujian
            </p>
          </div>
        </div>

        {/* Rata-rata Nilai */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Rata-rata Nilai
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-800">
              <Award className="w-4 h-4 text-blue-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{avgScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Indikator Keseluruhan Baik</span>
            </p>
          </div>
        </div>

        {/* Nilai Tertinggi */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nilai Tertinggi
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600">{highestScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">
              {packageData?.highest_correct_answers
                ? `${packageData.highest_correct_answers} Benar / ${packageData.highest_incorrect_answers} Salah`
                : 'Pencapaian Terbaik'}
            </p>
          </div>
        </div>

        {/* Nilai Terendah */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nilai Terendah
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <TrendingDown className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-600">{lowestScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              {packageData?.lowest_correct_answers !== undefined
                ? `${packageData.lowest_correct_answers} Benar / ${packageData.lowest_incorrect_answers} Salah`
                : 'Perlu Pendampingan'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
        {/* Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Aktivitas & Hasil Pengerjaan Siswa
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Daftar siswa yang telah atau sedang mengerjakan paket tryout ini
              </p>
            </div>

            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80 rounded-xl text-xs font-bold transition cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Refresh Data</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari nama atau NIS siswa..."
                className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-800/20 focus:border-cyan-800 transition"
              />
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:inline-block" />
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="bg-slate-50 border border-slate-200/80 text-slate-700 text-xs sm:text-sm rounded-xl px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-800/20"
              >
                <option value="all">Semua Status</option>
                <option value="completed">Selesai</option>
                <option value="in_progress">Sedang Mengerjakan</option>
                <option value="not_started">Belum Mulai</option>
              </select>

              {/* Sort Filter */}
              <select
                value={sortFilter}
                onChange={(e) => onSortFilterChange(e.target.value)}
                className="bg-slate-50 border border-slate-200/80 text-slate-700 text-xs sm:text-sm rounded-xl px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-800/20"
              >
                <option value="highest_score">Nilai Tertinggi</option>
                <option value="lowest_score">Nilai Terendah</option>
                <option value="latest">Terbaru</option>
                <option value="name_asc">Nama (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <TableLoader label="Memuat hasil aktivitas pengerjaan siswa..." />
          ) : (
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  <th className="py-3.5 px-4 w-12 text-center">NO</th>
                  <th className="py-3.5 px-4">NAMA SISWA & IDENTITAS</th>
                  <th className="py-3.5 px-4 text-center">STATUS</th>
                  <th className="py-3.5 px-4 text-center">NILAI AKHIR</th>
                  <th className="py-3.5 px-4 text-center">BENAR / SALAH</th>
                  <th className="py-3.5 px-4 text-center">DURASI</th>
                  <th className="py-3.5 px-4">WAKTU SELESAI</th>
                  <th className="py-3.5 px-4 text-center w-36">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {students.length === 0 ? (
                  <TableEmptyRow
                    colSpan={8}
                    message="Belum ada data aktivitas siswa untuk filter ini."
                  />
                ) : (
                  students.map((student, idx) => {
                    const rowNumber = (currentPage - 1) * rowsPerPage + idx + 1;
                    const isCompleted = student.status === 'completed';
                    const isInProgress = student.status === 'in_progress';

                    return (
                      <tr
                        key={student.user_id || idx}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        {/* Number */}
                        <td className="py-4 px-4 text-center align-middle">
                          <span className="text-slate-400 font-bold text-xs">{rowNumber}</span>
                        </td>

                        {/* Student Identity */}
                        <td className="py-4 px-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 font-black text-xs flex items-center justify-center shrink-0">
                              {student.student_name
                                ? student.student_name.slice(0, 2).toUpperCase()
                                : 'ST'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-xs sm:text-sm">
                                {student.student_name}
                              </p>
                              <p className="text-[11px] text-slate-400 font-medium">
                                NIS: {student.nis || '-'} •{' '}
                                {student.school || student.student_email || '-'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 text-center align-middle whitespace-nowrap">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Selesai</span>
                            </span>
                          ) : isInProgress ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              <span>Mengerjakan</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              <span>Belum Mulai</span>
                            </span>
                          )}
                        </td>

                        {/* Nilai Akhir */}
                        <td className="py-4 px-4 text-center align-middle whitespace-nowrap">
                          {isCompleted ? (
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                                student.score >= 80
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : student.score >= 65
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {student.score.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-semibold text-xs">-</span>
                          )}
                        </td>

                        {/* Benar / Salah */}
                        <td className="py-4 px-4 text-center align-middle whitespace-nowrap">
                          {isCompleted ? (
                            <span className="text-xs font-bold text-slate-700">
                              <span className="text-emerald-600">{student.correct_answers} B</span>
                              {' / '}
                              <span className="text-rose-600">{student.incorrect_answers} S</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 font-semibold text-xs">-</span>
                          )}
                        </td>

                        {/* Durasi */}
                        <td className="py-4 px-4 text-center align-middle whitespace-nowrap">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>
                                {student.formatted_duration || `${student.duration_minutes} Menit`}
                              </span>
                            </span>
                          ) : (
                            <span className="text-slate-400 font-semibold text-xs">-</span>
                          )}
                        </td>

                        {/* Waktu Selesai */}
                        <td className="py-4 px-4 align-middle whitespace-nowrap text-xs text-slate-500 font-medium">
                          {student.formatted_completed_at || '-'}
                        </td>

                        {/* Aksi */}
                        <td className="py-4 px-4 align-middle text-center">
                          <button
                            type="button"
                            onClick={() => onViewStudentResult(student)}
                            disabled={!isCompleted || !student.attempt_id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                              isCompleted && student.attempt_id
                                ? 'bg-[#134653] hover:bg-[#0B2D38] text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
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
          )}
        </div>

        {/* Pagination Bar */}
        <ManagerPagination
          currentPage={currentPage}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 20, 50]}
          rangeText={`Menampilkan ${startItem}–${endItem} dari ${totalItems} siswa`}
          showPageNumbers
        />
      </div>
    </div>
  );
};

export default TryoutStudentResultsTable;
