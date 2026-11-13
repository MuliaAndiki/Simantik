'use server';

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { env } from '@/configs';
import { extractR2KeyFromUrl, getR2PublicBaseUrl } from './r2-url.util';

// Konversi WebP hemat storage: kualitas 82 + sisi terpanjang max 1600px.
const WEBP_QUALITY = 82;
const WEBP_MAX_DIMENSION = 1600;

const bucketName = 'simantik';
const avatarsPrefix = 'avatars';

let r2ClientInstance: S3Client | null = null;

function getR2Client(): S3Client {
  if (!r2ClientInstance) {
    const accountId =
      env.NEXT_CLOUDFLARE_ACCOUNT_ID || process.env.NEXT_CLOUDFLARE_ACCOUNT_ID || '';
    r2ClientInstance = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.NEXT_ACCESS_KEY_ID,
        secretAccessKey: env.NEXT_SECRET_ACCESS_KEY,
      },
    });
  }
  return r2ClientInstance;
}

export async function uploadAvatar(
  fileOrFormData: File | FormData,
  folder: string = avatarsPrefix
): Promise<string> {
  let file: File;

  if (typeof FormData !== 'undefined' && fileOrFormData instanceof FormData) {
    const formFile = fileOrFormData.get('file');
    if (!formFile || !(formFile instanceof File)) {
      throw new Error('File tidak ditemukan dalam FormData.');
    }
    file = formFile;
  } else if (fileOrFormData && typeof (fileOrFormData as File).arrayBuffer === 'function') {
    file = fileOrFormData as File;
  } else {
    throw new Error('Format file tidak valid.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  // Semua gambar (kecuali webp/svg) dikonversi ke WebP sebelum naik ke R2.
  // Gagal convert (format aneh) -> file asli tetap diupload.
  let body: Buffer = inputBuffer;
  let contentType = file.type || 'image/jpeg';
  let fileExtension = file.name.split('.').pop() || 'jpg';
  const converted = await toWebpBuffer(inputBuffer, file.type);
  if (converted) {
    body = converted;
    contentType = 'image/webp';
    fileExtension = 'webp';
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
  const folderPath = folder.endsWith('/') ? folder : `${folder}/`;
  const Key = `${folderPath}${fileName}`;

  const uploadParams = {
    Bucket: bucketName,
    Key,
    Body: body,
    ContentType: contentType,
  };

  const client = getR2Client();
  await client.send(new PutObjectCommand(uploadParams));

  const publicBaseUrl = getR2PublicBaseUrl();
  if (publicBaseUrl) {
    return `${publicBaseUrl}/${Key}`;
  }

  const accountId = env.NEXT_CLOUDFLARE_ACCOUNT_ID || process.env.NEXT_CLOUDFLARE_ACCOUNT_ID || '';
  return `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${Key}`;
}

/**
 * Konversi buffer gambar ke WebP. Kembalikan null bila tidak perlu
 * (sudah webp/svg/bukan gambar) atau convert gagal.
 */
async function toWebpBuffer(input: Buffer, mimeType: string): Promise<Buffer | null> {
  if (mimeType === 'image/webp' || mimeType === 'image/svg+xml') return null;
  if (mimeType && !mimeType.startsWith('image/')) return null;
  try {
    const mod = await import('sharp');
    const sharp = mod.default ?? (mod as unknown as typeof import('sharp')['default']);
    return await sharp(input, { animated: false })
      .rotate()
      .resize({
        width: WEBP_MAX_DIMENSION,
        height: WEBP_MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
  } catch {
    return null;
  }
}

export async function deleteObject(fileUrl: string): Promise<void> {
  try {
    const Key = extractR2KeyFromUrl(fileUrl, bucketName);

    const deleteParams = {
      Bucket: bucketName,
      Key,
    };

    const client = getR2Client();
    await client.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    console.error('Failed to delete file from R2:', error);
    throw new Error('Gagal menghapus file');
  }
}
