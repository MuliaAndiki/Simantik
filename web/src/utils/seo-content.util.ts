import { cache } from 'react';
import { PublicRequest } from '@/api/server/server-fetch';
import { ApiError } from '@/api/types/response.types';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import type {
  DocumentationResponse,
  NewsResponse,
  PaginatedDocumentationResponse,
  PaginatedNewsResponse,
  PaginatedTutorialsResponse,
} from '@/types/service';
import { buildQueryString } from '@/utils/query-string.util';

const SEO_FETCH_TIMEOUT_MS = 4000;
const SEO_REVALIDATE_SECONDS = 3600;
const SITEMAP_PAGE_SIZE = 50;
const MAX_SITEMAP_PAGES = 100;

export interface SeoSlugLookupResult<T> {
  item: T | null;
  notFound: boolean;
}

function getSeoRequestConfig() {
  return {
    next: { revalidate: SEO_REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(SEO_FETCH_TIMEOUT_MS),
  } as const;
}

export const fetchPublicNewsBySlug = cache(
  async (slug: string): Promise<SeoSlugLookupResult<NewsResponse>> => {
    if (!slug) {
      return { item: null, notFound: true };
    }

    try {
      const item = await PublicRequest<NewsResponse>(
        EndpointEntry.content.newsBySlug(encodeURIComponent(slug)),
        getSeoRequestConfig()
      );
      return { item: item ?? null, notFound: !item };
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return { item: null, notFound: true };
      }
      return { item: null, notFound: false };
    }
  }
);

export const fetchPublicDocumentationBySlug = cache(
  async (slug: string): Promise<SeoSlugLookupResult<DocumentationResponse>> => {
    if (!slug) {
      return { item: null, notFound: true };
    }

    try {
      const item = await PublicRequest<DocumentationResponse>(
        EndpointEntry.content.documentationBySlug(encodeURIComponent(slug)),
        getSeoRequestConfig()
      );
      return { item: item ?? null, notFound: !item };
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return { item: null, notFound: true };
      }
      return { item: null, notFound: false };
    }
  }
);

export async function fetchAllPublishedNewsForSitemap(): Promise<NewsResponse[]> {
  const results: NewsResponse[] = [];
  let offset = 0;

  try {
    for (let page = 0; page < MAX_SITEMAP_PAGES; page++) {
      const path = buildQueryString(EndpointEntry.content.news, {
        limit: SITEMAP_PAGE_SIZE,
        offset,
      });
      const response = await PublicRequest<PaginatedNewsResponse>(path, getSeoRequestConfig());
      const items = response?.news ?? [];
      if (items.length === 0) break;

      results.push(...items);
      offset += items.length;
      if (offset >= (response?.total ?? 0)) break;
    }
  } catch {
    // Graceful fallback: return items collected before transient failure so sitemap never 500s
  }

  return results;
}

export async function fetchAllPublishedDocumentationForSitemap(): Promise<DocumentationResponse[]> {
  const results: DocumentationResponse[] = [];
  let offset = 0;

  try {
    for (let page = 0; page < MAX_SITEMAP_PAGES; page++) {
      const path = buildQueryString(EndpointEntry.content.documentation, {
        limit: SITEMAP_PAGE_SIZE,
        offset,
      });
      const response = await PublicRequest<PaginatedDocumentationResponse>(
        path,
        getSeoRequestConfig()
      );
      const items = response?.documentation ?? [];
      if (items.length === 0) break;

      results.push(...items);
      offset += items.length;
      if (offset >= (response?.total ?? 0)) break;
    }
  } catch {
    // Graceful fallback: return items collected before transient failure so sitemap never 500s
  }

  return results;
}

export async function fetchLatestTutorialUpdatedAtForSitemap(): Promise<string | null> {
  try {
    const path = buildQueryString(EndpointEntry.content.tutorials, {
      limit: 10,
      offset: 0,
    });
    const response = await PublicRequest<PaginatedTutorialsResponse>(path, getSeoRequestConfig());
    const tutorials = response?.tutorials ?? [];
    let latestMs = 0;
    let latestIso: string | null = null;

    for (const item of tutorials) {
      const candidate = item.updated_at || item.published_at || item.created_at;
      if (!candidate) continue;
      const ms = Date.parse(candidate);
      if (!Number.isNaN(ms) && ms > latestMs) {
        latestMs = ms;
        latestIso = candidate;
      }
    }

    return latestIso;
  } catch {
    return null;
  }
}
