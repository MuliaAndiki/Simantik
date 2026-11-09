import DocDetailContainer from './_containers/DocDetailContainer';

export interface DocumentationDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DocumentationDetailPageProps) {
  const { slug } = await params;
  const formattedTitle = decodeURIComponent(slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${formattedTitle} | Dokumentasi SIMANTIK`,
    description: 'Panduan resmi dan rujukan operasional platform SIMANTIK.',
  };
}

export default async function DocumentationDetailPage({ params }: DocumentationDetailPageProps) {
  const { slug } = await params;
  return <DocDetailContainer slug={slug} />;
}
