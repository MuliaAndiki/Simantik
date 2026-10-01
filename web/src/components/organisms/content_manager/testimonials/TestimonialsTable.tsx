import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Check, ChevronLeft, ChevronRight, Star, Trash2, X } from 'lucide-react';
import React from 'react';
import type { TestimonialResponse } from '@/types/service';

interface TestimonialsTableProps {
  testimonials: TestimonialResponse[];
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onApprove: (item: TestimonialResponse) => void;
  onReject: (item: TestimonialResponse) => void;
  onDelete: (item: TestimonialResponse) => void;
}

const renderStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#334155] text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Disetujui
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#78350F] text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Menunggu Review
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          Ditolak
        </span>
      );
  }
};

const renderRating = (rating: number) => {
  return (
    <div className="flex items-center gap-0.5 mt-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={`star-${i}`}
          className={`w-3.5 h-3.5 ${
            i < Math.min(Math.max(rating, 0), 5)
              ? 'text-amber-400 fill-amber-400'
              : 'text-slate-300'
          }`}
        />
      ))}
    </div>
  );
};

export const TestimonialsTable: React.FC<TestimonialsTableProps> = ({
  testimonials,
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  onApprove,
  onReject,
  onDelete,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider font-bold text-slate-500">
              <th className="py-3 px-4">Penulis</th>
              <th className="py-3 px-4">Isi Testimoni</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4 text-center w-44">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {testimonials.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                  Belum ada testimoni terdaftar.
                </td>
              </tr>
            ) : (
              testimonials.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 align-top">
                    <p className="font-bold text-xs sm:text-sm leading-snug text-slate-800">
                      {item.authorName}
                    </p>
                    {item.authorRole && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.authorRole}</p>
                    )}
                    {renderRating(item.rating)}
                  </td>

                  <td className="py-3.5 px-4 align-top max-w-xs">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {item.content}
                    </p>
                  </td>

                  <td className="py-3.5 px-4 text-center align-top whitespace-nowrap">
                    {renderStatusBadge(item.status)}
                  </td>

                  <td className="py-3.5 px-4 align-top whitespace-nowrap text-xs text-slate-500 font-medium">
                    {item.createdAt
                      ? format(new Date(item.createdAt), 'dd MMM yyyy', { locale: id })
                      : '-'}
                  </td>

                  <td className="py-3.5 px-4 align-top text-center">
                    <div className="inline-flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onApprove(item)}
                        title="Setujui testimoni"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Setujui</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onReject(item)}
                        title="Tolak testimoni"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 transition cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        title="Hapus testimoni"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span>
          Menampilkan{' '}
          <strong className="text-slate-800">
            {testimonials.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}
          </strong>
          –
          <strong className="text-slate-800">
            {Math.min(currentPage * rowsPerPage, totalItems)}
          </strong>{' '}
          dari <strong className="text-slate-800">{totalItems}</strong> testimoni
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition cursor-pointer bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded font-semibold bg-[#0F766E] text-white border border-[#0F766E]"
          >
            {currentPage}
          </button>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition cursor-pointer bg-slate-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
