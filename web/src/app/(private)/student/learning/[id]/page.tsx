import StudentModuleDetailContainer from './_container/StudentModuleDetail';

interface LearningModuleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LearningModuleDetailPage({ params }: LearningModuleDetailPageProps) {
  const { id } = await params;
  return <StudentModuleDetailContainer moduleId={id} />;
}
