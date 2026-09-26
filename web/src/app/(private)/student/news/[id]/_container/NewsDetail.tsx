'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useApi from '@/hooks/useApi';

// Register the web component if running in browser
if (typeof window !== 'undefined') {
  import('@aejkatappaja/phantom-ui');
}

export interface NewsDetailContainerProps {
  id: string; // Actually a slug based on our mapping
}

const NewsDetailContainer: React.FC<NewsDetailContainerProps> = ({ id }) => {
  const router = useRouter();
  const { content } = useApi();
  const {
    data: newsItem,
    isLoading,
    isError,
  } = content.query.newsBySlug(id, {
    enabled: Boolean(id),
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition mb-8 font-semibold"
      >
        <ArrowLeft className="size-4" />
        Kembali
      </button>

      {/* Skeleton Loading using @aejkatappaja/phantom-ui */}
      {isLoading && (
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200">
          <phantom-ui
            loading="true"
            animation="shimmer"
            count="1"
            style={{ height: '32px', width: '50%', marginBottom: '16px' }}
          ></phantom-ui>
          <phantom-ui
            loading="true"
            animation="shimmer"
            count="1"
            style={{ height: '16px', width: '20%', marginBottom: '40px' }}
          ></phantom-ui>

          <div className="space-y-4">
            <phantom-ui
              loading="true"
              animation="shimmer"
              count="3"
              count-gap="12"
              style={{ height: '16px', width: '100%' }}
            ></phantom-ui>
            <phantom-ui
              loading="true"
              animation="shimmer"
              count="1"
              style={{ height: '16px', width: '80%' }}
            ></phantom-ui>

            <div className="h-6"></div>

            <phantom-ui
              loading="true"
              animation="shimmer"
              count="2"
              count-gap="12"
              style={{ height: '16px', width: '100%' }}
            ></phantom-ui>
            <phantom-ui
              loading="true"
              animation="shimmer"
              count="1"
              style={{ height: '16px', width: '60%' }}
            ></phantom-ui>
          </div>
        </div>
      )}

      {isError && !isLoading && (
        <div className="py-20 text-center text-slate-500">
          Gagal memuat berita atau pengumuman tidak ditemukan.
        </div>
      )}

      {!isLoading && !isError && newsItem && (
        <article className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
          <div className="mb-8 border-b border-slate-100 pb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-4">
              {newsItem.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wider">
                Pengumuman
              </span>
              <span>•</span>
              <span>
                {new Date(newsItem.createdAt || new Date()).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div
            className="prose prose-slate max-w-none prose-img:rounded-2xl prose-headings:font-bold prose-a:text-teal-600 hover:prose-a:text-teal-700"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: by design
            dangerouslySetInnerHTML={{ __html: newsItem.content }}
          />
        </article>
      )}
    </div>
  );
};

export default NewsDetailContainer;
