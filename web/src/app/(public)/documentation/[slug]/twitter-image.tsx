import { renderDocumentationSlugOgImage } from '@/components/atoms/seo/og-article';

export const alt = 'Dokumentasi & Panduan Resmi | SIMANTIK';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderDocumentationSlugOgImage(slug);
}
