import { buildPageMetadata } from '@/utils/seo-metadata.util';
import ContainerLogin from './_container/Login';

export const metadata = buildPageMetadata({
  title: 'Masuk Akun',
  description:
    'Masuk ke akun SIMANTIK Anda untuk mengakses latihan wacana membaca kritis, tryout adaptif, dan analisis hasil asesmen TKA Bahasa Indonesia.',
  canonicalPath: '/login',
  robots: { index: true, follow: true },
});

export default function Page() {
  return <ContainerLogin />;
}
