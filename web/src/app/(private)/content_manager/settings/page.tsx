import React from 'react';
import RoleGuard from '@/app/(private)/_shared/RoleGuard';
import ContentManagerSettingsContainer from './_container/ContentManagerSettingsContainer';

export default function ContentManagerSettingsPage() {
  return (
    <RoleGuard allowed={['content_manager']}>
      <ContentManagerSettingsContainer />
    </RoleGuard>
  );
}
