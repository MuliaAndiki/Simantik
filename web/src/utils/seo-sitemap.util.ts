import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/configs/site.config';

export const STATIC_SITEMAP_LAST_MODIFIED = new Date('2026-11-01T00:00:00.000Z');

export interface SitemapNewsItemInput {
  id?: string;
  slug?: string;
  updatedAt?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
}

export interface SitemapDocumentationItemInput {
  id?: string;
  slug?: string;
  updatedAt?: string | null;
  createdAt?: string | null;
}

const HTML_ENTITY_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
};

/**
 * Strips HTML tags and normalizes whitespace into a concise plain-text excerpt.
 */
export function stripHtmlAndTruncate(html: string | null | undefined, maxLength = 155): string {
  if (!html) return '';

  const withoutBlocks = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');

  const decoded = withoutBlocks.replace(
    /&(amp|lt|gt|quot|#39|apos|nbsp);/gi,
    (entity) => HTML_ENTITY_MAP[entity.toLowerCase()] ?? entity
  );

  const normalized = decoded.replace(/\s+/g, ' ').trim();
  if (!normalized || normalized.length <= maxLength) {
    return normalized;
  }

  const sliced = normalized.slice(0, maxLength).trimEnd();
  const lastSpace = sliced.lastIndexOf(' ');
  const cleanCut = lastSpace > Math.floor(maxLength * 0.6) ? sliced.slice(0, lastSpace) : sliced;
  return `${cleanCut}...`;
}

/**
 * Resolves a path or relative URL into an absolute canonical URL on the given site base.
 */
export function resolveAbsoluteUrl(pathOrUrl: string, siteUrl: string = getSiteUrl()): string {
  const base = siteUrl.trim().replace(/\/+$/, '');
  const trimmed = pathOrUrl.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return normalizedPath === '/' ? `${base}/` : `${base}${normalizedPath}`;
}

/**
 * Parses an optional ISO date string safely, falling back to a deterministic timestamp.
 */
export function resolveSafeDate(
  dateValue?: string | null,
  fallback: Date = STATIC_SITEMAP_LAST_MODIFIED
): Date {
  if (!dateValue) return fallback;
  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

/**
 * Returns the static indexable public routes for sitemap.xml.
 * Excludes `/` (permanent redirect to `/home`) and `/login` (auth form).
 */
export function buildStaticSitemapRoutes(
  siteUrl: string = getSiteUrl(),
  lastModified: Date = STATIC_SITEMAP_LAST_MODIFIED,
  latestTutorialModified?: Date | null
): MetadataRoute.Sitemap {
  const routes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    lastModified?: Date;
  }> = [
    { path: '/home', priority: 1.0, changeFrequency: 'daily' },
    { path: '/documentation', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/news', priority: 0.9, changeFrequency: 'daily' },
    {
      path: '/tutorials',
      priority: 0.8,
      changeFrequency: 'weekly',
      lastModified: latestTutorialModified ?? lastModified,
    },
    { path: '/testimonials', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/help', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/register', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/pilih-sekolah', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.4, changeFrequency: 'yearly' },
  ];

  return routes.map((route) => ({
    url: resolveAbsoluteUrl(route.path, siteUrl),
    lastModified: route.lastModified ?? lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

/**
 * Builds deduplicated sitemap entries combining static routes with dynamic news & documentation articles.
 */
export function buildFullSitemapEntries(params: {
  siteUrl?: string;
  news?: SitemapNewsItemInput[];
  documentation?: SitemapDocumentationItemInput[];
  latestTutorialUpdatedAt?: string | null;
  staticLastModified?: Date;
}): MetadataRoute.Sitemap {
  const siteUrl = (params.siteUrl ?? getSiteUrl()).trim().replace(/\/+$/, '');
  const staticLastModified = params.staticLastModified ?? STATIC_SITEMAP_LAST_MODIFIED;
  const latestTutorialDate = params.latestTutorialUpdatedAt
    ? resolveSafeDate(params.latestTutorialUpdatedAt, staticLastModified)
    : null;

  const entryMap = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const staticEntry of buildStaticSitemapRoutes(
    siteUrl,
    staticLastModified,
    latestTutorialDate
  )) {
    entryMap.set(staticEntry.url, staticEntry);
  }

  for (const item of params.news ?? []) {
    const slugOrId = (item.slug || item.id || '').trim();
    if (!slugOrId) continue;

    const url = resolveAbsoluteUrl(`/news/${encodeURIComponent(slugOrId)}`, siteUrl);
    if (!entryMap.has(url)) {
      entryMap.set(url, {
        url,
        lastModified: resolveSafeDate(
          item.updatedAt || item.publishedAt || item.createdAt,
          staticLastModified
        ),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  for (const doc of params.documentation ?? []) {
    const slugOrId = (doc.slug || doc.id || '').trim();
    if (!slugOrId) continue;

    const url = resolveAbsoluteUrl(`/documentation/${encodeURIComponent(slugOrId)}`, siteUrl);
    if (!entryMap.has(url)) {
      entryMap.set(url, {
        url,
        lastModified: resolveSafeDate(doc.updatedAt || doc.createdAt, staticLastModified),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  return Array.from(entryMap.values());
}
