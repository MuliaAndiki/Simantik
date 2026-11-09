'use client';

import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { PublicPageLoader } from '@/components/atoms/loading';
import { DocDetailPage } from '@/components/page/public/DocDetailPage';
import NavLayout from '@/core/layouts/nav.layout';
import { useApi } from '@/hooks/useApi';
import type { DocArticleItem } from '@/types/ui';

export interface DocDetailContainerProps {
  slug: string;
}

export function DocDetailContainer({ slug }: DocDetailContainerProps) {
  const { content } = useApi();
  const { data: docApiData, isLoading } = content.query.documentationBySlug(slug, {
    enabled: Boolean(slug),
  });

  const { data: recentDocsData } = content.query.documentation({ limit: 4 });

  const resolvedArticle: DocArticleItem | null = useMemo(() => {
    if (!docApiData) return null;

    return {
      id: docApiData.id,
      title: docApiData.title,
      slug: docApiData.slug,
      excerpt: docApiData.content
        ? `${docApiData.content.replace(/<[^>]*>?/gm, '').substring(0, 160)}...`
        : '',
      content: docApiData.content,
      category: docApiData.category || 'Panduan Penggunaan',
      categoryColorClass: 'bg-cyan-50 text-teal-800 border-cyan-200',
      readTimeMinutes: Math.max(2, Math.ceil((docApiData.content?.length || 500) / 400)),
      publishedDate: docApiData.createdAt
        ? new Date(docApiData.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : 'Terbaru',
      href: `/documentation/${docApiData.slug}`,
    };
  }, [docApiData]);

  const relatedArticles: DocArticleItem[] = useMemo(() => {
    if (!recentDocsData?.documentation || recentDocsData.documentation.length === 0) return [];

    return recentDocsData.documentation
      .filter((d) => d.slug !== slug && d.id !== slug)
      .slice(0, 3)
      .map((d) => ({
        id: d.id,
        title: d.title,
        slug: d.slug,
        excerpt: d.content ? `${d.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...` : '',
        category: d.category || 'Panduan Penggunaan',
        categoryColorClass: 'bg-cyan-50 text-teal-800 border-cyan-200',
        readTimeMinutes: 4,
        publishedDate: d.createdAt
          ? new Date(d.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : 'Terbaru',
        href: `/documentation/${d.slug || d.id}`,
      }));
  }, [recentDocsData, slug]);

  if (isLoading && !resolvedArticle) {
    return (
      <NavLayout themeVariant="dark">
        <div className="py-24">
          <PublicPageLoader label="Memuat dokumen panduan..." />
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
              <BookOpen className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-slate-900">Dokumentasi Tidak Ditemukan</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Artikel dokumentasi yang kamu cari tidak tersedia atau mungkin telah dipindahkan.
              </p>
            </div>

            <Link
              href="/documentation"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Dokumentasi</span>
            </Link>
          </div>
        </div>
      </NavLayout>
    );
  }

  return <DocDetailPage article={resolvedArticle} relatedArticles={relatedArticles} />;
}

export default DocDetailContainer;
