import TutorialDetailContainer from '@/app/(private)/content_manager/tutorials/[id]/_container/TutorialDetailContainer';

interface DetailTutorialPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailTutorialPage({ params }: DetailTutorialPageProps) {
  const { id } = await params;
  return <TutorialDetailContainer id={id} />;
}
