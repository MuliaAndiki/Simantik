'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { ChangePasswordForm } from '@/components/organisms/student/ChangePasswordModal';
import type { ProfileSchoolOption } from '@/components/organisms/student/ProfilePersonalInfoCard';
import { StudentProfilePage } from '@/components/page/private/student/StudentProfilePage';
import { useApi } from '@/hooks/useApi';
import { useAlert } from '@/hooks/useService/useAlert/costum-alert';
import { uploadAvatar } from '@/utils/r2-utils';

const DEFAULT_NAME = 'Administrator SIMANTIK';
const DEFAULT_EMAIL = 'admin@simantik.id';
const DEFAULT_ORGANIZATION = 'SIMANTIK Admin Workspace';
const DEFAULT_AVATAR = '/avatars/1.png';

const EMPTY_CHANGE_PASSWORD_FORM: ChangePasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function AdminProfileContainer() {
  const { user, school } = useApi();
  const { toast } = useAlert();

  // 1. Data queries
  const { data: userProfile } = user.query.me();
  const { data: schoolsResponse } = school.query.listPublic({ limit: 100 });

  // 2. Mutations
  const updateProfileMutation = user.mutate.updateProfile();
  const updateMySchoolMutation = user.mutate.updateMySchool();
  const changePasswordMutation = user.mutate.changePassword();
  const updateAvatarMutation = user.mutate.updateAvatar();

  // 3. Form state
  const [fullName, setFullName] = useState(DEFAULT_NAME);
  const [schoolName, setSchoolName] = useState(DEFAULT_ORGANIZATION);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [isDirty, setIsDirty] = useState(false);

  // 4. Modal states
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // 5. Change password form state
  const [changePasswordForm, setChangePasswordForm] = useState<ChangePasswordForm>(
    EMPTY_CHANGE_PASSWORD_FORM
  );
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);

  // Synchronize initial data once fetched
  useEffect(() => {
    if (userProfile) {
      if (userProfile.fullName) {
        setFullName(userProfile.fullName);
      }
      if (userProfile.studentProfile?.school) {
        setSchoolName(userProfile.studentProfile.school);
      }
    }
  }, [userProfile]);

  const schoolOptions: ProfileSchoolOption[] = useMemo(() => {
    return (schoolsResponse?.schools ?? []).map((s) => ({
      id: s.id,
      name: s.nama,
    }));
  }, [schoolsResponse]);

  const handleFullNameChange = (val: string) => {
    setFullName(val);
    setIsDirty(true);
  };

  const handleSchoolNameChange = (val: string) => {
    setSchoolName(val);
    setIsDirty(true);
  };

  const handleSelectSchoolId = (id: string) => {
    setSelectedSchoolId(id);
    const found = schoolOptions.find((s) => s.id === id);
    if (found) {
      setSchoolName(found.name);
    }
    setIsDirty(true);
  };

  const handleResetPersonalInfo = () => {
    setFullName(userProfile?.fullName ?? DEFAULT_NAME);
    setSchoolName(userProfile?.studentProfile?.school ?? DEFAULT_ORGANIZATION);
    setSelectedSchoolId('');
    setIsDirty(false);
  };

  const handleSubmitPersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (fullName.trim() !== '') {
        await updateProfileMutation.mutateAsync({ fullName: fullName.trim() });
      }

      if (selectedSchoolId) {
        await updateMySchoolMutation.mutateAsync({ schoolId: selectedSchoolId });
      }

      setIsDirty(false);
      toast({
        title: 'Berhasil',
        message: 'Informasi profil administrator berhasil disimpan.',
        icon: 'success',
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal memperbarui profil. Silakan coba lagi.';
      toast({
        title: 'Gagal',
        message: errorMessage,
        icon: 'error',
      });
    }
  };

  const handleOpenChangePassword = (open: boolean) => {
    if (open) {
      setChangePasswordForm(EMPTY_CHANGE_PASSWORD_FORM);
      setChangePasswordError(null);
    }
    setIsChangePasswordOpen(open);
  };

  const handleChangePasswordFormChange = <K extends keyof ChangePasswordForm>(
    field: K,
    value: ChangePasswordForm[K]
  ) => {
    setChangePasswordForm((prev) => ({ ...prev, [field]: value }));
    setChangePasswordError(null);
  };

  const handleSubmitChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = changePasswordForm;

    if (!currentPassword) {
      setChangePasswordError('Password saat ini harus diisi.');
      return;
    }
    if (newPassword.length < 8) {
      setChangePasswordError('Password baru minimal harus 8 karakter.');
      return;
    }
    if (!(/[a-zA-Z]/.test(newPassword) && /\d/.test(newPassword))) {
      setChangePasswordError('Password baru harus mengandung kombinasi huruf dan angka.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePasswordError('Konfirmasi password tidak cocok dengan password baru.');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });

      setIsChangePasswordOpen(false);
      toast({
        title: 'Berhasil',
        message: 'Kata sandi administrator berhasil diperbarui.',
        icon: 'success',
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal mengubah password. Periksa password saat ini.';
      toast({
        title: 'Gagal',
        message: errorMessage,
        icon: 'error',
      });
    }
  };

  const handleOpenChangeAvatar = (open: boolean) => {
    setIsChangeAvatarOpen(open);
  };

  const handleSubmitChangeAvatar = async (avatar: string | File) => {
    try {
      setIsUploadingAvatar(true);
      let finalUrl: string;

      if (avatar instanceof File) {
        // Upload ke Cloudflare R2 Storage lewat server action
        const formData = new FormData();
        formData.append('file', avatar);
        finalUrl = await uploadAvatar(formData);
      } else if (typeof avatar === 'string') {
        if (avatar.startsWith('/') && typeof window !== 'undefined') {
          finalUrl = `${window.location.origin}${avatar}`;
        } else {
          finalUrl = avatar;
        }
      } else {
        throw new Error('Format foto tidak valid.');
      }

      // Simpan URL avatar ke database
      await updateAvatarMutation.mutateAsync({ avatarURL: finalUrl });

      setIsChangeAvatarOpen(false);
      toast({
        title: 'Berhasil',
        message: 'Foto profil administrator berhasil diperbarui.',
        icon: 'success',
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal memperbarui foto profil.';
      toast({
        title: 'Gagal',
        message: errorMessage,
        icon: 'error',
      });
      throw err;
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const email = userProfile?.email ?? DEFAULT_EMAIL;
  const avatarSrc = userProfile?.avatarURL ?? DEFAULT_AVATAR;
  const roleName = 'Administrator';
  const statusText = userProfile?.status === 'active' ? 'Aktif' : 'Aktif';

  const isSubmittingPersonalInfo =
    updateProfileMutation.isPending || updateMySchoolMutation.isPending;
  const isSubmittingPassword = changePasswordMutation.isPending;
  const isSubmittingAvatar = updateAvatarMutation.isPending || isUploadingAvatar;

  return (
    <StudentProfilePage
      fullName={fullName}
      onFullNameChange={handleFullNameChange}
      email={email}
      schoolName={schoolName}
      onSchoolNameChange={handleSchoolNameChange}
      schoolOptions={schoolOptions}
      onSelectSchoolId={handleSelectSchoolId}
      roleName={roleName}
      avatarSrc={avatarSrc}
      isVerified={true}
      statusText={statusText}
      lastPasswordUpdateText="Terakhir diperbarui baru saja"
      versionCode="2026.1-SIM"
      onSubmitPersonalInfo={handleSubmitPersonalInfo}
      onResetPersonalInfo={handleResetPersonalInfo}
      isSubmittingPersonalInfo={isSubmittingPersonalInfo}
      isDirtyPersonalInfo={isDirty}
      isChangePasswordOpen={isChangePasswordOpen}
      onOpenChangePassword={handleOpenChangePassword}
      changePasswordForm={changePasswordForm}
      onChangePasswordFormChange={handleChangePasswordFormChange}
      changePasswordError={changePasswordError}
      onSubmitChangePassword={handleSubmitChangePassword}
      isSubmittingPassword={isSubmittingPassword}
      isChangeAvatarOpen={isChangeAvatarOpen}
      onOpenChangeAvatar={handleOpenChangeAvatar}
      onSubmitChangeAvatar={handleSubmitChangeAvatar}
      isSubmittingAvatar={isSubmittingAvatar}
    />
  );
}
