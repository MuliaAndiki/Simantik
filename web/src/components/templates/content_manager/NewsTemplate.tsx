import { Plus } from 'lucide-react';
import React from 'react';
import {
  NewsDataTable,
  NewsFilterBar,
  NewsPreviewSidebar,
  NewsSummaryCards,
} from '@/components/organisms/content_manager/news';
import type { NewsResponse } from '@/types/service';
import type { NewsFilterState, NewsStats } from '@/types/ui/content-manager';

export interface NewsTemplateProps {
  stats: NewsStats;
  news: NewsResponse[];
  selectedNews: NewsResponse | null;
  filters: NewsFilterState;
  totalItems: number;
  isPending: boolean;
  onAddNews: () => void;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onSelectNews: (news: NewsResponse) => void;
  onEditNews: (news: NewsResponse) => void;
  onClosePreview: () => void;
  onPageChange: (page: number) => void;
}

const NewsTemplate: React.FC<NewsTemplateProps> = ({
  stats,
  news,
  selectedNews,
  filters,
  totalItems,
  isPending,
  onAddNews,
  onSearchChange,
  onStatusChange,
  onSelectNews,
  onEditNews,
  onClosePreview,
  onPageChange,
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Manajemen News & Pengumuman
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola feed wacana literasi, pengumuman jadwal simulasi, dan artikel kiat asesmen
            kompetensi akademik siswa.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddNews}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F5B731] hover:bg-[#E5A820] text-white text-sm font-bold rounded-xl shadow-sm transition shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Tambah News
        </button>
      </div>

      {/* Summary Cards */}
      <NewsSummaryCards stats={stats} />

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start relative">
        <div className="flex-1 w-full flex flex-col gap-4">
          <NewsFilterBar
            filters={filters}
            onSearchChange={onSearchChange}
            onStatusChange={onStatusChange}
          />

          {isPending ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-12 flex flex-col items-center justify-center gap-4 text-slate-400">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin"></div>
              <p className="text-sm font-medium">Memuat data berita...</p>
            </div>
          ) : (
            <NewsDataTable
              news={news}
              selectedId={selectedNews?.id}
              onSelectNews={onSelectNews}
              onEditNews={onEditNews}
              currentPage={filters.page}
              totalItems={totalItems}
              rowsPerPage={filters.perPage}
              onPageChange={onPageChange}
            />
          )}
        </div>

        {selectedNews && (
          <NewsPreviewSidebar news={selectedNews} onClose={onClosePreview} onEdit={onEditNews} />
        )}
      </div>
    </div>
  );
};

export default NewsTemplate;
