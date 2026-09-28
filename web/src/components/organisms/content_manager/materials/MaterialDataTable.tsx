import { Eye, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import {
  JenjangBadge,
  ManagerPagination,
  StatusPill,
  type StatusPillTone,
  TableEmptyRow,
} from '@/components/molecules/table';
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
  const MATERIAL_STATUS_TONES: Record<string, StatusPillTone & { label: string }> = {
    PUBLISHED: {
      pill: 'bg-[#E8F8F3] text-[#059669]',
      dot: 'bg-[#10B981]',
      label: 'Published',
    },
    IN_REVIEW: {
      pill: 'bg-[#FEF7EB] text-[#D97706]',
      dot: 'bg-[#F5B731]',
      label: 'In Review',
    },
    DRAFT: {
      pill: 'bg-[#F1F5F9] text-[#64748B]',
      dot: 'bg-[#94A3B8]',
      label: 'Draft',
    },
  };

  const renderStatusBadge = (status: MaterialStatusType) => {
    const tone = MATERIAL_STATUS_TONES[status];
    if (!tone) return null;
    return <StatusPill label={tone.label} tone={tone} />;
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
              <TableEmptyRow
                colSpan={7}
                message="Belum ada modul pembelajaran terdaftar. Silakan buat modul atau materi baru."
              />
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
                      <JenjangBadge value={item.jenjang} />
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
      <ManagerPagination
        currentPage={currentPage}
        totalItems={totalItems}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[6, 12, 24]}
      />
    </div>
  );
};
