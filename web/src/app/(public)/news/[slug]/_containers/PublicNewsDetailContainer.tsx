'use client';

import { ArrowLeft, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { PublicPageLoader } from '@/components/atoms/loading';
import { NewsDetailPage } from '@/components/page/public/NewsDetailPage';
import NavLayout from '@/core/layouts/nav.layout';
import { useApi } from '@/hooks/useApi';
import type { LandingNewsItem, NewsDetailArticleItem } from '@/types/ui';

export interface PublicNewsDetailContainerProps {
  slug: string;
}

export function PublicNewsDetailContainer({ slug }: PublicNewsDetailContainerProps) {
  const { content } = useApi();

  const { data: newsApiData, isLoading } = content.query.newsBySlug(slug, {
    enabled: Boolean(slug),
  });

  const { data: recentNewsData } = content.query.news({ limit: 4 });

  const resolvedArticle: NewsDetailArticleItem | null = useMemo(() => {
    if (!newsApiData) return null;

    return {
      id: newsApiData.id,
      title: newsApiData.title,
      slug: newsApiData.slug,
      content: newsApiData.content,
      excerpt: newsApiData.content
        ? `${newsApiData.content.replace(/<[^>]*>?/gm, '').substring(0, 160)}...`
        : '',
      tag: 'Berita Resmi',
      date: newsApiData.createdAt
        ? new Date(newsApiData.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : 'Terbaru',
      imageUrl: newsApiData.thumbnailUrl || '/illustrations/student-learning.jpg',
      readTimeMinutes: Math.max(2, Math.ceil((newsApiData.content?.length || 500) / 400)),
      author: 'Tim Redaksi SIMANTIK',
    };
  }, [newsApiData]);

  const relatedNews: LandingNewsItem[] = useMemo(() => {
    if (!recentNewsData?.news || recentNewsData.news.length === 0) return [];

    return recentNewsData.news
      .filter((n) => n.slug !== slug && n.id !== slug)
      .slice(0, 3)
      .map((n) => ({
        id: n.id,
        title: n.title,
        excerpt: n.content ? `${n.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}...` : '',
        date: n.createdAt
          ? new Date(n.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'Terbaru',
        slug: n.slug,
        imageUrl: n.thumbnailUrl || '/illustrations/student-learning.jpg',
        tag: 'Berita Resmi',
      }));
  }, [recentNewsData, slug]);

  if (isLoading && !resolvedArticle) {
    return (
      <NavLayout themeVariant="dark">
        <div className="py-24">
          <PublicPageLoader label="Memuat naskah berita & wawasan..." />
        </div>
      </NavLayout>
    );
  }

  if (!resolvedArticle) {
    return (
      <NavLayout themeVariant="dark">
        <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Newspaper className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-slate-900">Berita Tidak Ditemukan</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Artikel atau pengumuman yang kamu cari tidak tersedia atau mungkin telah diarsipkan.
              </p>
            </div>

            <Link
              href="/news"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Indeks Berita</span>
            </Link>
          </div>
        </div>
      </NavLayout>
    );
  }

  return <NewsDetailPage article={resolvedArticle} relatedNews={relatedNews} />;
}

export default PublicNewsDetailContainer;
