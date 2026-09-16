import StudentTryoutDetail from './_container/StudentTryoutDetail';

interface TryoutDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TryoutDetailPage({ params }: TryoutDetailPageProps) {
  const { id } = await params;
  return <StudentTryoutDetail tryoutId={id} />;
}
