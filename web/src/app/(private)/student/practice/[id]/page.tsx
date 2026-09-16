import StudentPracticeDetail from './_container/StudentPracticeDetail';

interface PracticeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PracticeDetailPage({ params }: PracticeDetailPageProps) {
  const { id } = await params;
  return <StudentPracticeDetail packageId={id} />;
}
