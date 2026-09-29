import React from 'react';
import RoleGuard from '@/app/(private)/_shared/RoleGuard';
import AdminSettingsContainer from './_container/AdminSettingsContainer';

export default function Page() {
  return (
    <RoleGuard allowed={['admin']}>
      <AdminSettingsContainer />
    </RoleGuard>
  );
}
