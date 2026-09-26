'use client';

import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NewsUpdateCard } from '@/components/molecules/student/NewsUpdateCard';
import { useApi } from '@/hooks/useApi';
import { useDebounce } from '@/hooks/useDebounce/useDebounce';

if (typeof window !== 'undefined') {
  import('@aejkatappaja/phantom-ui');
}

export default function NewsContainer() {
  const router = useRouter();
  const { content } = useApi();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: newsPage, isLoading } = content.query.news({
    search: debouncedSearch,
    limit,
    offset: (page - 1) * limit,
  });

  const totalPages = newsPage ? Math.max(1, Math.ceil(newsPage.total / limit)) : 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset page on new search
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-black text-slate-900">Berita & Pengumuman</h1>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Cari berita..."
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-shadow"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 p-5 rounded-2xl border border-slate-200">
              <phantom-ui
                loading="true"
                animation="shimmer"
                count="1"
                style={{ height: '24px', width: '40%' }}
              ></phantom-ui>
              <phantom-ui
                loading="true"
                animation="shimmer"
                count="1"
                style={{ height: '40px', width: '100%', marginTop: '8px' }}
              ></phantom-ui>
              <phantom-ui
                loading="true"
                animation="shimmer"
                count="2"
                style={{ height: '16px', width: '100%', marginTop: '16px' }}
                count-gap="8"
              ></phantom-ui>
              <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                <phantom-ui
                  loading="true"
                  animation="shimmer"
                  count="1"
                  style={{ height: '36px', width: '100px', borderRadius: '999px' }}
                ></phantom-ui>
              </div>
            </div>
          ))}
        </div>
      ) : newsPage?.news && newsPage.news.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsPage.news.map((n) => (
              <NewsUpdateCard
                key={n.id}
                title={n.title}
                excerpt={`${n.content.substring(0, 100)}...`}
                category="Pengumuman"
                date={new Date(n.createdAt || new Date()).toLocaleDateString('id-ID')}
                onReadMore={() => router.push(`/student/news/${n.slug || n.id}`)}
                href={`/student/news/${n.slug || n.id}`}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {newsPage.total > limit && (
            <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
              <div className="hidden sm:block">
                <p className="text-sm text-slate-700">
                  Menampilkan{' '}
                  <span className="font-semibold">
                    {Math.min((page - 1) * limit + 1, newsPage.total)}
                  </span>{' '}
                  hingga{' '}
                  <span className="font-semibold">{Math.min(page * limit, newsPage.total)}</span>{' '}
                  dari <span className="font-semibold">{newsPage.total}</span> hasil
                </p>
              </div>
              <div className="flex flex-1 justify-between sm:justify-end gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Sebelum
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="relative inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Lanjut <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-500 text-lg">Tidak ada berita atau pengumuman yang sesuai.</p>
        </div>
      )}
    </div>
  );
}
