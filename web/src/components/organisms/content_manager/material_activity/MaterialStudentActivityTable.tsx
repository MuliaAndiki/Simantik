import { ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon, Search } from 'lucide-react';
import React from 'react';
import type { MaterialStudentActivityItem } from '@/types/service';

export interface MaterialStudentActivityTableProps {
  students: MaterialStudentActivityItem[];
  selectedUserId: string | null;
  onSelectStudent: (student: MaterialStudentActivityItem) => void;
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

export const MaterialStudentActivityTable: React.FC<MaterialStudentActivityTableProps> = ({
  students,
  selectedUserId,
  onSelectStudent,
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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
      {/* Search and Filters Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
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

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3.5 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0E7490]/20 focus:border-[#0E7490] cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="accessed">Diakses</option>
            <option value="unaccessed">Belum Diakses</option>
          </select>

          <select
            value={sortFilter}
            onChange={(e) => onSortFilterChange(e.target.value)}
            className="px-3.5 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0E7490]/20 focus:border-[#0E7490] cursor-pointer"
          >
            <option value="newest">Terbaru Diakses</option>
            <option value="oldest">Terlama Diakses</option>
            <option value="name_asc">Nama (A-Z)</option>
            <option value="name_desc">Nama (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider font-bold text-slate-400">
              <th className="py-3 px-4 w-12 text-center">NO</th>
              <th className="py-3 px-4">SISWA</th>
              <th className="py-3 px-4">EMAIL</th>
              <th className="py-3 px-4">TERAKHIR DIAKSES</th>
              <th className="py-3 px-4 text-center">STATUS</th>
              <th className="py-3 px-4 text-center w-28">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                  Memuat data aktivitas siswa...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                  Tidak ada data siswa yang sesuai dengan filter pencarian.
                </td>
              </tr>
            ) : (
              students.map((student, idx) => {
                const isSelected = student.user_id === selectedUserId;
                const rowNumber = (currentPage - 1) * pageSize + idx + 1;

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
                    {/* NO */}
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400 align-middle">
                      {rowNumber}
                    </td>

                    {/* SISWA (Avatar + Name + NIS) */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200/80">
                            {getInitials(student.student_name)}
                          </div>
                          {student.is_accessed && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-cyan-900 transition">
                              {student.student_name}
                            </span>
                            {student.is_accessed && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0E7490]" />
                            )}
                          </div>
                          <span className="text-[11px] font-medium text-slate-400">
                            NIS: {student.nis || '-'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium align-middle">
                      {student.student_email || '-'}
                    </td>

                    {/* TERAKHIR DIAKSES */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium align-middle whitespace-nowrap">
                      {student.is_accessed && student.formatted_last_accessed
                        ? student.formatted_last_accessed
                        : '-'}
                    </td>

                    {/* STATUS */}
                    <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                      {student.is_accessed ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#134653] text-white">
                          <span>✓</span>
                          <span>Diakses</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>Belum Diakses</span>
                        </span>
                      )}
                    </td>

                    {/* AKSI */}
                    <td className="py-3.5 px-4 text-center align-middle">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(student);
                        }}
                        className="inline-flex items-center gap-0.5 text-xs font-bold text-[#0E7490] hover:text-[#083344] transition cursor-pointer"
                      >
                        <span>Lihat Siswa</span>
                        <ChevronRightIcon className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3.5 border-t border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
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
          <span>Tampilkan:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2.5 py-1 bg-white border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};
