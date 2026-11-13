import { renderSimantikOgImage } from '@/components/atoms/seo/og-card';

export const alt = 'SIMANTIK – Simulasi Mandiri TKA Bahasa Indonesia';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return renderSimantikOgImage();
}
