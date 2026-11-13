function readEnvValue(key: string): string | undefined {
  const envRecord: Record<string, string | undefined> = process.env;
  return envRecord[key];
}

/**
 * Resolves the canonical public origin at runtime (avoiding build-time hardcoding where possible).
 */
export function getSiteUrl(): string {
  const raw =
    readEnvValue('SITE_URL') || readEnvValue('NEXT_PUBLIC_APP_URL') || 'https://simantik.id';
  return raw.trim().replace(/\/+$/, '');
}

export function getVerificationTokens(): { google?: string; bing?: string } {
  return {
    google: readEnvValue('NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION')?.trim() || undefined,
    bing: readEnvValue('NEXT_PUBLIC_BING_SITE_VERIFICATION')?.trim() || undefined,
  };
}

export const SITE_URL = getSiteUrl();

export const SITE_NAME =
  'SIMANTIK | Simulasi Mandiri Tes Kemampuan Akademik (TKA) Bahasa Indonesia';
export const SITE_SHORT_NAME = 'SIMANTIK';
export const SITE_TAGLINE = 'Simulasi Mandiri TKA Bahasa Indonesia';
export const SITE_SUBTITLE = 'Latihan wacana, tryout adaptif & remedial gratis untuk SMA/SMK';
export const SITE_BADGE = 'Universitas Negeri Padang';
export const SITE_DESCRIPTION =
  'Platform pembelajaran adaptif dan asesmen mandiri Tes Kemampuan Akademik (TKA) Bahasa Indonesia untuk siswa SMA/SMK se-Indonesia. Disusun oleh tim ahli Universitas Negeri Padang (UNP).';
export const SITE_LOCALE = 'id_ID';
export const SUPPORT_EMAIL = 'bantuan@simantik.id';
export const DEFAULT_OG_IMAGE_PATH = '/images/og-default.png';
export const ORGANIZATION_LOGO_PATH = '/favicon/android-chrome-512x512.png';

export const SITE_KEYWORDS = [
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
  'universitas negeri padang',
  'pwa edukasi',
];
