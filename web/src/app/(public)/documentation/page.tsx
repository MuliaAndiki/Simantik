import { buildPageMetadata } from '@/utils/seo-metadata.util';
import DocumentationContainer from './_containers/DocumentationContainer';

export const metadata = buildPageMetadata({
  title: 'Dokumentasi & Panduan Resmi',
  description:
    'Temukan panduan komprehensif, standar asesmen kompetensi, dan petunjuk operasional platform SIMANTIK.',
  canonicalPath: '/documentation',
});

export default function Documentation() {
  return <DocumentationContainer />;
}
