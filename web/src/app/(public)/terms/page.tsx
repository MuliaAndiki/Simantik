import { buildPageMetadata } from '@/utils/seo-metadata.util';
import TermsContainer from './_containers/TermsContainer';

export const metadata = buildPageMetadata({
  title: 'Syarat & Ketentuan',
  description:
    'Syarat dan Ketentuan penggunaan layanan, aturan tryout, sistem penilaian IRT, dan integritas akademik di platform SIMANTIK.',
  canonicalPath: '/terms',
});

export default function Page() {
  return <TermsContainer />;
}
