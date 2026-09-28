import { Eye, Mail } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/atoms';
import { TableEmptyRow, TableLoadingRow, TablePagination } from '@/components/molecules/table';
import type { AdminUserListItem } from '@/types/service';
import { cn } from '@/utils/classname';

export interface AdminStudentDataTableProps {
  users: AdminUserListItem[];
  isLoading?: boolean;
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onOpenStatusDialog: (user: AdminUserListItem) => void;
  onOpenDetailDialog: (userId: string) => void;
  className?: string;
}

export const AdminStudentDataTable: React.FC<AdminStudentDataTableProps> = ({
  users,
  isLoading = false,
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  onOpenStatusDialog,
  onOpenDetailDialog,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-5 py-3.5">Nama Siswa</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Total Ujian</th>
              <th className="px-5 py-3.5">Terakhir Masuk</th>
              <th className="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <TableLoadingRow colSpan={6} label="Memuat data siswa..." />
            ) : users.length === 0 ? (
              <TableEmptyRow
                colSpan={6}
                message="Tidak ada data siswa yang sesuai dengan filter."
              />
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-sky-50 text-sky-700 border border-sky-100 font-bold text-xs flex items-center justify-center shrink-0">
                        {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.full_name}</p>
                        <p className="text-[10px] text-slate-400">
                          Daftar: {new Date(user.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Mail className="size-3.5 text-slate-400" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize border ${
                        user.status?.toLowerCase() === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : user.status?.toLowerCase() === 'suspended'
                            ? 'bg-rose-50 text-rose-700 border-rose-100'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-700">
                    {user.total_attempts || 0} Sesi
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-medium">
                    {user.last_login_at
                      ? new Date(user.last_login_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Belum Pernah'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenDetailDialog(user.id)}
                        className="size-8 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50"
                        title="Lihat Detail Profil"
                      >
                        <Eye className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenStatusDialog(user)}
                        className="h-8 rounded-lg text-xs font-bold bg-[#EAF6F8] hover:bg-cyan-100/70 border border-cyan-200 text-teal-800"
                      >
                        Ubah Status
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
      <TablePagination
        currentPage={currentPage}
        totalItems={totalItems}
        rowsPerPage={rowsPerPage}
        displayedCount={users.length}
        itemLabel="siswa"
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default AdminStudentDataTable;
