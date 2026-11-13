import { renderSimantikOgImage } from '@/components/atoms/seo/og-card';
import { fetchPublicDocumentationBySlug, fetchPublicNewsBySlug } from '@/utils/seo-content.util';
import { stripHtmlAndTruncate } from '@/utils/seo-sitemap.util';

function formatSlugFallbackTitle(slug: string): string {
  return decodeURIComponent(slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function renderNewsArticleOgImage(slug: string) {
  const { item } = await fetchPublicNewsBySlug(slug);

  if (!item) {
    return renderSimantikOgImage({
      categoryLabel: 'Berita SIMANTIK',
      title: formatSlugFallbackTitle(slug),
      subtitle: 'Wawasan kurikulum, informasi pendidikan, dan pengumuman resmi SIMANTIK.',
    });
  }

  return renderSimantikOgImage({
    categoryLabel: 'Berita Resmi',
    title: item.title,
    subtitle: stripHtmlAndTruncate(item.content, 130) || 'Berita resmi platform SIMANTIK.',
    thumbnailUrl: item.thumbnailUrl,
  });
}

export async function renderDocumentationSlugOgImage(slug: string) {
  const { item } = await fetchPublicDocumentationBySlug(slug);

  if (!item) {
    return renderSimantikOgImage({
      categoryLabel: 'Dokumentasi',
      title: formatSlugFallbackTitle(slug),
      subtitle: 'Panduan resmi dan rujukan operasional platform SIMANTIK.',
    });
  }

  return renderSimantikOgImage({
    categoryLabel: item.category || 'Dokumentasi Resmi',
    title: item.title,
    subtitle:
      stripHtmlAndTruncate(item.content, 130) ||
      'Panduan resmi dan standar asesmen kompetensi SIMANTIK.',
  });
}
