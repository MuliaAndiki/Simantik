import StudentLearningDetailContainer from '../../[id]/_container/StudentLearningDetail';

interface MaterialDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MaterialDetailPage({ params }: MaterialDetailPageProps) {
  const { id } = await params;
  return <StudentLearningDetailContainer materialId={id} />;
}
