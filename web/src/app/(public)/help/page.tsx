import type { Metadata } from 'next';
import HelpContainer from './_containers/HelpContainer';

export const metadata: Metadata = {
  title: 'Pusat Bantuan & FAQ | SIMANTIK - Platform Asesmen & Tryout SMA/SMK',
  description:
    'Pusat bantuan resmi SIMANTIK. Temukan panduan pendaftaran akun, modul materi TKA Bahasa Indonesia, aturan waktu ujian tryout, dan solusi kendala teknis.',
};

export default function Page() {
  return <HelpContainer />;
}
