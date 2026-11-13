import {
  DEFAULT_OG_IMAGE_PATH,
  getSiteUrl,
  ORGANIZATION_LOGO_PATH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
  SUPPORT_EMAIL,
} from '@/configs/site.config';

export interface ArticleJsonLdProps {
  type?: 'NewsArticle' | 'TechArticle' | 'Article';
  title: string;
  description: string;
  urlPath: string;
  imageUrl?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string;
}

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data injection
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Global site-wide structured data: EducationalOrganization, WebSite, and SoftwareApplication.
 */
export function JsonLd() {
  const siteUrl = getSiteUrl();
  const orgId = `${siteUrl}/#organization`;
  const ogImageUrl = `${siteUrl}${DEFAULT_OG_IMAGE_PATH}`;
  const logoUrl = `${siteUrl}${ORGANIZATION_LOGO_PATH}`;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': orgId,
        name: 'SIMANTIK – Universitas Negeri Padang',
        url: siteUrl,
        email: SUPPORT_EMAIL,
        logo: {
          '@type': 'ImageObject',
          url: logoUrl,
          width: 512,
          height: 512,
        },
        sameAs: ['https://unp.ac.id', siteUrl],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: `${SITE_SHORT_NAME} – Simulasi Mandiri TKA Bahasa Indonesia`,
        description:
          'Platform pembelajaran wacana, tryout adaptif, analisis diagnostik, dan remedial Bahasa Indonesia SMA/SMK oleh Tim Ahli UNP.',
        inLanguage: 'id-ID',
        publisher: {
          '@id': orgId,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/documentation?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${siteUrl}/#app`,
        name: SITE_NAME,
        alternateName: [SITE_SHORT_NAME, 'Simantik UNP', 'Asesmen Mandiri TKA Bahasa Indonesia'],
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'All (Web / PWA)',
        inLanguage: 'id-ID',
        url: siteUrl,
        image: ogImageUrl,
        screenshot: ogImageUrl,
        description: SITE_DESCRIPTION,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'IDR',
          availability: 'https://schema.org/InStock',
        },
        author: { '@id': orgId },
        creator: { '@id': orgId },
        provider: { '@id': orgId },
      },
    ],
  };

  return <JsonLdScript data={schema} />;
}

/**
 * Landing page structured data: Course overview and FAQPage (rendered only on `/` and `/home`).
 */
export function HomeFaqJsonLd() {
  const siteUrl = getSiteUrl();
  const orgId = `${siteUrl}/#organization`;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Course',
        '@id': `${siteUrl}/#course-tka`,
        name: 'Simulasi Mandiri & Latihan Wacana TKA Bahasa Indonesia SMA/SMK',
        description:
          'Paket pembelajaran mandiri berbasis teks wacana, latihan soal HOTS literasi membaca, dan tryout adaptif TKA Bahasa Indonesia standar nasional.',
        provider: {
          '@id': orgId,
        },
        educationalLevel: 'SMA / SMK / MA Sederajat',
        inLanguage: 'id-ID',
        isAccessibleForFree: true,
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Apa itu SIMANTIK?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SIMANTIK (Simulasi Mandiri Tes Kemampuan Akademik) adalah platform asesmen adaptif dan pembelajaran berbasis wacana Bahasa Indonesia untuk siswa SMA/SMK di Indonesia yang dikembangkan oleh tim ahli Universitas Negeri Padang (UNP).',
            },
          },
          {
            '@type': 'Question',
            name: 'Apakah latihan dan tryout TKA di SIMANTIK gratis?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ya, seluruh layanan pembelajaran mandiri, bank soal wacana, tryout asesmen adaptif, analisis diagnostik kelemahan, dan rekomendasi materi remedial di SIMANTIK 100% gratis untuk seluruh siswa dan sekolah di Indonesia.',
            },
          },
          {
            '@type': 'Question',
            name: 'Bagaimana SIMANTIK membantu siswa menghadapi TKA Bahasa Indonesia?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SIMANTIK menyediakan 4 siklus belajar terpadu: Belajar Mandiri Berbasis Wacana, Tryout Asesmen Adaptif, Analisis Diagnostik Kelemahan Pemahaman Membaca, dan Rekomendasi Remedial Berbasis Skor Kompetensi.',
            },
          },
          {
            '@type': 'Question',
            name: 'Apakah SIMANTIK bisa dipasang sebagai aplikasi di smartphone?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ya, SIMANTIK mendukung teknologi Progressive Web App (PWA). Siswa dapat memindai kode QR PWA atau membuka situs di Google Chrome (Android) atau Safari (iOS) lalu memilih menu Tambahkan ke Layar Utama (Add to Home Screen). Sangat ringan (< 2 MB) tanpa perlu mengunduh file besar dari App Store atau Play Store.',
            },
          },
          {
            '@type': 'Question',
            name: 'Siapa yang mengembangkan platform SIMANTIK?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SIMANTIK dikembangkan oleh tim ahli bahasa dan komputer dari Universitas Negeri Padang (UNP) bekerja sama dengan praktisi pendidikan untuk meningkatkan mutu literasi membaca kritis siswa di Indonesia.',
            },
          },
        ],
      },
    ],
  };

  return <JsonLdScript data={schema} />;
}

/**
 * Article structured data for individual news and documentation pages.
 */
export function ArticleJsonLd({
  type = 'Article',
  title,
  description,
  urlPath,
  imageUrl,
  datePublished,
  dateModified,
  authorName = 'Tim Redaksi SIMANTIK',
}: ArticleJsonLdProps) {
  const siteUrl = getSiteUrl();
  const orgId = `${siteUrl}/#organization`;
  const canonicalUrl = urlPath.startsWith('http')
    ? urlPath
    : `${siteUrl}${urlPath.startsWith('/') ? urlPath : `/${urlPath}`}`;
  const resolvedImage = imageUrl || `${canonicalUrl}/opengraph-image`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
    headline: title,
    description,
    url: canonicalUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    image: [resolvedImage],
    inLanguage: 'id-ID',
    author: {
      '@type': 'Organization',
      name: authorName,
      url: siteUrl,
    },
    publisher: {
      '@id': orgId,
    },
  };

  if (datePublished) {
    schema.datePublished = datePublished;
  }
  if (dateModified || datePublished) {
    schema.dateModified = dateModified || datePublished;
  }

  return <JsonLdScript data={schema} />;
}

export default JsonLd;
