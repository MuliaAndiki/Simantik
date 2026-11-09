import type { Metadata } from 'next';
import HomeContainer from './_containers/HomeContainer';

export const metadata: Metadata = {
  title: 'Simulasi Mandiri Tes Kemampuan Akademik (TKA) Bahasa Indonesia',
  description:
    'Latihan membaca wacana, tryout adaptif, analisis kelemahan, dan rekomendasi remedial materi TKA Bahasa Indonesia SMA/SMK bersama tim ahli UNP.',
};

export default function Home() {
  return <HomeContainer />;
}
