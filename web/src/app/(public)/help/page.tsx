import { buildPageMetadata } from '@/utils/seo-metadata.util';
import HelpContainer from './_containers/HelpContainer';

export const metadata = buildPageMetadata({
  title: 'Pusat Bantuan & FAQ',
  description:
    'Pusat bantuan resmi SIMANTIK. Temukan panduan pendaftaran akun, modul materi TKA Bahasa Indonesia, aturan waktu ujian tryout, dan solusi kendala teknis.',
  canonicalPath: '/help',
});

export default function Page() {
  return <HelpContainer />;
}
