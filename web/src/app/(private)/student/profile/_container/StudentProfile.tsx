'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TableLoader } from '@/components/atoms/loading';
import type { SchoolOption } from '@/components/molecules/auth/SchoolSearchSelect';
import type { ChangePasswordForm } from '@/components/organisms/student/ChangePasswordModal';
import { StudentProfilePage } from '@/components/page/private/student/StudentProfilePage';
import { useApi } from '@/hooks/useApi';
import { useDebounce } from '@/hooks/useDebounce/useDebounce';
import { useAlert } from '@/hooks/useService/useAlert/costum-alert';
import type { SchoolResponse } from '@/types/service';
import { uploadAvatar } from '@/utils/r2-utils';
import {
  buildProposeSchoolHref,
  formatSchoolLevelLabel,
  mergeSelectableSchools,
  normalizeSchoolLevel,
  resolveJenjangChangeState,
  type SchoolLevelFilterValue,
  toSelectableSchoolItem,
} from '@/utils/school-picker.util';
import { clearSchoolSkipInStorage } from '@/utils/school-skip.util';

const DEFAULT_AVATAR = '/avatars/1.png';
const SCHOOL_SEARCH_DEBOUNCE_MS = 350;

const EMPTY_CHANGE_PASSWORD_FORM: ChangePasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function StudentProfile() {
  const router = useRouter();
  const { user, school } = useApi();
  const { toast, confirm } = useAlert();

  // 1. Form & school search states
  const [fullName, setFullName] = useState('');
  const [schoolSearch, setSchoolSearch] = useState('');
  const [jenjangFilter, setJenjangFilter] = useState<SchoolLevelFilterValue>('all');
  const [selectedSchool, setSelectedSchool] = useState<SchoolOption | null>(null);
  const [isSchoolCleared, setIsSchoolCleared] = useState(false);
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  const [schoolError, setSchoolError] = useState<string | undefined>();

  const debouncedSchoolSearch = useDebounce(schoolSearch, SCHOOL_SEARCH_DEBOUNCE_MS);

  const hydratedUserIdRef = useRef<string | null>(null);
  const lastServerSchoolIdRef = useRef<string>('');

  // 2. Data queries
  const { data: userProfile, isLoading: isProfileLoading } = user.query.me();
  const { data: schoolsResponse, isFetching: isSchoolsFetching } = school.query.listPublic({
    search: debouncedSchoolSearch.trim() || undefined,
    jenjang: jenjangFilter === 'all' ? undefined : jenjangFilter,
    limit: 20,
  });
  const { data: mySubmissionsResponse } = school.query.mySubmissions();

  // 3. Mutations
  const updateProfileMutation = user.mutate.updateProfile();
  const updateMySchoolMutation = user.mutate.updateMySchool();
  const changePasswordMutation = user.mutate.changePassword();
  const updateAvatarMutation = user.mutate.updateAvatar();

  // 4. Modal states
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // 5. Change password form state
  const [changePasswordForm, setChangePasswordForm] = useState<ChangePasswordForm>(
    EMPTY_CHANGE_PASSWORD_FORM
  );
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);

  const mySchoolSubmissions = useMemo(() => mySubmissionsResponse ?? [], [mySubmissionsResponse]);

  const schoolOptions = useMemo(
    () =>
      mergeSelectableSchools(schoolsResponse?.schools, mySchoolSubmissions, {
        search: debouncedSchoolSearch,
        jenjang: jenjangFilter,
      }),
    [debouncedSchoolSearch, jenjangFilter, mySchoolSubmissions, schoolsResponse?.schools]
  );

  const resolveInitialSchoolOption = useCallback(
    (schoolId?: string, schoolTitle?: string): SchoolOption | null => {
      if (!schoolId && !schoolTitle) return null;

      if (schoolId) {
        const fromSubmission = mySchoolSubmissions.find((s) => s.id === schoolId);
        if (fromSubmission) return toSelectableSchoolItem(fromSubmission);

        const fromPublic = schoolsResponse?.schools?.find((s) => s.id === schoolId);
        if (fromPublic) return toSelectableSchoolItem(fromPublic);

        return {
          id: schoolId,
          nama: schoolTitle || 'Sekolah terdaftar',
          npsn: '',
          jenjang: '',
        };
      }

      const fromTitle =
        mySchoolSubmissions.find(
          (s) => s.nama.toLowerCase() === (schoolTitle ?? '').toLowerCase()
        ) ??
        schoolsResponse?.schools?.find(
          (s) => s.nama.toLowerCase() === (schoolTitle ?? '').toLowerCase()
        );
      return fromTitle ? toSelectableSchoolItem(fromTitle) : null;
    },
    [mySchoolSubmissions, schoolsResponse?.schools]
  );

  const serverInitialSchool = useMemo(
    () =>
      resolveInitialSchoolOption(
        userProfile?.studentProfile?.schoolId,
        userProfile?.studentProfile?.school
      ),
    [
      resolveInitialSchoolOption,
      userProfile?.studentProfile?.school,
      userProfile?.studentProfile?.schoolId,
    ]
  );

  const baselineFullName = userProfile?.fullName ?? '';
  const baselineSchoolId = userProfile?.studentProfile?.schoolId ?? '';
  const baselineSchoolJenjang = normalizeSchoolLevel(
    userProfile?.studentProfile?.schoolJenjang ?? serverInitialSchool?.jenjang
  );
  const baselineJenjang = normalizeSchoolLevel(
    userProfile?.studentProfile?.effectiveJenjang ??
      userProfile?.studentProfile?.jenjang ??
      baselineSchoolJenjang
  );

  const isNameDirty = fullName.trim() !== baselineFullName.trim();
  const isSchoolChanged = Boolean(selectedSchool?.id) && selectedSchool?.id !== baselineSchoolId;
  const targetJenjang = isSchoolChanged
    ? normalizeSchoolLevel(selectedSchool?.jenjang)
    : baselineJenjang;
  const jenjangChangeState = resolveJenjangChangeState({
    baselineJenjang,
    targetJenjang,
  });
  const isDirty = isNameDirty || isSchoolChanged || isSchoolCleared || schoolSearch.trim() !== '';

  // Hydrate initial profile fields once per user load (without clobbering user search/filter edits)
  useEffect(() => {
    if (!userProfile) return;
    const serverSchoolId = userProfile.studentProfile?.schoolId ?? '';

    if (hydratedUserIdRef.current !== userProfile.id) {
      hydratedUserIdRef.current = userProfile.id;
      lastServerSchoolIdRef.current = serverSchoolId;
      setFullName(userProfile.fullName ?? '');
      setSelectedSchool(serverInitialSchool);
      return;
    }

    if (serverSchoolId !== lastServerSchoolIdRef.current && !isSchoolChanged && !isSchoolCleared) {
      lastServerSchoolIdRef.current = serverSchoolId;
      setSelectedSchool(serverInitialSchool);
    }
  }, [isSchoolChanged, isSchoolCleared, serverInitialSchool, userProfile]);

  // Enrich initially hydrated school metadata once public/submission queries resolve
  useEffect(() => {
    if (!selectedSchool || isSchoolCleared) return;
    if (selectedSchool.npsn && selectedSchool.jenjang) return;
    const enriched =
      mySchoolSubmissions.find((s) => s.id === selectedSchool.id) ??
      schoolsResponse?.schools?.find((s) => s.id === selectedSchool.id);
    if (enriched) {
      setSelectedSchool(toSelectableSchoolItem(enriched));
    }
  }, [isSchoolCleared, mySchoolSubmissions, schoolsResponse?.schools, selectedSchool]);

  const handleFullNameChange = (val: string) => {
    setFullName(val);
  };

  const handleSchoolSearchChange = (val: string) => {
    setSchoolSearch(val);
    setSchoolError(undefined);
    setIsSchoolDropdownOpen(true);
  };

  const handleSchoolSearchFocus = () => {
    setIsSchoolDropdownOpen(true);
  };

  const handleJenjangFilterChange = (nextJenjang: SchoolLevelFilterValue) => {
    setJenjangFilter(nextJenjang);
    setSchoolError(undefined);
    setIsSchoolDropdownOpen(true);
  };

  const handleSelectSchool = (item: SchoolOption) => {
    setSelectedSchool(item);
    setSchoolSearch('');
    setIsSchoolCleared(false);
    setIsSchoolDropdownOpen(false);
    setSchoolError(undefined);
  };

  const handleClearSelectedSchool = () => {
    setSelectedSchool(null);
    setSchoolSearch('');
    setIsSchoolCleared(true);
    setIsSchoolDropdownOpen(true);
    setSchoolError(undefined);
  };

  const handleResetPersonalInfo = () => {
    setFullName(baselineFullName);
    setSelectedSchool(serverInitialSchool);
    setSchoolSearch('');
    setJenjangFilter('all');
    setIsSchoolCleared(false);
    setIsSchoolDropdownOpen(false);
    setSchoolError(undefined);
  };

  const handleOpenProposeSchool = (seed?: SchoolResponse) => {
    if (seed) {
      router.push(
        buildProposeSchoolHref({
          resubmitId: seed.id,
          returnTo: '/student/profile',
        })
      );
      return;
    }

    router.push(
      buildProposeSchoolHref({
        query: schoolSearch.trim() || undefined,
        jenjang: jenjangFilter,
        returnTo: '/student/profile',
      })
    );
  };

  const handleSubmitPersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      toast({
        title: 'Nama wajib diisi',
        message: 'Nama lengkap tidak boleh kosong.',
        icon: 'warning',
      });
      return;
    }

    if (!selectedSchool && (isSchoolCleared || schoolSearch.trim() !== '')) {
      const msg = 'Pilih sekolah dari daftar pencarian atau klik Ajukan Sekolah Baru.';
      setSchoolError(msg);
      setIsSchoolDropdownOpen(true);
      toast({
        title: 'Sekolah belum dipilih',
        message: msg,
        icon: 'warning',
      });
      return;
    }

    if (!isNameDirty && !isSchoolChanged) {
      toast({
        title: 'Tidak ada perubahan',
        message: 'Silakan ubah nama atau pilih sekolah baru terlebih dahulu.',
        icon: 'info',
      });
      return;
    }

    if (
      isSchoolChanged &&
      jenjangChangeState.isChangingJenjang &&
      jenjangChangeState.previousJenjang &&
      jenjangChangeState.nextJenjang
    ) {
      const oldLabel = formatSchoolLevelLabel(jenjangChangeState.previousJenjang);
      const newLabel = formatSchoolLevelLabel(jenjangChangeState.nextJenjang);

      const confirmed = await confirm({
        variant: 'warning',
        headerBadge: 'KONFIRMASI UBAH JENJANG',
        title: 'Ubah Sekolah & Jenjang Belajar?',
        description: `Kamu akan mengubah sekolah ke jenjang **${newLabel}** (sebelumnya **${oldLabel}**). Seluruh **Materi Belajar, Soal Latihan, dan Tryout** di SIMANTIK akan otomatis disesuaikan ke jenjang **${newLabel}**.`,
        metadata: {
          title: 'RINGKASAN PERUBAHAN JENJANG',
          items: [
            { label: 'JENJANG SEBELUMNYA', value: oldLabel },
            { label: 'JENJANG BARU', value: newLabel },
          ],
        },
        banner: {
          variant: 'warning',
          title: 'Konten Belajar & Evaluasi Terisolasi per Jenjang',
          message: `Setelah disimpan, halaman Materi Belajar, Soal Latihan, dan Tryout hanya akan menampilkan konten untuk jenjang **${newLabel}**.`,
        },
        confirmButtonText: 'Ya, Ubah Jenjang & Simpan',
        cancelButtonText: 'Batal',
      });

      if (!confirmed) {
        return;
      }
    }

    try {
      if (isNameDirty) {
        await updateProfileMutation.mutateAsync({ fullName: trimmedName });
      }

      if (selectedSchool && isSchoolChanged) {
        await updateMySchoolMutation.mutateAsync({
          schoolId: selectedSchool.id,
        });
        clearSchoolSkipInStorage(userProfile?.id);
        lastServerSchoolIdRef.current = selectedSchool.id;
      }

      setSchoolSearch('');
      setIsSchoolCleared(false);
      setIsSchoolDropdownOpen(false);
      setSchoolError(undefined);
    } catch {
      // Error toast ditangani oleh useAppMutation
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
  const hasNoSchool = Boolean(
    userProfile && !userProfile.studentProfile?.schoolId && !userProfile.studentProfile?.school
  );

  const nextJenjangLabel = formatSchoolLevelLabel(jenjangChangeState.nextJenjang);
  const jenjangNotice =
    isSchoolChanged && nextJenjangLabel
      ? jenjangChangeState.isChangingJenjang
        ? {
            previousLabel: formatSchoolLevelLabel(jenjangChangeState.previousJenjang),
            nextLabel: nextJenjangLabel,
            isChangingJenjang: true,
          }
        : !jenjangChangeState.previousJenjang
          ? {
              nextLabel: nextJenjangLabel,
              isChangingJenjang: false,
            }
          : null
      : null;

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
      schoolName={selectedSchool?.nama ?? ''}
      schoolPickerProps={{
        search: schoolSearch,
        onSearchChange: handleSchoolSearchChange,
        onSearchFocus: handleSchoolSearchFocus,
        showDropdown: isSchoolDropdownOpen,
        onDismissDropdown: () => setIsSchoolDropdownOpen(false),
        jenjangFilter,
        onJenjangFilterChange: handleJenjangFilterChange,
        schools: schoolOptions,
        loading: isSchoolsFetching,
        selected: selectedSchool,
        onSelect: handleSelectSchool,
        onClear: handleClearSelectedSchool,
        error: schoolError,
        hasNoSchool,
        jenjangNotice,
      }}
      onOpenProposeSchool={() => handleOpenProposeSchool()}
      mySchoolSubmissions={mySchoolSubmissions}
      onResubmitSchool={(item) => handleOpenProposeSchool(item)}
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
