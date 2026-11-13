import { describe, expect, it } from 'bun:test';
import { buildPageMetadata } from './seo-metadata.util';
import {
  buildFullSitemapEntries,
  buildStaticSitemapRoutes,
  resolveAbsoluteUrl,
  STATIC_SITEMAP_LAST_MODIFIED,
  stripHtmlAndTruncate,
} from './seo-sitemap.util';

describe('seo-sitemap.util', () => {
  it('strips HTML tags, script/style blocks, decodes entities, and clamps length', () => {
    const rawHtml =
      '<style>.x{color:red}</style><h1>Peluncuran &amp; Uji Coba</h1><p>Latihan TKA Bahasa&nbsp;Indonesia gratis untuk siswa SMA/SMK di Indonesia sekarang tersedia.</p><script>alert(1)</script>';
    const full = stripHtmlAndTruncate(rawHtml, 200);
    expect(full).toBe(
      'Peluncuran & Uji Coba Latihan TKA Bahasa Indonesia gratis untuk siswa SMA/SMK di Indonesia sekarang tersedia.'
    );

    const short = stripHtmlAndTruncate(rawHtml, 55);
    expect(short.endsWith('...')).toBe(true);
    expect(short.length).toBeLessThanOrEqual(58);
  });

  it('resolves relative paths against canonical siteUrl without double slashes', () => {
    expect(resolveAbsoluteUrl('/home', 'https://simantik.id/')).toBe('https://simantik.id/home');
    expect(resolveAbsoluteUrl('news/rilis-baru', 'https://simantik.id')).toBe(
      'https://simantik.id/news/rilis-baru'
    );
    expect(resolveAbsoluteUrl('https://simantik.id/media/cover.png', 'https://simantik.id')).toBe(
      'https://simantik.id/media/cover.png'
    );
  });

  it('excludes legacy domain, bare root redirect, and login route from static sitemap entries', () => {
    const entries = buildStaticSitemapRoutes('https://simantik.id');
    const urls = entries.map((entry) => entry.url);

    expect(urls.some((u) => u.includes('educourse'))).toBe(false);
    expect(urls).not.toContain('https://simantik.id');
    expect(urls).not.toContain('https://simantik.id/');
    expect(urls).not.toContain('https://simantik.id/login');
    expect(urls).toContain('https://simantik.id/home');
    expect(urls).toContain('https://simantik.id/register');
  });

  it('merges dynamic news and documentation slugs with real timestamps and deduplicates urls', () => {
    const entries = buildFullSitemapEntries({
      siteUrl: 'https://simantik.id',
      news: [
        {
          id: '1',
          slug: 'panduan-tka-2026',
          updatedAt: '2026-11-10T08:30:00.000Z',
        },
        {
          id: '1-dup',
          slug: 'panduan-tka-2026',
          updatedAt: '2026-11-12T08:30:00.000Z',
        },
      ],
      documentation: [
        {
          id: 'doc-1',
          slug: 'cara-mengikuti-tryout',
          updatedAt: '2026-11-09T10:00:00.000Z',
        },
      ],
      latestTutorialUpdatedAt: '2026-11-11T12:00:00.000Z',
    });

    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) {
      expect(url.startsWith('https://simantik.id/')).toBe(true);
      expect(url.includes('simantik.educourse.id')).toBe(false);
    }

    const newsEntry = entries.find((e) => e.url === 'https://simantik.id/news/panduan-tka-2026');
    expect(newsEntry?.lastModified).toEqual(new Date('2026-11-10T08:30:00.000Z'));

    const docEntry = entries.find(
      (e) => e.url === 'https://simantik.id/documentation/cara-mengikuti-tryout'
    );
    expect(docEntry?.lastModified).toEqual(new Date('2026-11-09T10:00:00.000Z'));

    const tutEntry = entries.find((e) => e.url === 'https://simantik.id/tutorials');
    expect(tutEntry?.lastModified).toEqual(new Date('2026-11-11T12:00:00.000Z'));
  });

  it('falls back cleanly to static routes when dynamic fetches return empty arrays', () => {
    const entries = buildFullSitemapEntries({
      siteUrl: 'https://simantik.id',
      news: [],
      documentation: [],
      latestTutorialUpdatedAt: null,
    });

    expect(entries.length).toBe(buildStaticSitemapRoutes('https://simantik.id').length);
    const homeEntry = entries.find((e) => e.url === 'https://simantik.id/home');
    expect(homeEntry?.lastModified).toEqual(STATIC_SITEMAP_LAST_MODIFIED);
  });
});

describe('seo-metadata.util', () => {
  it('builds unique canonical, openGraph, and twitter metadata per page with default OG image', () => {
    const meta = buildPageMetadata({
      title: 'Berita & Pengumuman Resmi',
      description: 'Deskripsi halaman berita.',
      canonicalPath: 'news',
    });

    expect(meta.title).toBe('Berita & Pengumuman Resmi');
    expect(meta.alternates?.canonical).toBe('/news');
    expect(meta.openGraph?.url).toBe('/news');
    expect(meta.openGraph?.images).toEqual([
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Berita & Pengumuman Resmi',
      },
    ]);
    expect(meta.twitter).toEqual({
      card: 'summary_large_image',
      title: 'Berita & Pengumuman Resmi',
      description: 'Deskripsi halaman berita.',
      images: ['/images/og-default.png'],
    });
  });

  it('allows omitting default OG images on routes with dedicated file-convention OG generators', () => {
    const meta = buildPageMetadata({
      title: 'Artikel Uji',
      description: 'Ringkasan artikel.',
      canonicalPath: '/news/artikel-uji',
      type: 'article',
      includeDefaultImages: false,
    });

    expect(meta.openGraph?.images).toBeUndefined();
    expect(meta.twitter?.images).toBeUndefined();
  });
});
