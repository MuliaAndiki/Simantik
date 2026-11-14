import { Suspense } from 'react';
import RoleGuard from '@/app/(private)/_shared/RoleGuard';
import { AdminSchoolFormContainer } from '../_container/AdminSchoolFormContainer';

export default function AdminSchoolCreatePage() {
  return (
    <RoleGuard allowed={['admin']}>
      <Suspense
        fallback={
          <div className="flex min-h-[400px] w-full items-center justify-center text-sm text-slate-500 font-medium">
            Memuat formulir tambah sekolah...
          </div>
        }
      >
        <AdminSchoolFormContainer mode="create" />
      </Suspense>
    </RoleGuard>
  );
}
