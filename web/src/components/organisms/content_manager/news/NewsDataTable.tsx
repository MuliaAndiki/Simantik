import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight, Eye, MoreVertical, ThumbsUp } from 'lucide-react';
import React from 'react';
import type { NewsResponse } from '@/types/service';

interface NewsDataTableProps {
  news: NewsResponse[];
  selectedId?: string;
  onSelectNews: (item: NewsResponse) => void;
  onEditNews: (item: NewsResponse) => void;
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
}

export const NewsDataTable: React.FC<NewsDataTableProps> = ({
  news,
  selectedId,
  onSelectNews,
  onEditNews,
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#334155] text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Published
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#78350F] text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Unpublished
          </span>
        );
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider font-bold text-slate-500">
              <th className="py-3 px-4">Artikel</th>
              <th className="py-3 px-4">Author</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Statistik</th>
              <th className="py-3 px-4">Tanggal Rilis</th>
              <th className="py-3 px-4 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {news.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                  Belum ada berita terdaftar.
                </td>
              </tr>
            ) : (
              news.map((item) => {
                const isSelected = item.id === selectedId;

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectNews(item)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-[#F4FBFA] ring-1 ring-inset ring-[#0E7490]/20'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex gap-3 items-start">
                        <div className="w-16 h-10 bg-slate-100 rounded overflow-hidden shrink-0">
                          {item.thumbnailUrl ? (
                            // biome-ignore lint/performance/noImgElement: intentional for external CMS image
                            <img
                              src={item.thumbnailUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Calendar className="w-4 h-4" />
                            </div>
                          )}
                        </div>
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
                          <p className="text-[11px] text-slate-400 font-medium">
                            Oleh: {item.createdBy}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-[10px] font-bold">
                          {getInitials(item.createdBy)}
                        </div>
                        <span className="text-xs font-semibold text-slate-700">
                          {item.createdBy}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center align-top whitespace-nowrap">
                      {renderStatusBadge(item.status)}
                    </td>

                    <td className="py-3.5 px-4 text-center align-top whitespace-nowrap text-slate-500">
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span className="text-[11px]">-</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="text-[11px]">-</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top whitespace-nowrap text-xs text-slate-500 font-medium">
                      {item.publishedAt
                        ? format(new Date(item.publishedAt), 'dd MMM yyyy', { locale: id })
                        : '-'}
                    </td>

                    <td className="py-3.5 px-4 align-top text-center">
                      <div className="inline-flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectNews(item);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-[#0E7490] text-white hover:bg-[#0B5C73] transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditNews(item);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span>
          Menampilkan{' '}
          <strong className="text-slate-800">
            {news.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}
          </strong>
          –
          <strong className="text-slate-800">
            {Math.min(currentPage * rowsPerPage, totalItems)}
          </strong>{' '}
          dari <strong className="text-slate-800">{totalItems}</strong> berita
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
