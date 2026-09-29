import { Download, MoreVertical, Pencil, Plus, Search, Trash2, Users } from 'lucide-react';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
import {
  ManagerPagination,
  StatusPill,
  type StatusPillTone,
  TableEmptyRow,
} from '@/components/molecules/table';
import type { MaterialResponse } from '@/types/service';

export interface ModulePackageMaterialsTableProps {
  materials: MaterialResponse[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onViewActivities: (material: MaterialResponse) => void;
  onEditMaterial: (material: MaterialResponse) => void;
  onDownloadMaterial?: (material: MaterialResponse) => void;
  onDeleteMaterial: (material: MaterialResponse) => void;
  onCreateMaterial: () => void;
  isLoading?: boolean;
}

export const ModulePackageMaterialsTable: React.FC<ModulePackageMaterialsTableProps> = ({
  materials,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onViewActivities,
  onEditMaterial,
  onDownloadMaterial,
  onDeleteMaterial,
  onCreateMaterial,
  isLoading = false,
}) => {
  const MATERIAL_STATUS_TONES: Record<string, StatusPillTone & { label: string }> = {
    published: {
      pill: 'bg-[#E8F8F3] text-[#059669]',
      dot: 'bg-[#10B981]',
      label: 'Published',
    },
    in_review: {
      pill: 'bg-[#FEF7EB] text-[#D97706]',
      dot: 'bg-[#F5B731]',
      label: 'In Review',
    },
    draft: {
      pill: 'bg-[#F1F5F9] text-[#64748B]',
      dot: 'bg-[#94A3B8]',
      label: 'Draft',
    },
  };

  const renderStatusBadge = (status: string) => {
    const tone = MATERIAL_STATUS_TONES[status.toLowerCase()] || MATERIAL_STATUS_TONES.draft;
    return <StatusPill label={tone.label} tone={tone} />;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between space-y-0">
      {/* Search and Filter Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul materi atau kompetensi..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0E7490]/20 focus:border-[#0E7490] transition"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3.5 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0E7490]/20 focus:border-[#0E7490] cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="published">Published</option>
            <option value="in_review">In Review</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider font-bold text-slate-400">
              <th className="py-3 px-4 w-12 text-center">NO</th>
              <th className="py-3 px-4">JUDUL &amp; KODE MATERI</th>
              <th className="py-3 px-4">KOMPETENSI</th>
              <th className="py-3 px-4 text-center">URUTAN</th>
              <th className="py-3 px-4 text-center">STATUS</th>
              <th className="py-3 px-4">PEMBARUAN</th>
              <th className="py-3 px-4 text-center w-24">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                  Memuat daftar materi modul...
                </td>
              </tr>
            ) : materials.length === 0 ? (
              <TableEmptyRow
                colSpan={7}
                message="Belum ada materi terdaftar dalam modul ini. Silakan klik tombol 'Tambah Materi Baru' di atas untuk menambahkan materi pertama."
              />
            ) : (
              materials.map((item, idx) => {
                const code = `MAT-${item.id.slice(0, 4).toUpperCase()}-${String(
                  item.display_order || idx + 1
                ).padStart(3, '0')}`;
                const updatedAt = item.updated_at
                  ? new Date(item.updated_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Baru saja';

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => onViewActivities(item)}
                  >
                    {/* NO */}
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400 align-middle">
                      {(currentPage - 1) * rowsPerPage + idx + 1}
                    </td>

                    {/* JUDUL & KODE MATERI */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-cyan-900 transition line-clamp-1">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                          <span>{code}</span>
                          <span>•</span>
                          <span className="capitalize">{item.type || 'Text'}</span>
                        </div>
                      </div>
                    </td>

                    {/* KOMPETENSI */}
                    <td className="py-3.5 px-4 align-middle">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-800 border border-cyan-200/60 text-xs font-semibold">
                        {item.competency_name || 'Umum'}
                      </span>
                    </td>

                    {/* URUTAN */}
                    <td className="py-3.5 px-4 text-center align-middle">
                      <span className="inline-block font-bold text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        #{item.display_order || idx + 1}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                      {renderStatusBadge(item.status || 'draft')}
                    </td>

                    {/* PEMBARUAN */}
                    <td className="py-3.5 px-4 align-middle whitespace-nowrap text-xs text-slate-500 font-medium">
                      {updatedAt}
                    </td>

                    {/* AKSI (3-dots Dropdown) */}
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
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewActivities(item);
                            }}
                            className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-cyan-800 hover:bg-cyan-50/70 rounded-lg cursor-pointer"
                          >
                            <Users className="w-4 h-4 text-cyan-700" />
                            <span>Aktivitas Siswa</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditMaterial(item);
                            }}
                            className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-amber-700 hover:bg-amber-50/70 rounded-lg cursor-pointer"
                          >
                            <Pencil className="w-4 h-4 text-amber-500" />
                            <span>Edit Materi</span>
                          </DropdownMenuItem>
                          {onDownloadMaterial && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onDownloadMaterial(item);
                              }}
                              className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                            >
                              <Download className="w-4 h-4 text-slate-500" />
                              <span>Unduh Materi</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="my-1 border-slate-100" />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteMaterial(item);
                            }}
                            className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-rose-500" />
                            <span>Hapus Materi</span>
                          </DropdownMenuItem>
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
        rowsPerPageOptions={[10, 20, 50]}
      />
    </div>
  );
};
