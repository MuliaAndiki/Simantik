import React from 'react';
import RoleGuard from '@/app/(private)/_shared/RoleGuard';
import { ContentManagerListContainer } from './_container/ContentManagerListContainer';

export default function AdminContentManagersPage() {
  return (
    <RoleGuard allowed={['admin']}>
      <ContentManagerListContainer />
    </RoleGuard>
  );
}
