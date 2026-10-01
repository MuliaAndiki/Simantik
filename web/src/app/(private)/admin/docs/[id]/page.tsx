import DocsDetailContainer from '@/app/(private)/content_manager/docs/[id]/_container/DocsDetailContainer';

interface DetailDocsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailDocsPage({ params }: DetailDocsPageProps) {
  const { id } = await params;
  return <DocsDetailContainer id={id} />;
}
