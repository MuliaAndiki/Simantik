import { buildPageMetadata } from '@/utils/seo-metadata.util';
import TestimonialsContainer from './_containers/TestimonialsContainer';

export const metadata = buildPageMetadata({
  title: 'Testimoni Siswa & Guru',
  description:
    'Lihat pengalaman siswa SMA/SMK dan guru di seluruh Indonesia setelah menggunakan sistem belajar dan simulasi tryout adaptif SIMANTIK.',
  canonicalPath: '/testimonials',
});

export default function Testimonials() {
  return <TestimonialsContainer />;
}
