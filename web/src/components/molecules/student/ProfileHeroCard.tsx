import { Camera, ShieldCheck } from 'lucide-react';
import type * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage, Badge, Button, Card } from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface ProfileHeroCardProps {
  fullName?: string;
  roleName?: string;
  avatarSrc?: string;
  onOpenChangeAvatar?: () => void;
  className?: string;
}

export function ProfileHeroCard({
  fullName = 'Anindya Humairah',
  roleName = 'Siswa',
  avatarSrc = '/avatars/1.png',
  onOpenChangeAvatar,
  className,
}: ProfileHeroCardProps) {
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <Card
      className={cn(
        'p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-200/80 bg-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6',
        className
      )}
    >
      {/* Left: Avatar & Identity */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Avatar with Status Indicator */}
        <div className="relative shrink-0">
          <div className="size-20 sm:size-22 rounded-full bg-[#D7F3F5] flex items-center justify-center border-2 border-cyan-100/80 overflow-hidden shadow-2xs">
            <Avatar className="size-full">
              <AvatarImage src={avatarSrc} alt={fullName} className="object-cover" />
              <AvatarFallback className="bg-teal-100 text-teal-800 font-bold text-base sm:text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          {/* Active Status Dot */}
          <span
            className="absolute bottom-1 right-1 size-3.5 bg-emerald-500 rounded-full ring-2 ring-white"
            title="Aktif"
          />
        </div>

        {/* Identity Details */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {fullName}
            </h2>
            <Badge className="bg-amber-50 text-amber-800 border-amber-200/70 hover:bg-amber-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {roleName}
            </Badge>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5 font-normal">
            <ShieldCheck className="size-4 text-teal-600 shrink-0 stroke-[2.2]" />
            <span>Portal Resmi Pembelajaran Terpadu SIMANTIK</span>
          </p>

          <div className="pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenChangeAvatar}
              className="h-8 rounded-full border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium px-3 gap-1.5 cursor-pointer shadow-2xs"
            >
              <Camera className="size-3.5 text-gray-600" />
              <span>Ubah Foto</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProfileHeroCard;
