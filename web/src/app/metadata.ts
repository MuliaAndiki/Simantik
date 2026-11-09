import type { Metadata } from 'next';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://simantik.educourse.id';

export const siteConfig = {
  name: 'SIMANTIK | Simulasi Mandiri Tes Kemampuan Akademik (TKA) Bahasa Indonesia',
  shortName: 'SIMANTIK',
  description:
    'Platform pembelajaran adaptif dan asesmen mandiri Tes Kemampuan Akademik (TKA) Bahasa Indonesia untuk siswa SMA/SMK se-Indonesia. Disusun oleh tim ahli Universitas Negeri Padang (UNP).',
  url: appUrl,
  locale: 'id_ID',
  keywords: [
    'tka bahasa indonesia',
    'tes kemampuan akademik',
    'simulasi tka',
    'tryout tka bahasa indonesia',
    'soal tka bahasa indonesia sma',
    'latihan membaca kritis',
    'asesmen adaptif',
    'literasi membaca',
    'pemahaman wacana',
    'snbt bahasa indonesia',
    'utbk tka',
    'kurikulum merdeka',
    'simantik',
    'simantik unp',
    'simantik educourse',
    'universitas negeri padang',
    'pwa edukasi',
  ],
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: '%s | SIMANTIK',
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: 'Tim Ahli Universitas Negeri Padang (UNP)', url: 'https://unp.ac.id' }],
  creator: 'Universitas Negeri Padang (UNP)',
  publisher: 'SIMANTIK',
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/favicon/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon/favicon.svg',
        color: '#134653',
      },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    alternateLocale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.shortName,
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'SIMANTIK - Platform Asesmen Mandiri TKA Bahasa Indonesia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/images/logo.png'],
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'simantik-google-search-verification',
  },
  other: {
    'google-site-verification':
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'simantik-google-search-verification',
    'msapplication-TileColor': '#134653',
    'theme-color': '#134653',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  appleWebApp: {
    title: siteConfig.shortName,
    statusBarStyle: 'black-translucent',
    capable: true,
  },
};
