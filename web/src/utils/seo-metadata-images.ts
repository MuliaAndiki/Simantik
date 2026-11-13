import { DEFAULT_OG_IMAGE_PATH } from '@/configs/site.config';

export function getDefaultOgImages(alt = 'SIMANTIK – Simulasi Mandiri TKA Bahasa Indonesia') {
  return [
    {
      url: DEFAULT_OG_IMAGE_PATH,
      width: 1200,
      height: 630,
      type: 'image/png',
      alt,
    },
  ];
}

export function getDefaultTwitterImages() {
  return [DEFAULT_OG_IMAGE_PATH];
}
