import { ComingSoonPage } from '@/components/page';
import { buildPageMetadata } from '@/utils/seo-metadata.util';

export const metadata = buildPageMetadata({
  title: 'Segera Hadir',
  description:
    'Sistem simulasi ujian dan tryout adaptif modern berbasis Item Response Theory (IRT) oleh SIMANTIK Universitas Negeri Padang (UNP).',
  canonicalPath: '/coming-soon',
  robots: { index: false, follow: false },
});

export default function Page() {
  return <ComingSoonPage />;
}
