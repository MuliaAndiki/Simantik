import { Clock, ListOrdered } from 'lucide-react';
import React from 'react';
import {
  JenjangBadge,
  ManagerPagination,
  PackageStatusBadge,
  PackageTableActions,
  TableEmptyRow,
} from '@/components/molecules/table';
import type { TryoutPackageItem } from '@/types/ui/tryout-manager.types';

export interface TryoutDataTableProps {
  tryouts: TryoutPackageItem[];
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onEdit: (item: TryoutPackageItem) => void;
  onManageQuestions?: (item: TryoutPackageItem) => void;
  onViewResults?: (item: TryoutPackageItem) => void;
  onToggleStatus: (item: TryoutPackageItem) => void;
  onDelete: (item: TryoutPackageItem) => void;
}

export const TryoutDataTable: React.FC<TryoutDataTableProps> = React.memo(
  ({
    tryouts,
    currentPage,
    totalItems,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    onEdit,
    onManageQuestions,
    onViewResults,
    onToggleStatus,
    onDelete,
  }) => {
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
    const endItem = Math.min(currentPage * rowsPerPage, totalItems);

    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                <th className="py-3.5 px-4 w-14 text-center">NO</th>
                <th className="py-3.5 px-4">JUDUL PAKET TRYOUT & IDENTITAS</th>
                <th className="py-3.5 px-4 text-center">JENJANG</th>
                <th className="py-3.5 px-4 text-center">DURASI</th>
                <th className="py-3.5 px-4 text-center">SOAL</th>
                <th className="py-3.5 px-4 text-center">STATUS</th>
                <th className="py-3.5 px-4">JADWAL / UPDATE</th>
                <th className="py-3.5 px-4 text-center w-28">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {tryouts.length === 0 ? (
                <TableEmptyRow
                  colSpan={8}
                  message="Belum ada paket tryout terdaftar. Silakan tambah paket tryout baru."
                />
              ) : (
                tryouts.map((item) => {
                  const isPublished = item.status === 'PUBLISHED';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Number */}
                      <td className="py-4 px-4 text-center align-middle">
                        <span className="text-slate-400 font-bold text-xs">{item.number}</span>
                      </td>

                      {/* Judul & Identitas */}
                      <td className="py-4 px-4 align-middle">
                        <button
                          type="button"
                          onClick={() =>
                            onViewResults
                              ? onViewResults(item)
                              : onManageQuestions
                                ? onManageQuestions(item)
                                : onEdit(item)
                          }
                          className="text-left font-bold text-slate-800 text-xs sm:text-sm leading-snug hover:text-cyan-800 transition cursor-pointer"
                        >
                          {item.title}
                        </button>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          Penulis: {item.author}
                        </p>
                      </td>

                      {/* Jenjang */}
                      <td className="py-4 px-4 text-center align-middle whitespace-nowrap">
                        <JenjangBadge value={item.jenjang} />
                      </td>

                      {/* Durasi */}
                      <td className="py-4 px-4 text-center align-middle whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50/80 text-cyan-800 border border-cyan-200 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5 text-cyan-600" />
                          <span>{item.durationMinutes} Menit</span>
                        </span>
                      </td>

                      {/* Jumlah Soal */}
                      <td className="py-4 px-4 text-center align-middle whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold">
                          <ListOrdered className="w-3.5 h-3.5 text-slate-500" />
                          <span>{item.totalQuestions} Soal</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center align-middle whitespace-nowrap">
                        <PackageStatusBadge status={item.status} />
                      </td>

                      {/* Jadwal / Update */}
                      <td className="py-4 px-4 align-middle whitespace-nowrap text-xs text-slate-500 font-medium">
                        {item.updatedAt}
                      </td>

                      {/* Aksi */}
                      <td className="py-4 px-4 align-middle text-center">
                        <PackageTableActions
                          item={item}
                          isPublished={isPublished}
                          onEdit={onEdit}
                          onManageQuestions={onManageQuestions}
                          onViewResults={onViewResults}
                          onToggleStatus={onToggleStatus}
                          onDelete={onDelete}
                          labels={{
                            results: 'Aktivitas & Hasil Siswa',
                            manage: 'Kelola Butir Soal Adaptif',
                            edit: 'Edit Tryout',
                            publish: 'Publikasikan ke Siswa',
                            unpublish: 'Tutup Akses (Unpublish)',
                            delete: 'Hapus Tryout',
                          }}
                        />
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
          rowsPerPageOptions={[5, 10, 20, 50]}
          rangeText={`Menampilkan ${startItem}–${endItem} dari ${totalItems} paket`}
          showPageNumbers
        />
      </div>
    );
  }
);

TryoutDataTable.displayName = 'TryoutDataTable';

export default TryoutDataTable;
