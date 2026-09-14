import { ShieldCheck } from 'lucide-react';
import type * as React from 'react';
import {
  ProfileHeroCard,
  type ProfileHeroCardProps,
} from '@/components/molecules/student/ProfileHeroCard';
import {
  ChangeAvatarModal,
  type ChangeAvatarModalProps,
  ChangePasswordModal,
  type ChangePasswordModalProps,
  ProfileAccountInfoCard,
  type ProfileAccountInfoCardProps,
  ProfilePersonalInfoCard,
  type ProfilePersonalInfoCardProps,
  ProfileSecurityCard,
  type ProfileSecurityCardProps,
  StudentDashboardFooter,
} from '@/components/organisms/student';
import { cn } from '@/utils/classname';

export interface StudentProfileTemplateProps {
  heroProps: ProfileHeroCardProps;
  personalInfoProps: ProfilePersonalInfoCardProps;
  accountInfoProps: ProfileAccountInfoCardProps;
  securityProps: ProfileSecurityCardProps;
  changePasswordModalProps: ChangePasswordModalProps;
  changeAvatarModalProps: ChangeAvatarModalProps;
  className?: string;
}

export function StudentProfileTemplate({
  heroProps,
  personalInfoProps,
  accountInfoProps,
  securityProps,
  changePasswordModalProps,
  changeAvatarModalProps,
  className,
}: StudentProfileTemplateProps) {
  return (
    <div className={cn('w-full max-w-full mx-auto space-y-6 md:space-y-8 pb-6', className)}>
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Profil Saya
          </h1>
          <p className="text-xs sm:text-sm text-[#546A72] font-normal">
            Kelola informasi akun dan data profil kamu di SIMANTIK.
          </p>
        </div>

        {/* Portal Siswa Terverifikasi Badge */}
        
      </div>

      {/* 2. Top Profile Hero Banner */}
      <ProfileHeroCard {...heroProps} />

      {/* 3. Main Content Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Informasi Pribadi */}
        <div className="lg:col-span-7">
          <ProfilePersonalInfoCard {...personalInfoProps} />
        </div>

        {/* Right Column: Informasi Akun & Keamanan Akun */}
        <div className="lg:col-span-5 space-y-6">
          <ProfileAccountInfoCard {...accountInfoProps} />
          <ProfileSecurityCard {...securityProps} />
        </div>
      </div>

      {/* 4. Modals */}
      <ChangePasswordModal {...changePasswordModalProps} />
      <ChangeAvatarModal {...changeAvatarModalProps} />

      {/* 5. Unified Footer */}
      <StudentDashboardFooter />
    </div>
  );
}

export default StudentProfileTemplate;
