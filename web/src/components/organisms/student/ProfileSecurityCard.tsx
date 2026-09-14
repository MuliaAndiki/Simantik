import { Lock, Pencil } from 'lucide-react';
import type * as React from 'react';
import { Button, Card } from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface ProfileSecurityCardProps {
  lastPasswordUpdateText?: string;
  onOpenChangePassword?: () => void;
  className?: string;
}

export function ProfileSecurityCard({
  lastPasswordUpdateText = 'Terakhir diperbarui 2 bulan lalu',
  onOpenChangePassword,
  className,
}: ProfileSecurityCardProps) {
  return (
    <Card
      className={cn(
        'p-6 sm:p-7 rounded-2xl md:rounded-3xl border border-gray-200/80 bg-white shadow-xs space-y-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-2 border-b border-gray-100">
        <div className="size-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100/60">
          <Lock className="size-5 text-teal-600 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900 leading-tight">Keamanan Akun</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Password</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
        Perbarui password secara berkala untuk menjaga keamanan akun kamu.
      </p>

      {/* Password Status Box */}
      <div className="border border-gray-200/90 rounded-2xl p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="space-y-1">
          <div className="tracking-[0.25em] text-base sm:text-lg font-bold text-gray-700 select-none">
            ••••••••••••
          </div>
          <p className="text-xs text-gray-400 font-normal">{lastPasswordUpdateText}</p>
        </div>

        <Button
          type="button"
          onClick={onOpenChangePassword}
          className="h-9 rounded-xl bg-[#E6F6F6] hover:bg-[#D5EFEF] active:bg-[#BEE5E5] text-[#0F766E] text-xs font-semibold px-4 gap-1.5 cursor-pointer shadow-2xs transition-colors"
        >
          <Pencil className="size-3.5 stroke-[2.2]" />
          <span>Ubah Password</span>
        </Button>
      </div>
    </Card>
  );
}

export default ProfileSecurityCard;
