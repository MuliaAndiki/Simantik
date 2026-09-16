import StudentLearningDetailContainer from '../../_container/StudentLearningDetail';

interface LearningMaterialDetailPageProps {
  params: Promise<{ id: string; materialId: string }>;
}

export default async function LearningMaterialDetailPage({
  params,
}: LearningMaterialDetailPageProps) {
  const { id: moduleId, materialId } = await params;
  return <StudentLearningDetailContainer moduleId={moduleId} materialId={materialId} />;
}
