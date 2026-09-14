'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ProfileSchoolOption } from '@/components/organisms/student/ProfilePersonalInfoCard';
import { StudentProfilePage } from '@/components/page/private/student/StudentProfilePage';
import { useApi } from '@/hooks/useApi';
import { useAlert } from '@/hooks/useService/useAlert/costum-alert';
import { uploadAvatar } from '@/utils/r2-utils';

const DEFAULT_NAME = 'Anindya Humairah';
const DEFAULT_EMAIL = 'anindya@example.com';
const DEFAULT_SCHOOL = 'SMA N Modal Bangsa Arun';
const DEFAULT_AVATAR = '/avatars/1.png';

export default function StudentProfile() {
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
  const [schoolName, setSchoolName] = useState(DEFAULT_SCHOOL);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [isDirty, setIsDirty] = useState(false);

  // 4. Modal states
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Synchronize initial data once fetched
  useEffect(() => {
    if (userProfile) {
      if (userProfile.fullName) {
        setFullName(userProfile.fullName);
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
    setSchoolName(DEFAULT_SCHOOL);
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

  const handleSubmitChangePassword = async (payload: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
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
      throw err;
    }
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

  const email = userProfile?.email ?? DEFAULT_EMAIL;
  const avatarSrc = userProfile?.avatarURL ?? DEFAULT_AVATAR;
  const roleName = userProfile?.role === 'student' ? 'Siswa' : (userProfile?.role ?? 'Siswa');
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
      lastPasswordUpdateText="Terakhir diperbarui 2 bulan lalu"
      versionCode="2025.1-SIM"
      onSubmitPersonalInfo={handleSubmitPersonalInfo}
      onResetPersonalInfo={handleResetPersonalInfo}
      isSubmittingPersonalInfo={isSubmittingPersonalInfo}
      isDirtyPersonalInfo={isDirty}
      isChangePasswordOpen={isChangePasswordOpen}
      onOpenChangePassword={setIsChangePasswordOpen}
      onSubmitChangePassword={handleSubmitChangePassword}
      isSubmittingPassword={isSubmittingPassword}
      isChangeAvatarOpen={isChangeAvatarOpen}
      onOpenChangeAvatar={setIsChangeAvatarOpen}
      onSubmitChangeAvatar={handleSubmitChangeAvatar}
      isSubmittingAvatar={isSubmittingAvatar}
    />
  );
}
