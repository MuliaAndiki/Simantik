'use client';

import { Building2, ChevronRight, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/atoms';
import { useApi } from '@/hooks/useApi';
import { cn } from '@/utils/classname';

export interface ProfileDropdownProps {
  avatarSrc?: string;
  fullName?: string;
  grade?: string;
  email?: string;
  school?: string;
  profileHref?: string;
  className?: string;
}

export default function ProfileDropdown({
  avatarSrc,
  fullName,
  grade,
  email,
  school,
  profileHref,
  className,
}: ProfileDropdownProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user } = useApi();
  const { data: userData } = user.query.me();

  const name = fullName ?? userData?.fullName ?? 'Pengguna SIMANTIK';
  const userEmail = email ?? userData?.email ?? 'user@simantik.id';
  const userGrade =
    grade ??
    (userData?.role === 'student'
      ? userData?.studentProfile?.grade
        ? userData.studentProfile.grade.trim()
        : 'Siswa SMA/SMK'
      : userData?.role === 'admin'
        ? 'Administrator'
        : userData?.role === 'content_manager'
          ? 'Content Manager'
          : 'Pengguna SIMANTIK');
  const userSchool =
    school ??
    userData?.studentProfile?.school ??
    (userData?.role === 'admin'
      ? 'SIMANTIK Admin Workspace'
      : userData?.role === 'content_manager'
        ? 'SIMANTIK Content Workspace'
        : 'SMA / SMK Sederajat');
  const targetProfileHref =
    profileHref ??
    (userData?.role === 'student'
      ? '/student/profile'
      : userData?.role === 'admin'
        ? '/admin/profile'
        : userData?.role === 'content_manager'
          ? '/content_manager/profile'
          : '/student/profile');
  const imageSrc = avatarSrc ?? userData?.avatarURL ?? '/avatars/1.png';

  const initials = useMemo(() => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }, [name]);

  const handleOpenProfile = () => {
    setOpen(false);
    router.push(targetProfileHref);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Menu profil pengguna"
          className={cn(
            'rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/40 cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95',
            className
          )}
        >
          <Avatar className="size-10 border border-slate-200 shadow-2xs">
            <AvatarImage src={imageSrc} alt={name} className="object-cover" />
            <AvatarFallback className="bg-teal-50 text-teal-800 font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-72 sm:w-80 rounded-2xl border border-slate-100 bg-white p-5 shadow-xl space-y-4 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
      >
        {/* User Identity Header */}
        <div className="flex items-center gap-3.5">
          <div className="size-12 rounded-full bg-[#D7F3F5] flex items-center justify-center shrink-0 border border-cyan-100/80 overflow-hidden">
            <Avatar className="size-10">
              <AvatarImage src={imageSrc} alt={name} className="object-cover" />
              <AvatarFallback className="bg-teal-100 text-teal-800 font-bold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">
              {name}
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">{userGrade}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-100" />

        {/* Email Field Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Mail className="size-3.5 text-teal-600 stroke-[2.2]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              EMAIL
            </span>
          </div>
          <p className="font-semibold text-slate-800 text-xs sm:text-sm truncate">{userEmail}</p>
        </div>

        {/* School Field Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Building2 className="size-3.5 text-teal-600 stroke-[2.2]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              SEKOLAH
            </span>
          </div>
          <p className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wide truncate">
            {userSchool}
          </p>
        </div>

        {/* Action Button: Buka Profil */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleOpenProfile}
            className="w-full bg-[#E5F7F8] hover:bg-[#D5F0F2] active:bg-[#C2E9EC] text-[#1A4D5C] font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-between transition-colors duration-150 cursor-pointer shadow-2xs"
          >
            <span>Buka Profil</span>
            <ChevronRight className="size-4 text-[#1A4D5C] stroke-[2.5]" />
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
