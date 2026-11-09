'use client';

import { useEffect, useMemo, useState } from 'react';
import { TableLoader } from '@/components/atoms/loading';
import type { ChangePasswordForm } from '@/components/organisms/student/ChangePasswordModal';
import type { ProfileSchoolOption } from '@/components/organisms/student/ProfilePersonalInfoCard';
import { StudentProfilePage } from '@/components/page/private/student/StudentProfilePage';
import { useApi } from '@/hooks/useApi';
import { useAlert } from '@/hooks/useService/useAlert/costum-alert';
import { uploadAvatar } from '@/utils/r2-utils';

const DEFAULT_AVATAR = '/avatars/1.png';

const EMPTY_CHANGE_PASSWORD_FORM: ChangePasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function StudentProfile() {
  const { user, school } = useApi();
  const { toast } = useAlert();

  // 1. Data queries
  const { data: userProfile, isLoading: isProfileLoading } = user.query.me();
  const { data: schoolsResponse } = school.query.listPublic({ limit: 100 });

  // 2. Mutations
  const updateProfileMutation = user.mutate.updateProfile();
  const updateMySchoolMutation = user.mutate.updateMySchool();
  const changePasswordMutation = user.mutate.changePassword();
  const updateAvatarMutation = user.mutate.updateAvatar();

  // 3. Form state
  const [fullName, setFullName] = useState('');
  const [schoolName, setSchoolName] = useState('');
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

  const schoolOptions: ProfileSchoolOption[] = useMemo(() => {
    return (schoolsResponse?.schools ?? []).map((s) => ({
      id: s.id,
      name: s.nama,
    }));
  }, [schoolsResponse]);

  // Synchronize initial data once fetched
  useEffect(() => {
    if (userProfile) {
      if (userProfile.fullName) {
        setFullName(userProfile.fullName);
      }
      const initialSchool = userProfile.studentProfile?.school;
      if (initialSchool) {
        setSchoolName(initialSchool);
        const match = schoolOptions.find(
          (s) => s.name.toLowerCase() === initialSchool.toLowerCase()
        );
        if (match) {
          setSelectedSchoolId(match.id);
        }
      }
    }
  }, [userProfile, schoolOptions]);

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
    setFullName(userProfile?.fullName ?? '');
    const initialSchool = userProfile?.studentProfile?.school ?? '';
    setSchoolName(initialSchool);
    const match = schoolOptions.find((s) => s.name.toLowerCase() === initialSchool.toLowerCase());
    setSelectedSchoolId(match?.id ?? '');
    setIsDirty(false);
  };

  const handleSubmitPersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (fullName.trim() !== '') {
        await updateProfileMutation.mutateAsync({ fullName: fullName.trim() });
      }

      if (selectedSchoolId) {
        await updateMySchoolMutation.mutateAsync({
          schoolId: selectedSchoolId,
        });
      }

      setIsDirty(false);
      toast({
        title: 'Berhasil',
        message: 'Informasi profil kamu berhasil disimpan.',
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
        message: 'Kata sandi berhasil diperbarui.',
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
        // 1. Upload ke Cloudflare R2 lewat Server Action (menggunakan FormData untuk binary streaming aman)
        const formData = new FormData();
        formData.append('file', avatar);
        finalUrl = await uploadAvatar(formData);
      } else if (typeof avatar === 'string') {
        // Jika relative URL, ubah ke absolute URL agar lolos validasi URL di backend
        if (avatar.startsWith('/') && typeof window !== 'undefined') {
          finalUrl = `${window.location.origin}${avatar}`;
        } else {
          finalUrl = avatar;
        }
      } else {
        throw new Error('Format foto tidak valid.');
      }

      // 2. Simpan URL avatar ke database via user.mutate.updateAvatar
      await updateAvatarMutation.mutateAsync({ avatarURL: finalUrl });

      setIsChangeAvatarOpen(false);
      toast({
        title: 'Berhasil',
        message: 'Foto profil berhasil diperbarui.',
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

  const email = userProfile?.email ?? '';
  const avatarSrc = userProfile?.avatarURL ?? DEFAULT_AVATAR;
  const roleName = userProfile?.role === 'student' ? 'Siswa' : (userProfile?.role ?? 'Siswa');
  const statusText = userProfile?.status === 'active' ? 'Aktif' : 'Aktif';

  const isSubmittingPersonalInfo =
    updateProfileMutation.isPending || updateMySchoolMutation.isPending;
  const isSubmittingPassword = changePasswordMutation.isPending;
  const isSubmittingAvatar = updateAvatarMutation.isPending || isUploadingAvatar;

  if (isProfileLoading && !userProfile) {
    return <TableLoader label="Memuat profil..." />;
  }

  return (
    <StudentProfilePage
      fullName={fullName}
      onFullNameChange={handleFullNameChange}
      email={email}
      schoolName={schoolName}
      onSchoolNameChange={handleSchoolNameChange}
      schoolOptions={schoolOptions}
      selectedSchoolId={selectedSchoolId}
      onSelectSchoolId={handleSelectSchoolId}
      roleName={roleName}
      avatarSrc={avatarSrc}
      isVerified={true}
      statusText={statusText}
      lastPasswordUpdateText="Terakhir diperbarui 2 bulan lalu"
      versionCode="2025.1-SIM"
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
