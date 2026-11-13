import { HomeFaqJsonLd } from '@/components/atoms/seo/JsonLd';
import { buildPageMetadata } from '@/utils/seo-metadata.util';
import HomeContainer from './home/_containers/HomeContainer';

export const metadata = buildPageMetadata({
  title: 'Simulasi Mandiri Tes Kemampuan Akademik (TKA) Bahasa Indonesia',
  description:
    'Platform pembelajaran adaptif dan asesmen mandiri TKA Bahasa Indonesia SMA/SMK se-Indonesia. Latihan wacana membaca, tryout adaptif, analisis diagnostik, dan materi remedial gratis bersama tim ahli UNP.',
  canonicalPath: '/home',
});

export default function RootPublicPage() {
  return (
    <>
      <HomeFaqJsonLd />
      <HomeContainer />
    </>
  );
}
