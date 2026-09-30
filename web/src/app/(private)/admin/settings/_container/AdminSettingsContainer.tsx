'use client';

import React, { useEffect, useState } from 'react';
import type { AdminSettingsTab } from '@/components/organisms/admin';
import type { PasswordFormState } from '@/components/organisms/settings';
import { AdminSettingsPage } from '@/components/page/private/admin/AdminSettingsPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import { EMPTY_PASSWORD_FORM, validateChangePassword } from '@/utils/password.util';

export default function AdminSettingsContainer() {
  const api = useApi();
  const ns = useAppNameSpace();
  const { data: user } = api.auth.query.me();
  const { data: dashboardData } = api.admin.query.dashboard();

  const updateProfileMutation = api.user.mutate.updateProfile();
  const changePasswordMutation = api.user.mutate.changePassword();

  const [activeTab, setActiveTab] = useState<AdminSettingsTab>('profile');
  const [fullName, setFullName] = useState('Administrator');
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(EMPTY_PASSWORD_FORM);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName);
  }, [user]);

  const email = user?.email || 'admin@simantik.id';

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (fullName.trim() !== '') {
        await updateProfileMutation.mutateAsync({ fullName: fullName.trim() });
      }
      ns.alert.toast({
        title: 'Profil Diperbarui',
        message: 'Perubahan data profil admin berhasil disimpan.',
        icon: 'success',
      });
    } catch (err: unknown) {
      ns.alert.toast({
        title: 'Gagal',
        message: err instanceof Error ? err.message : 'Gagal memperbarui profil.',
        icon: 'error',
      });
    }
  };

  const handlePasswordFieldChange = <K extends keyof PasswordFormState>(
    field: K,
    value: PasswordFormState[K]
  ) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    setPasswordError(null);
  };

  const handleSubmitPassword = async () => {
    const errMsg = validateChangePassword(passwordForm);
    if (errMsg) {
      setPasswordError(errMsg);
      return;
    }
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm(EMPTY_PASSWORD_FORM);
      ns.alert.toast({
        title: 'Kata Sandi Diperbarui',
        message: 'Kata sandi berhasil diganti.',
        icon: 'success',
      });
    } catch (err: unknown) {
      setPasswordError(
        err instanceof Error ? err.message : 'Gagal mengubah password. Periksa password saat ini.'
      );
    }
  };

  return (
    <AdminSettingsPage
      activeTab={activeTab}
      onActiveTabChange={setActiveTab}
      fullName={fullName}
      email={email}
      onFullNameChange={setFullName}
      onSaveProfile={handleSaveProfile}
      passwordForm={passwordForm}
      passwordError={passwordError}
      isSubmittingPassword={changePasswordMutation.isPending}
      onPasswordFieldChange={handlePasswordFieldChange}
      onSubmitPassword={handleSubmitPassword}
      isSavingProfile={updateProfileMutation.isPending}
      auditLogs={dashboardData?.recent_audit_logs}
    />
  );
}
