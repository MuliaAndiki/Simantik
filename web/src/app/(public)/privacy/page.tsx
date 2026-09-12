import type { Metadata } from 'next';
import PrivacyContainer from './_containers/PrivacyContainer';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | SIMANTIK - Platform Asesmen & Tryout SMA/SMK',
  description:
    'Kebijakan Privasi platform SIMANTIK mengenai pengumpulan, pengelolaan, penyimpanan, dan perlindungan data pengguna.',
};

export default function Page() {
  return <PrivacyContainer />;
}
