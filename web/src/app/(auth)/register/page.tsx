import { buildPageMetadata } from '@/utils/seo-metadata.util';
import ContainerRegister from './_container/Register';

export const metadata = buildPageMetadata({
  title: 'Daftar Akun Siswa Gratis',
  description:
    'Buat akun SIMANTIK secara gratis untuk mengakses ribuan latihan wacana, tryout adaptif TKA Bahasa Indonesia, dan rekomendasi materi remedial personal.',
  canonicalPath: '/register',
  robots: { index: true, follow: true },
});

export default function Page() {
  return <ContainerRegister />;
}
