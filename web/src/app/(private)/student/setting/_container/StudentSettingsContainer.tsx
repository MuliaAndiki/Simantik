'use client';

import { AlertCircle, Bell, GraduationCap, Lock, PlusCircle, User } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  type PasswordFormState,
  PreferencePanel,
  ProfileSettingsPanel,
  SecuritySettingsPanel,
  SettingsShell,
} from '@/components/organisms/settings';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import { useLanguage } from '@/hooks/useLanguage';
import { EMPTY_PASSWORD_FORM, validateChangePassword } from '@/utils/password.util';
import { buildProposeSchoolHref } from '@/utils/school-picker.util';

type StudentSettingsTab = 'profile' | 'security' | 'preferences';

const PREF_RESULT_EMAIL = 'simantik_pref_result_email';
const PREF_REMINDER = 'simantik_pref_reminder';

function readPref(key: string, fallback: boolean): boolean {
  if (typeof window === 'undefined') return fallback;
  const saved = window.localStorage.getItem(key);
  return saved === null ? fallback : saved === '1';
}

export default function StudentSettingsContainer() {
  const api = useApi();
  const ns = useAppNameSpace();
  const { data: user } = api.user.query.me();
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  const updateProfileMutation = api.user.mutate.updateProfile();
  const changePasswordMutation = api.user.mutate.changePassword();

  const [activeTab, setActiveTab] = useState<StudentSettingsTab>('profile');
  const [fullName, setFullName] = useState('');
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(EMPTY_PASSWORD_FORM);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [resultEmailPref, setResultEmailPref] = useState(true);
  const [reminderPref, setReminderPref] = useState(false);

  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName);
  }, [user]);

  useEffect(() => {
    setResultEmailPref(readPref(PREF_RESULT_EMAIL, true));
    setReminderPref(readPref(PREF_REMINDER, false));
  }, []);

  const email = user?.email || '';
  const hasSchool = Boolean(user?.studentProfile?.schoolId || user?.studentProfile?.school);
  const schoolName = user?.studentProfile?.school || 'Belum memilih sekolah';
  const proposeSchoolHref = buildProposeSchoolHref({ returnTo: '/student/setting' });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (fullName.trim() !== '') {
        await updateProfileMutation.mutateAsync({ fullName: fullName.trim() });
      }
      ns.alert.toast({
        title: 'Profil Diperbarui',
        message: 'Perubahan data profil berhasil disimpan.',
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

  const handleTogglePref = (id: string, checked: boolean) => {
    if (typeof window === 'undefined') return;
    if (id === 'result-email') {
      setResultEmailPref(checked);
      window.localStorage.setItem(PREF_RESULT_EMAIL, checked ? '1' : '0');
    } else if (id === 'reminder') {
      setReminderPref(checked);
      window.localStorage.setItem(PREF_REMINDER, checked ? '1' : '0');
    }
  };

  return (
    <div className="w-full max-w-full mx-auto space-y-6 pb-12">
      <SettingsShell
        kicker="Akun Saya"
        title="Pengaturan Siswa"
        description="Kelola profil, keamanan akun, dan preferensi belajar Anda."
        roleBadge="Role: Siswa"
        tabs={[
          { id: 'profile', label: 'Profil Siswa', icon: User },
          { id: 'security', label: 'Keamanan & Sandi', icon: Lock },
          { id: 'preferences', label: 'Preferensi', icon: Bell },
        ]}
        activeTab={activeTab}
        onActiveTabChange={(tab) => setActiveTab(tab as StudentSettingsTab)}
      >
        {activeTab === 'profile' && (
          <ProfileSettingsPanel
            title="Informasi Akun Siswa"
            description="Nama tampil pada papan peringkat dan sertifikat hasil tryout."
            fullName={fullName}
            email={email}
            isSaving={updateProfileMutation.isPending}
            onFullNameChange={setFullName}
            onSaveProfile={handleSaveProfile}
            extraRows={
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-700">Sekolah</label>
                  {!hasSchool && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      <AlertCircle className="size-3" />
                      Belum dipilih
                    </span>
                  )}
                </div>
                <div className="min-h-10 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 flex items-center justify-between gap-2 px-3 py-2">
                  <span className={!hasSchool ? 'text-slate-500' : 'text-slate-800'}>
                    {schoolName}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <Link
                    href="/student/profile"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <GraduationCap className="size-3.5 text-teal-600" />
                    {hasSchool ? 'Ubah Sekolah di Profil' : 'Pilih Sekolah di Profil'}
                  </Link>
                  <Link
                    href={proposeSchoolHref}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50/70 hover:bg-teal-100/70 px-3 py-1.5 text-xs font-semibold text-teal-800 transition-colors"
                  >
                    <PlusCircle className="size-3.5 text-teal-700" />
                    Ajukan Sekolah Baru
                  </Link>
                </div>
              </div>
            }
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

        {activeTab === 'preferences' && (
          <PreferencePanel
            title="Preferensi Belajar"
            description="Pengaturan ini tersimpan di browser Anda."
            toggles={[
              {
                id: 'result-email',
                label: 'Email Hasil Tryout',
                description: 'Terima ringkasan nilai setiap selesai mengerjakan tryout.',
                checked: resultEmailPref,
              },
              {
                id: 'reminder',
                label: 'Pengingat Belajar',
                description: 'Tampilkan pengingat latihan harian di perangkat ini.',
                checked: reminderPref,
              },
            ]}
            onToggle={handleTogglePref}
            languages={[...languages]}
            currentLanguage={currentLanguage}
            onLanguageChange={changeLanguage}
          />
        )}
      </SettingsShell>
    </div>
  );
}
