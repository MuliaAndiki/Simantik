import type React from 'react';
import {
  JenjangBadge,
  ManagerPagination,
  PackageStatusBadge,
  PackageTableActions,
  TableEmptyRow,
} from '@/components/molecules/table';
import type { PracticePackageItem } from '@/types/ui/practice-manager.types';

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
  onViewResults?: (item: PracticePackageItem) => void;
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
  onViewResults,
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
              <TableEmptyRow
                colSpan={8}
                message="Belum ada paket latihan terdaftar. Silakan tambah paket latihan baru."
              />
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
                      <JenjangBadge value={item.jenjang} />
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
                      <PackageStatusBadge status={item.status} />
                    </td>

                    {/* Terakhir Diubah */}
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
                          manage: 'Kelola Butir Soal',
                          results: 'Detail & Hasil Siswa',
                          edit: 'Edit Paket Latihan',
                          publish: 'Publikasikan (Publish)',
                          unpublish: 'Nonaktifkan (Unpublish)',
                          delete: 'Hapus Paket Latihan',
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
        rangeText={`${startItem} - ${endItem} dari total ${totalItems} paket latihan`}
        showPageNumbers
      />
    </div>
  );
};

export default PracticeDataTable;
