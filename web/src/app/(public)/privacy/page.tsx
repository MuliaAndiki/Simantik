import { buildPageMetadata } from '@/utils/seo-metadata.util';
import PrivacyContainer from './_containers/PrivacyContainer';

export const metadata = buildPageMetadata({
  title: 'Kebijakan Privasi',
  description:
    'Kebijakan Privasi platform SIMANTIK mengenai pengumpulan, pengelolaan, penyimpanan, dan perlindungan data pengguna.',
  canonicalPath: '/privacy',
});

export default function Page() {
  return <PrivacyContainer />;
}
