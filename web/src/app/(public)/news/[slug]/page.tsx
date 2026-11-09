import PublicNewsDetailContainer from './_containers/PublicNewsDetailContainer';

export interface PublicNewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PublicNewsDetailPageProps) {
  const { slug } = await params;
  const formattedTitle = decodeURIComponent(slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${formattedTitle} | Berita SIMANTIK`,
    description: 'Wawasan dan pengumuman resmi dari platform SIMANTIK.',
  };
}

export default async function PublicNewsDetailPage({ params }: PublicNewsDetailPageProps) {
  const { slug } = await params;
  return <PublicNewsDetailContainer slug={slug} />;
}
