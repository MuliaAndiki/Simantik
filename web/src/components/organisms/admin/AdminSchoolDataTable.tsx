import { CheckCircle2, Edit2, MapPin, Trash2, XCircle } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/atoms';
import { TableEmptyRow, TableLoadingRow, TablePagination } from '@/components/molecules/table';
import type { SchoolResponse, SchoolVerificationStatus } from '@/types/service';
import { cn } from '@/utils/classname';

const VERIFICATION_BADGE_MAP: Record<
  SchoolVerificationStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Menunggu',
    className: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  verified: {
    label: 'Terverifikasi',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  rejected: {
    label: 'Ditolak',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

export interface AdminSchoolDataTableProps {
  schools: SchoolResponse[];
  isLoading?: boolean;
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (school: SchoolResponse) => void;
  onDelete: (school: SchoolResponse) => void;
  onVerify?: (school: SchoolResponse) => void;
  onOpenReject?: (school: SchoolResponse) => void;
  isVerifyingId?: string | null;
  className?: string;
}

export const AdminSchoolDataTable: React.FC<AdminSchoolDataTableProps> = React.memo(
  ({
    schools,
    isLoading = false,
    currentPage,
    totalItems,
    rowsPerPage,
    onPageChange,
    onEdit,
    onDelete,
    onVerify,
    onOpenReject,
    isVerifyingId,
    className,
  }) => {
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
                <th className="px-5 py-3.5">Verifikasi</th>
                <th className="px-5 py-3.5">Alamat / Wilayah</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <TableLoadingRow colSpan={7} label="Memuat data sekolah..." />
              ) : schools.length === 0 ? (
                <TableEmptyRow
                  colSpan={7}
                  message="Tidak ada data sekolah yang sesuai dengan pencarian atau filter."
                />
              ) : (
                schools.map((school) => {
                  const verificationStatus: SchoolVerificationStatus =
                    school.verificationStatus || 'verified';
                  const badge =
                    VERIFICATION_BADGE_MAP[verificationStatus] ?? VERIFICATION_BADGE_MAP.verified;
                  const isBusy = isVerifyingId === school.id;

                  return (
                    <tr key={school.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-teal-700">
                        {school.npsn}
                      </td>
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
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                            badge.className
                          )}
                        >
                          {badge.label}
                        </span>
                        {(school.submittedByName || school.submittedByEmail) && (
                          <p
                            className="mt-1 text-[11px] text-slate-500 max-w-[180px] truncate"
                            title={school.submittedByEmail || school.submittedByName}
                          >
                            Pengaju: {school.submittedByName || school.submittedByEmail}
                          </p>
                        )}
                        {verificationStatus === 'rejected' && school.rejectionReason && (
                          <p
                            className="mt-0.5 text-[11px] text-rose-600 max-w-[180px] truncate"
                            title={school.rejectionReason}
                          >
                            Alasan: {school.rejectionReason}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">
                        <div className="space-y-1">
                          {school.alamat ? (
                            <span className="block truncate">
                              {school.alamat}
                              {school.kabupaten ? `, ${school.kabupaten}` : ''}
                            </span>
                          ) : (
                            '-'
                          )}
                          {typeof school.latitude === 'number' &&
                            typeof school.longitude === 'number' && (
                              <a
                                href={`https://www.openstreetmap.org/?mlat=${school.latitude}&mlon=${school.longitude}#map=17/${school.latitude}/${school.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-600 hover:underline"
                              >
                                <MapPin className="h-3 w-3" />
                                Lihat di Peta
                              </a>
                            )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onVerify && verificationStatus !== 'verified' && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={isBusy}
                              onClick={() => onVerify(school)}
                              className="size-8 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                              title="Verifikasi Sekolah"
                            >
                              <CheckCircle2 className="size-4" />
                            </Button>
                          )}
                          {onOpenReject && verificationStatus === 'pending' && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={isBusy}
                              onClick={() => onOpenReject(school)}
                              className="size-8 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                              title="Tolak Pengajuan Sekolah"
                            >
                              <XCircle className="size-4" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(school)}
                            className="size-8 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 cursor-pointer"
                            title="Edit Data Sekolah"
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(school)}
                            className="size-8 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Hapus Data Sekolah"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
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
        <TablePagination
          currentPage={currentPage}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
          displayedCount={schools.length}
          itemLabel="sekolah"
          onPageChange={onPageChange}
        />
      </div>
    );
  }
);

AdminSchoolDataTable.displayName = 'AdminSchoolDataTable';

export default AdminSchoolDataTable;
