import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/configs/site.config';
import {
  fetchAllPublishedDocumentationForSitemap,
  fetchAllPublishedNewsForSitemap,
  fetchLatestTutorialUpdatedAtForSitemap,
} from '@/utils/seo-content.util';
import { buildFullSitemapEntries } from '@/utils/seo-sitemap.util';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const [news, documentation, latestTutorialUpdatedAt] = await Promise.all([
    fetchAllPublishedNewsForSitemap(),
    fetchAllPublishedDocumentationForSitemap(),
    fetchLatestTutorialUpdatedAtForSitemap(),
  ]);

  return buildFullSitemapEntries({
    siteUrl,
    news,
    documentation,
    latestTutorialUpdatedAt,
  });
}
