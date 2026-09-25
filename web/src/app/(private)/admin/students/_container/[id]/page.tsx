import DetailStudentDetailContainer from './_container/DetailStudent';

interface DetailStudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailStudentDetailPage({ params }: DetailStudentDetailPageProps) {
  const { id } = await params;
  return <DetailStudentDetailContainer id={id} />;
}
