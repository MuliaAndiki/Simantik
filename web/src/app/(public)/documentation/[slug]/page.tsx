import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleJsonLd } from '@/components/atoms/seo/JsonLd';
import { fetchPublicDocumentationBySlug } from '@/utils/seo-content.util';
import { buildPageMetadata } from '@/utils/seo-metadata.util';
import { stripHtmlAndTruncate } from '@/utils/seo-sitemap.util';
import DocDetailContainer from './_containers/DocDetailContainer';

export interface DocumentationDetailPageProps {
  params: Promise<{ slug: string }>;
}

function formatFallbackTitle(slug: string): string {
  return decodeURIComponent(slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({
  params,
}: DocumentationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { item, notFound: isNotFound } = await fetchPublicDocumentationBySlug(slug);

  if (isNotFound) {
    return {
      title: 'Dokumentasi Tidak Ditemukan',
      robots: { index: false, follow: false },
    };
  }

  if (!item) {
    return buildPageMetadata({
      title: `${formatFallbackTitle(slug)} | Dokumentasi SIMANTIK`,
      description: 'Panduan resmi dan rujukan operasional platform SIMANTIK.',
      canonicalPath: `/documentation/${encodeURIComponent(slug)}`,
      type: 'article',
      includeDefaultImages: false,
    });
  }

  const canonicalSlug = item.slug || slug;
  const excerpt =
    stripHtmlAndTruncate(item.content, 155) ||
    'Panduan resmi dan rujukan operasional platform SIMANTIK.';

  return buildPageMetadata({
    title: item.title,
    description: excerpt,
    canonicalPath: `/documentation/${encodeURIComponent(canonicalSlug)}`,
    type: 'article',
    publishedTime: item.createdAt || undefined,
    modifiedTime: item.updatedAt || item.createdAt || undefined,
    authors: ['Tim Ahli SIMANTIK UNP'],
    includeDefaultImages: false,
  });
}

export default async function DocumentationDetailPage({ params }: DocumentationDetailPageProps) {
  const { slug } = await params;
  const { item, notFound: isNotFound } = await fetchPublicDocumentationBySlug(slug);

  if (isNotFound) {
    notFound();
  }

  const canonicalSlug = item?.slug || slug;
  const excerpt = item
    ? stripHtmlAndTruncate(item.content, 155) ||
      'Panduan resmi dan rujukan operasional platform SIMANTIK.'
    : '';

  return (
    <>
      {item ? (
        <ArticleJsonLd
          type="TechArticle"
          title={item.title}
          description={excerpt}
          urlPath={`/documentation/${encodeURIComponent(canonicalSlug)}`}
          datePublished={item.createdAt}
          dateModified={item.updatedAt || item.createdAt}
          authorName="Tim Ahli SIMANTIK UNP"
        />
      ) : null}
      <DocDetailContainer slug={slug} />
    </>
  );
}
