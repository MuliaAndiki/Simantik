import { Eye, Layers, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
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
  onNavigateModule?: (item: ModuleItem) => void;
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
  onNavigateModule,
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
                    <td className="py-3.5 px-4 align-middle text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer inline-flex items-center justify-center"
                            title="Menu Aksi"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-white shadow-lg border border-slate-200/80 rounded-xl p-1 z-50"
                        >
                          {onNavigateModule && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateModule(item);
                              }}
                              className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-cyan-800 hover:bg-cyan-50/70 rounded-lg cursor-pointer"
                            >
                              <Layers className="w-4 h-4 text-cyan-700" />
                              <span>Buka Daftar Materi</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectModule(item);
                            }}
                            className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-cyan-800 hover:bg-cyan-50/70 rounded-lg cursor-pointer"
                          >
                            <Eye className="w-4 h-4 text-slate-500" />
                            <span>Lihat Panel Samping</span>
                          </DropdownMenuItem>
                          {onEditModule && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditModule(item);
                              }}
                              className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-amber-700 hover:bg-amber-50/70 rounded-lg cursor-pointer"
                            >
                              <Pencil className="w-4 h-4 text-amber-500" />
                              <span>Edit Modul</span>
                            </DropdownMenuItem>
                          )}
                          {onDeleteModule && (
                            <>
                              <DropdownMenuSeparator className="my-1 border-slate-100" />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteModule(item);
                                }}
                                className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 text-rose-500" />
                                <span>Hapus Modul</span>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
