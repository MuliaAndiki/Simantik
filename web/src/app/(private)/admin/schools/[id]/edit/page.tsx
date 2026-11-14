import RoleGuard from '@/app/(private)/_shared/RoleGuard';
import { AdminSchoolFormContainer } from '../../_container/AdminSchoolFormContainer';

interface AdminSchoolEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminSchoolEditPage({ params }: AdminSchoolEditPageProps) {
  const { id } = await params;

  return (
    <RoleGuard allowed={['admin']}>
      <AdminSchoolFormContainer mode="edit" schoolId={id} />
    </RoleGuard>
  );
}
