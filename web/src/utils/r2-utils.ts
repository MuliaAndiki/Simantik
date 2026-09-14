'use server';

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { env } from '@/configs';

const bucketName = 'simantik';
const avatarsPrefix = 'avatars';
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_URL || '';

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

  const fileExtension = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
  const folderPath = folder.endsWith('/') ? folder : `${folder}/`;
  const Key = `${folderPath}${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadParams = {
    Bucket: bucketName,
    Key,
    Body: buffer,
    ContentType: file.type || 'image/jpeg',
  };

  const client = getR2Client();
  await client.send(new PutObjectCommand(uploadParams));

  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL}/${Key}`;
  }

  const accountId = env.NEXT_CLOUDFLARE_ACCOUNT_ID || process.env.NEXT_CLOUDFLARE_ACCOUNT_ID || '';
  return `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${Key}`;
}

export async function deleteObject(fileUrl: string): Promise<void> {
  try {
    const url = new URL(fileUrl);
    let Key = url.pathname.substring(1);

    if (Key.startsWith(`${bucketName}/`)) {
      Key = Key.substring(`${bucketName}/`.length);
    }

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
