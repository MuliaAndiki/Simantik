import React from 'react';
import RoleGuard from '@/app/(private)/_shared/RoleGuard';
import { StudentListContainer } from './_container/StudentListContainer';

export default function AdminStudentsPage() {
  return (
    <RoleGuard allowed={['admin']}>
      <StudentListContainer />
    </RoleGuard>
  );
}
