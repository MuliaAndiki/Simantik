import { buildPageMetadata } from '@/utils/seo-metadata.util';
import { PublicNewsContainer } from './_containers/PublicNewsContainer';

export const metadata = buildPageMetadata({
  title: 'Berita & Pengumuman Resmi',
  description:
    'Temukan wawasan kurikulum, rilis fitur platform, tips belajar terstruktur, dan berita resmi dari SIMANTIK.',
  canonicalPath: '/news',
});

export default function NewsPage() {
  return <PublicNewsContainer />;
}
