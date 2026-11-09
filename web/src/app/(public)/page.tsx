import type { Metadata } from 'next';
import HomeContainer from './home/_containers/HomeContainer';

export const metadata: Metadata = {
  title: 'Simulasi Mandiri Tes Kemampuan Akademik (TKA) Bahasa Indonesia',
  description:
    'Platform pembelajaran adaptif dan asesmen mandiri TKA Bahasa Indonesia SMA/SMK se-Indonesia. Latihan wacana membaca, tryout adaptif, analisis diagnostik, dan materi remedial gratis bersama tim ahli UNP.',
};

export default function RootPublicPage() {
  return <HomeContainer />;
}
