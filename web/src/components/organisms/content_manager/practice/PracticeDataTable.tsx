import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FileQuestion,
  Pencil,
  Trash2,
  UploadCloud,
} from 'lucide-react';

import type React from 'react';
import type { PracticePackageItem, PracticeStatusType } from '@/types/ui/practice-manager.types';

export interface PracticeDataTableProps {
  packages: PracticePackageItem[];
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onEdit: (item: PracticePackageItem) => void;
  onToggleStatus: (item: PracticePackageItem) => void;
  onDelete: (item: PracticePackageItem) => void;
  onManageQuestions?: (item: PracticePackageItem) => void;
}

export const PracticeDataTable: React.FC<PracticeDataTableProps> = ({
  packages,
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onToggleStatus,
  onDelete,
  onManageQuestions,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  const renderStatusBadge = (status: PracticeStatusType) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F8F3] text-[#059669]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Published
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF7EB] text-[#D97706]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5B731]" />
            Draft
          </span>
        );
      case 'UNPUBLISHED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#64748B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
            Unpublished
          </span>
        );
      default:
        return null;
    }
  };

  const renderJenjangBadge = (jenjang?: string) => {
    const j = (jenjang || 'sma').toLowerCase();
    switch (j) {
      case 'sd':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            SD
          </span>
        );
      case 'smp':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            SMP
          </span>
        );
      case 'smk':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            SMK
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            SMA
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider font-bold text-slate-400">
              <th className="py-3.5 px-4 w-14 text-center">NO</th>
              <th className="py-3.5 px-4">NAMA PAKET LATIHAN</th>
              <th className="py-3.5 px-4 text-center">JENJANG</th>
              <th className="py-3.5 px-4">KOMPETENSI / SUBTES</th>
              <th className="py-3.5 px-4 text-center">JUMLAH SOAL</th>
              <th className="py-3.5 px-4 text-center">STATUS</th>
              <th className="py-3.5 px-4">TERAKHIR DIUBAH</th>
              <th className="py-3.5 px-4 text-center w-28">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {packages.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                  Belum ada paket latihan terdaftar. Silakan tambah paket latihan baru.
                </td>
              </tr>
            ) : (
              packages.map((item) => {
                const isPublished = item.status === 'PUBLISHED';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Number */}
                    <td className="py-4 px-4 text-center align-middle">
                      <span className="text-slate-400 font-bold text-xs">{item.number}</span>
                    </td>

                    {/* Nama Paket Latihan */}
                    <td className="py-4 px-4 align-middle">
                      <button
                        type="button"
                        onClick={() => (onManageQuestions ? onManageQuestions(item) : onEdit(item))}
                        className="text-left font-bold text-slate-800 text-xs sm:text-sm leading-snug hover:text-cyan-800 transition cursor-pointer"
                      >
                        {item.title}
                      </button>
                      {item.description && (
                        <p className="text-[11px] text-slate-400 font-medium line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </td>

                    {/* Jenjang */}
                    <td className="py-4 px-4 text-center align-middle whitespace-nowrap">
                      {renderJenjangBadge(item.jenjang)}
                    </td>

                    {/* Kompetensi / Subtes */}
                    <td className="py-4 px-4 align-middle text-slate-600 font-medium text-xs sm:text-sm">
                      {item.competencyName}
                    </td>

                    {/* Jumlah Soal */}
                    <td className="py-4 px-4 text-center align-middle">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-bold whitespace-nowrap">
                        {item.totalQuestions} Soal
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center align-middle whitespace-nowrap">
                      {renderStatusBadge(item.status)}
                    </td>

                    {/* Terakhir Diubah */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap text-xs text-slate-500 font-medium">
                      {item.updatedAt}
                    </td>

                    {/* Aksi */}
                    <td className="py-4 px-4 align-middle text-center">
                      <div className="inline-flex items-center justify-center gap-1.5">
                        {/* Kelola Soal */}
                        {onManageQuestions && (
                          <button
                            type="button"
                            onClick={() => onManageQuestions(item)}
                            className="p-1.5 text-cyan-600 hover:text-cyan-800 hover:bg-cyan-50 rounded-lg transition cursor-pointer"
                            title="Kelola Butir Soal"
                          >
                            <FileQuestion className="w-4 h-4" />
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Edit Paket Latihan"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Toggle Status (Publish/Unpublish) */}
                        <button
                          type="button"
                          onClick={() => onToggleStatus(item)}
                          className="p-1.5 text-slate-400 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition cursor-pointer"
                          title={isPublished ? 'Nonaktifkan (Unpublish)' : 'Publikasikan (Publish)'}
                        >
                          {isPublished ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <UploadCloud className="w-4 h-4" />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Hapus Paket Latihan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        {/* Rows Per Page & Range Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span>Baris per halaman:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium cursor-pointer focus:outline-none focus:border-cyan-600"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <span className="text-slate-400 font-medium hidden sm:inline">•</span>
          <span>
            {startItem} - {endItem} dari total {totalItems} paket latihan
          </span>
        </div>

        {/* Page Nav Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition cursor-pointer"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`min-w-8 h-8 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-[#134653] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition cursor-pointer"
            title="Halaman Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeDataTable;
