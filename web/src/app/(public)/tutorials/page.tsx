import { buildPageMetadata } from '@/utils/seo-metadata.util';
import TutorialsContainer from './_containers/TutorialsContainer';

export const metadata = buildPageMetadata({
  title: 'Video Tutorial & Panduan Fitur',
  description:
    'Pelajari cara menggunakan fitur SIMANTIK melalui tutorial video yang mudah diikuti untuk persiapan TKA Bahasa Indonesia SMA/SMK.',
  canonicalPath: '/tutorials',
});

export default function Tutorials() {
  return <TutorialsContainer />;
}
