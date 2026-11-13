import type { Metadata } from 'next';
import { SITE_SHORT_NAME } from '@/configs/site.config';
import { getDefaultOgImages, getDefaultTwitterImages } from './seo-metadata-images';

export interface PublicMetadataOptions {
  title: string;
  description: string;
  canonicalPath: string;
  robots?: Metadata['robots'];
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  includeDefaultImages?: boolean;
}

/**
 * Constructs consistent per-page SEO metadata with self-referencing canonicals, OpenGraph, and Twitter fields.
 */
export function buildPageMetadata({
  title,
  description,
  canonicalPath,
  robots,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  includeDefaultImages = true,
}: PublicMetadataOptions): Metadata {
  const normalizedCanonical = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;

  return {
    title,
    description,
    alternates: {
      canonical: normalizedCanonical,
    },
    ...(robots ? { robots } : {}),
    openGraph: {
      type,
      siteName: SITE_SHORT_NAME,
      title,
      description,
      url: normalizedCanonical,
      ...(includeDefaultImages ? { images: getDefaultOgImages(title) } : {}),
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
      ...(type === 'article' && authors ? { authors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(includeDefaultImages ? { images: getDefaultTwitterImages() } : {}),
    },
  };
}
