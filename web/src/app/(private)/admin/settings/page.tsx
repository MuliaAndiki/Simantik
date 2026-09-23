'use client';

import React, { useState } from 'react';
import type { AdminSettingsTab } from '@/components/organisms/admin';
import { AdminSettingsPage } from '@/components/page/private/admin/AdminSettingsPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';

export default function Page() {
  const api = useApi();
  const ns = useAppNameSpace();
  const { data: user } = api.auth.query.me();

  const [activeTab, setActiveTab] = useState<AdminSettingsTab>('profile');
  const [fullName, setFullName] = useState(user?.fullName || 'Administrator');
  const email = user?.email || 'admin@simantik.id';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    ns.alert.toast({
      title: 'Profil Diperbarui',
      message: 'Perubahan data profil admin berhasil disimpan.',
      icon: 'success',
    });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    ns.alert.toast({
      title: 'Kata Sandi Diperbarui',
      message: 'Kata sandi berhasil diganti.',
      icon: 'success',
    });
  };

  return (
    <AdminSettingsPage
      activeTab={activeTab}
      onActiveTabChange={setActiveTab}
      fullName={fullName}
      email={email}
      onFullNameChange={setFullName}
      onSaveProfile={handleSaveProfile}
      onSavePassword={handleSavePassword}
    />
  );
}
