import { env } from '@/configs';

const defaultBucketName = 'simantik';

/**
 * Mendapatkan Base URL publik Cloudflare R2 (server-only, tanpa prefix NEXT_PUBLIC_)
 * dengan trailing slash yang sudah dibersihkan.
 */
export function getR2PublicBaseUrl(): string {
  const rawUrl =
    process.env.R2_URL !== undefined
      ? process.env.R2_URL
      : process.env.NEXT_CLOUDFLARE_R2_URL !== undefined
        ? process.env.NEXT_CLOUDFLARE_R2_URL
        : process.env.NEXT_PUBLIC_R2_URL !== undefined
          ? process.env.NEXT_PUBLIC_R2_URL
          : env.R2_URL || '';
  return rawUrl.trim().replace(/\/+$/, '');
}

/**
 * Mengekstrak S3 Key dari berbagai format URL (custom domain, dev domain, atau cloudflarestorage).
 */
export function extractR2KeyFromUrl(
  fileUrl: string,
  targetBucket: string = defaultBucketName
): string {
  const url = new URL(fileUrl);
  let key = url.pathname.replace(/^\/+/, '');

  if (key.startsWith(`${targetBucket}/`)) {
    key = key.substring(`${targetBucket}/`.length);
  }

  return key;
}
