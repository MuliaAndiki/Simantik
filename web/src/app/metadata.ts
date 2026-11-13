import type { Metadata } from 'next';
import {
  getSiteUrl,
  getVerificationTokens,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  SITE_SHORT_NAME,
} from '@/configs/site.config';
import { getDefaultOgImages, getDefaultTwitterImages } from '@/utils/seo-metadata-images';

const siteUrl = getSiteUrl();
const { google: googleVerification, bing: bingVerification } = getVerificationTokens();

const verificationOther: Record<string, string> = {};
if (bingVerification) {
  verificationOther['msvalidate.01'] = bingVerification;
}

export const siteConfig = {
  name: SITE_NAME,
  shortName: SITE_SHORT_NAME,
  description: SITE_DESCRIPTION,
  url: siteUrl,
  locale: SITE_LOCALE,
  keywords: SITE_KEYWORDS,
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
  publisher: SITE_SHORT_NAME,
  metadataBase: new URL(siteUrl),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon/favicon-32x32.png', type: 'image/png' }],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'manifest',
        url: '/favicon/site.webmanifest',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: SITE_LOCALE,
    siteName: SITE_SHORT_NAME,
    title: siteConfig.name,
    description: siteConfig.description,
    images: getDefaultOgImages(siteConfig.name),
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: getDefaultTwitterImages(),
  },
  ...(googleVerification || Object.keys(verificationOther).length > 0
    ? {
        verification: {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(Object.keys(verificationOther).length > 0 ? { other: verificationOther } : {}),
        },
      }
    : {}),
  other: {
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
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
