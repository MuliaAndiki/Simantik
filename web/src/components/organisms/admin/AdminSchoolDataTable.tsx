import { Edit2, Trash2 } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/atoms';
import { TableLoader } from '@/components/atoms/loading';
import type { SchoolResponse } from '@/types/service';
import { cn } from '@/utils/classname';

export interface AdminSchoolDataTableProps {
  schools: SchoolResponse[];
  isLoading?: boolean;
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (school: SchoolResponse) => void;
  onDelete: (school: SchoolResponse) => void;
  className?: string;
}

export const AdminSchoolDataTable: React.FC<AdminSchoolDataTableProps> = ({
  schools,
  isLoading = false,
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  onEdit,
  onDelete,
  className,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-5 py-3.5">NPSN</th>
              <th className="px-5 py-3.5">Nama Sekolah</th>
              <th className="px-5 py-3.5">Jenjang</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Alamat / Wilayah</th>
              <th className="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6}>
                  <TableLoader label="Memuat data sekolah..." />
                </td>
              </tr>
            ) : schools.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-400 font-medium">
                  Tidak ada data sekolah yang sesuai dengan pencarian atau filter.
                </td>
              </tr>
            ) : (
              schools.map((school) => (
                <tr key={school.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-teal-700">{school.npsn}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-slate-900">{school.nama}</p>
                    <p className="text-[11px] text-slate-400">{school.kecamatan || '-'}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase bg-slate-100 text-slate-700">
                      {school.jenjang}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize border ${
                        school.status?.toLowerCase() === 'negeri'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-sky-50 text-sky-700 border-sky-100'
                      }`}
                    >
                      {school.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">
                    {school.alamat ? (
                      <span>
                        {school.alamat}
                        {school.kabupaten ? `, ${school.kabupaten}` : ''}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(school)}
                        className="size-8 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50"
                        title="Edit Data Sekolah"
                      >
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(school)}
                        className="size-8 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                        title="Hapus Data Sekolah"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalItems > rowsPerPage && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400 font-medium">
            Menampilkan {schools.length} dari {totalItems} sekolah
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="text-xs font-semibold rounded-lg"
            >
              Sebelumnya
            </Button>
            <span className="text-xs font-bold px-2 text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="text-xs font-semibold rounded-lg"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchoolDataTable;
