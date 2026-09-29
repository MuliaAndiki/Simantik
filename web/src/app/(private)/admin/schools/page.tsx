import React from 'react';
import RoleGuard from '@/app/(private)/_shared/RoleGuard';
import { SchoolListContainer } from './_container/SchoolListContainer';

export default function AdminSchoolsPage() {
  return (
    <RoleGuard allowed={['admin']}>
      <SchoolListContainer />
    </RoleGuard>
  );
}
