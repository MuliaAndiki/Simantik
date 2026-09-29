import RoleGuard from '@/app/(private)/_shared/RoleGuard';
import DetailStudentDetailContainer from '../_container/[id]/_container/DetailStudent';

interface DetailStudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailStudentDetailPage({ params }: DetailStudentDetailPageProps) {
  const { id } = await params;
  return (
    <RoleGuard allowed={['admin']}>
      <DetailStudentDetailContainer id={id} />
    </RoleGuard>
  );
}
