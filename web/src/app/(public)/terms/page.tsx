import type { Metadata } from 'next';
import TermsContainer from './_containers/TermsContainer';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | SIMANTIK - Platform Asesmen & Tryout SMA/SMK',
  description:
    'Syarat dan Ketentuan penggunaan layanan, aturan tryout, sistem penilaian IRT, dan integritas akademik di platform SIMANTIK.',
};

export default function Page() {
  return <TermsContainer />;
}
