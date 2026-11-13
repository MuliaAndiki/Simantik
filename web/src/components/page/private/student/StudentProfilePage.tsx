import type * as React from 'react';
import type { ChangePasswordForm } from '@/components/organisms/student/ChangePasswordModal';
import type { ProfileSchoolOption } from '@/components/organisms/student/ProfilePersonalInfoCard';
import { StudentProfileTemplate } from '@/components/templates/student/StudentProfileTemplate';
import type { SchoolResponse } from '@/types/service';

export interface StudentProfilePageProps {
  fullName: string;
  onFullNameChange: (val: string) => void;
  email: string;
  schoolName: string;
  onSchoolNameChange?: (val: string) => void;
  schoolOptions?: ProfileSchoolOption[];
  selectedSchoolId?: string;
  onSelectSchoolId?: (schoolId: string) => void;
  onOpenProposeSchool?: () => void;
  mySchoolSubmissions?: SchoolResponse[];
  onResubmitSchool?: (school: SchoolResponse) => void;
  roleName?: string;
  avatarSrc?: string;
  isVerified?: boolean;
  statusText?: string;
  lastPasswordUpdateText?: string;
  versionCode?: string;

  // Personal Info Form
  onSubmitPersonalInfo: (e: React.FormEvent) => void;
  onResetPersonalInfo: () => void;
  isSubmittingPersonalInfo?: boolean;
  isDirtyPersonalInfo?: boolean;

  // Change Password Modal
  isChangePasswordOpen: boolean;
  onOpenChangePassword: (open: boolean) => void;
  changePasswordForm: ChangePasswordForm;
  onChangePasswordFormChange: (field: keyof ChangePasswordForm, value: string) => void;
  changePasswordError?: string | null;
  onSubmitChangePassword: () => Promise<void> | void;
  isSubmittingPassword?: boolean;

  // Change Avatar Modal
  isChangeAvatarOpen: boolean;
  onOpenChangeAvatar: (open: boolean) => void;
  onSubmitChangeAvatar: (avatarURL: string | File) => Promise<void> | void;
  isSubmittingAvatar?: boolean;
}

export function StudentProfilePage({
  fullName,
  onFullNameChange,
  email,
  schoolName,
  onSchoolNameChange,
  schoolOptions,
  selectedSchoolId,
  onSelectSchoolId,
  onOpenProposeSchool,
  mySchoolSubmissions,
  onResubmitSchool,
  roleName = 'Siswa',
  avatarSrc = '/avatars/1.png',
  statusText = 'Aktif',
  lastPasswordUpdateText = 'Terakhir diperbarui 2 bulan lalu',
  versionCode = '2025.1-SIM',
  onSubmitPersonalInfo,
  onResetPersonalInfo,
  isSubmittingPersonalInfo = false,
  isDirtyPersonalInfo = false,
  isChangePasswordOpen,
  onOpenChangePassword,
  changePasswordForm,
  onChangePasswordFormChange,
  changePasswordError = null,
  onSubmitChangePassword,
  isSubmittingPassword = false,
  isChangeAvatarOpen,
  onOpenChangeAvatar,
  onSubmitChangeAvatar,
  isSubmittingAvatar = false,
}: StudentProfilePageProps) {
  return (
    <StudentProfileTemplate
      heroProps={{
        fullName,
        roleName,
        avatarSrc,
        onOpenChangeAvatar: () => onOpenChangeAvatar(true),
      }}
      personalInfoProps={{
        fullName,
        onFullNameChange,
        email,
        schoolName,
        onSchoolNameChange,
        schoolOptions,
        selectedSchoolId,
        onSelectSchoolId,
        onOpenProposeSchool,
        mySchoolSubmissions,
        onResubmitSchool,
        onSubmit: onSubmitPersonalInfo,
        onReset: onResetPersonalInfo,
        isSubmitting: isSubmittingPersonalInfo,
        isDirty: isDirtyPersonalInfo,
        versionCode,
      }}
      accountInfoProps={{
        email,
        statusText,
        roleName,
      }}
      securityProps={{
        lastPasswordUpdateText,
        onOpenChangePassword: () => onOpenChangePassword(true),
      }}
      changePasswordModalProps={{
        open: isChangePasswordOpen,
        onOpenChange: onOpenChangePassword,
        form: changePasswordForm,
        onChange: onChangePasswordFormChange,
        error: changePasswordError,
        onSubmit: onSubmitChangePassword,
        isSubmitting: isSubmittingPassword,
      }}
      changeAvatarModalProps={{
        open: isChangeAvatarOpen,
        onOpenChange: onOpenChangeAvatar,
        currentAvatarURL: avatarSrc,
        onSubmit: onSubmitChangeAvatar,
        isSubmitting: isSubmittingAvatar,
      }}
    />
  );
}

export default StudentProfilePage;
