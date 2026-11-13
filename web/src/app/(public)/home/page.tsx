import { HomeFaqJsonLd } from '@/components/atoms/seo/JsonLd';
import { buildPageMetadata } from '@/utils/seo-metadata.util';
import HomeContainer from './_containers/HomeContainer';

export const metadata = buildPageMetadata({
  title: 'Simulasi Mandiri Tes Kemampuan Akademik (TKA) Bahasa Indonesia',
  description:
    'Latihan membaca wacana, tryout adaptif, analisis kelemahan, dan rekomendasi remedial materi TKA Bahasa Indonesia SMA/SMK gratis bersama tim ahli UNP.',
  canonicalPath: '/home',
});

export default function Home() {
  return (
    <>
      <HomeFaqJsonLd />
      <HomeContainer />
    </>
  );
}
