import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleJsonLd } from '@/components/atoms/seo/JsonLd';
import { fetchPublicNewsBySlug } from '@/utils/seo-content.util';
import { buildPageMetadata } from '@/utils/seo-metadata.util';
import { resolveAbsoluteUrl, stripHtmlAndTruncate } from '@/utils/seo-sitemap.util';
import PublicNewsDetailContainer from './_containers/PublicNewsDetailContainer';

export interface PublicNewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

function formatFallbackTitle(slug: string): string {
  return decodeURIComponent(slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: PublicNewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { item, notFound: isNotFound } = await fetchPublicNewsBySlug(slug);

  if (isNotFound) {
    return {
      title: 'Berita Tidak Ditemukan',
      robots: { index: false, follow: false },
    };
  }

  if (!item) {
    return buildPageMetadata({
      title: `${formatFallbackTitle(slug)} | Berita SIMANTIK`,
      description: 'Wawasan dan pengumuman resmi dari platform SIMANTIK.',
      canonicalPath: `/news/${encodeURIComponent(slug)}`,
      type: 'article',
      includeDefaultImages: false,
    });
  }

  const canonicalSlug = item.slug || slug;
  const excerpt =
    stripHtmlAndTruncate(item.content, 155) ||
    'Wawasan kurikulum dan pengumuman resmi dari platform SIMANTIK.';

  return buildPageMetadata({
    title: item.title,
    description: excerpt,
    canonicalPath: `/news/${encodeURIComponent(canonicalSlug)}`,
    type: 'article',
    publishedTime: item.publishedAt || item.createdAt || undefined,
    modifiedTime: item.updatedAt || item.publishedAt || item.createdAt || undefined,
    authors: ['Tim Redaksi SIMANTIK'],
    includeDefaultImages: false,
  });
}

export default async function PublicNewsDetailPage({ params }: PublicNewsDetailPageProps) {
  const { slug } = await params;
  const { item, notFound: isNotFound } = await fetchPublicNewsBySlug(slug);

  if (isNotFound) {
    notFound();
  }

  const canonicalSlug = item?.slug || slug;
  const excerpt = item
    ? stripHtmlAndTruncate(item.content, 155) || 'Berita resmi platform SIMANTIK.'
    : '';
  const imageUrl = item?.thumbnailUrl
    ? item.thumbnailUrl.startsWith('http')
      ? item.thumbnailUrl
      : resolveAbsoluteUrl(item.thumbnailUrl)
    : undefined;

  return (
    <>
      {item ? (
        <ArticleJsonLd
          type="NewsArticle"
          title={item.title}
          description={excerpt}
          urlPath={`/news/${encodeURIComponent(canonicalSlug)}`}
          imageUrl={imageUrl}
          datePublished={item.publishedAt || item.createdAt}
          dateModified={item.updatedAt || item.publishedAt || item.createdAt}
          authorName="Tim Redaksi SIMANTIK"
        />
      ) : null}
      <PublicNewsDetailContainer slug={slug} />
    </>
  );
}
