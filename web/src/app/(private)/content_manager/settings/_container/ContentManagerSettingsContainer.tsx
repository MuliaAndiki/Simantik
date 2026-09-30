'use client';

import { FileCheck2, Lock, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  ContributionPanel,
  type PasswordFormState,
  ProfileSettingsPanel,
  SecuritySettingsPanel,
  SettingsShell,
} from '@/components/organisms/settings';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import { countByStatus } from '@/utils/list-summary.util';
import { EMPTY_PASSWORD_FORM, validateChangePassword } from '@/utils/password.util';

type ContentManagerSettingsTab = 'profile' | 'security' | 'contribution';

export default function ContentManagerSettingsContainer() {
  const api = useApi();
  const ns = useAppNameSpace();
  const { data: user } = api.user.query.me();
  const { data: materialsData } = api.learning.query.materials({ limit: 100 });
  const { data: questionsData } = api.question.query.list({ limit: 100 });
  const { data: tryoutsData } = api.tryout.query.list({ limit: 100 });

  const updateProfileMutation = api.user.mutate.updateProfile();
  const changePasswordMutation = api.user.mutate.changePassword();

  const [activeTab, setActiveTab] = useState<ContentManagerSettingsTab>('profile');
  const [fullName, setFullName] = useState('Content Manager SIMANTIK');
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(EMPTY_PASSWORD_FORM);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName);
  }, [user]);

  const email = user?.email || 'content@simantik.id';

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (fullName.trim() !== '') {
        await updateProfileMutation.mutateAsync({ fullName: fullName.trim() });
      }
      ns.alert.toast({
        title: 'Profil Diperbarui',
        message: 'Perubahan data profil kurator berhasil disimpan.',
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

  const materialCounts = countByStatus(materialsData?.materials ?? [], (m) => m.status);
  const questionCounts = countByStatus(questionsData?.questions ?? [], (q) => q.status, ['active']);
  const tryoutCounts = countByStatus(tryoutsData?.tryouts ?? [], (t) => t.status);

  return (
    <div className="w-full max-w-full mx-auto space-y-6 pb-12">
      <SettingsShell
        kicker="Ruang Kerja Kurator"
        title="Pengaturan Kurator & Kontribusi"
        description="Kelola profil kurator, keamanan akun, dan pantau kontribusi bank soal SIMANTIK."
        roleBadge="Role: Content Manager"
        tabs={[
          { id: 'profile', label: 'Profil Kurator', icon: User },
          { id: 'security', label: 'Keamanan & Sandi', icon: Lock },
          { id: 'contribution', label: 'Kontribusi Saya', icon: FileCheck2 },
        ]}
        activeTab={activeTab}
        onActiveTabChange={(tab) => setActiveTab(tab as ContentManagerSettingsTab)}
      >
        {activeTab === 'profile' && (
          <ProfileSettingsPanel
            title="Informasi Akun Kurator"
            description="Nama ini tampil sebagai kurator pada materi dan paket soal yang Anda kelola."
            fullName={fullName}
            email={email}
            isSaving={updateProfileMutation.isPending}
            onFullNameChange={setFullName}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {activeTab === 'security' && (
          <SecuritySettingsPanel
            form={passwordForm}
            error={passwordError}
            isSubmitting={changePasswordMutation.isPending}
            onFieldChange={handlePasswordFieldChange}
            onSubmitPassword={handleSubmitPassword}
          />
        )}

        {activeTab === 'contribution' && (
          <ContributionPanel
            title="Ringkasan Kontribusi Kurasi"
            description="Total materi, soal, dan tryout yang tersedia di platform beserta status publikasinya."
            items={[
              {
                label: 'Materi',
                value: materialCounts.total,
                subtext: `${materialCounts.published} published • ${materialCounts.draft} draft`,
              },
              {
                label: 'Bank Soal',
                value: questionCounts.total,
                subtext: `${questionCounts.published} aktif • ${questionCounts.draft} draft`,
              },
              {
                label: 'Paket Tryout',
                value: tryoutCounts.total,
                subtext: `${tryoutCounts.published} published • ${tryoutCounts.draft} draft`,
              },
            ]}
          />
        )}
      </SettingsShell>
    </div>
  );
}
