import { ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import type { MaterialStatusType, ModuleItem } from '@/types/ui/material-manager.types';

interface MaterialDataTableProps {
  modules: ModuleItem[];
  selectedId: string;
  onSelectModule: (item: ModuleItem) => void;
  onEditModule?: (item: ModuleItem) => void;
  onDeleteModule?: (item: ModuleItem) => void;
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export const MaterialDataTable: React.FC<MaterialDataTableProps> = ({
  modules,
  selectedId,
  onSelectModule,
  onEditModule,
  onDeleteModule,
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;

  const renderStatusBadge = (status: MaterialStatusType) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E8F8F3] text-[#059669]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Published
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF7EB] text-[#D97706]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5B731]" />
            In Review
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#64748B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
            Draft
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
      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider font-bold text-slate-400">
              <th className="py-3 px-4 w-14 text-center">No</th>
              <th className="py-3 px-4">Judul Modul Pembelajaran</th>
              <th className="py-3 px-4 text-center">Jenjang</th>
              <th className="py-3 px-4 text-center">Total Materi</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4">Pembaruan</th>
              <th className="py-3 px-4 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {modules.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                  Belum ada modul pembelajaran terdaftar. Silakan buat modul atau materi baru.
                </td>
              </tr>
            ) : (
              modules.map((item) => {
                const isSelected = item.id === selectedId;

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectModule(item)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-[#F4FBFA] ring-1 ring-inset ring-[#0E7490]/20'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Number */}
                    <td className="py-3.5 px-4 text-center align-top">
                      {isSelected ? (
                        <span className="inline-block bg-[#F5B731] text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-2xs">
                          {item.number}
                        </span>
                      ) : (
                        <span className="inline-block text-slate-400 font-bold text-xs px-2.5 py-1">
                          {item.number}
                        </span>
                      )}
                    </td>

                    {/* Title & Description */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-1">
                        <p
                          className={`font-bold text-xs sm:text-sm leading-snug line-clamp-2 transition ${
                            isSelected
                              ? 'text-cyan-900'
                              : 'text-slate-800 group-hover:text-cyan-800'
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium line-clamp-1">
                          {item.description || 'Modul Pembelajaran Kurikulum Terpadu'}
                        </p>
                      </div>
                    </td>

                    {/* Jenjang */}
                    <td className="py-3.5 px-4 text-center align-top whitespace-nowrap">
                      {renderJenjangBadge(item.jenjang)}
                    </td>

                    {/* Total Materi */}
                    <td className="py-3.5 px-4 text-center align-top">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-[11px] font-bold whitespace-nowrap">
                        {item.materialsCount} Materi
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center align-top whitespace-nowrap">
                      {renderStatusBadge(item.status)}
                    </td>

                    {/* Pembaruan */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap text-xs text-slate-500 font-medium">
                      {item.updatedAt}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 align-top text-center">
                      <div className="inline-flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectModule(item);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EAF6F8] text-[#0E7490] hover:bg-[#D5EEF3] transition cursor-pointer"
                          title="Lihat Daftar Materi"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat</span>
                        </button>
                        {onEditModule && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditModule(item);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Edit Modul"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteModule && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteModule(item);
                            }}
                            className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Hapus Modul"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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
        {/* Rows Per Page */}
        <div className="flex items-center gap-2">
          <span>Baris per halaman:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium cursor-pointer focus:outline-none focus:border-cyan-600"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>

        {/* Page Information & Nav Buttons */}
        <div className="flex items-center gap-3">
          <span>
            Halaman <strong className="text-slate-800">{currentPage}</strong> dari{' '}
            <strong className="text-slate-800">{totalPages}</strong>
          </span>

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
    </div>
  );
};
