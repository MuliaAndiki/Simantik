import { Contact, Mail, Shield } from 'lucide-react';
import type * as React from 'react';
import { Badge, Card } from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface ProfileAccountInfoCardProps {
  email: string;
  statusText?: string;
  roleName?: string;
  className?: string;
}

export function ProfileAccountInfoCard({
  email = 'anindya@example.com',
  statusText = 'Aktif',
  roleName = 'Siswa',
  className,
}: ProfileAccountInfoCardProps) {
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
          <Contact className="size-5 text-teal-600 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900 leading-tight">Informasi Akun</h3>
          <p className="text-xs text-gray-500 font-normal mt-0.5">
            Rincian status akun pada sistem autentikasi.
          </p>
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {/* Email Akun Box */}
        <div className="border border-gray-200/90 rounded-xl p-3 sm:px-3.5 bg-white flex items-center justify-between gap-3 shadow-2xs">
          <div className="space-y-0.5 min-w-0">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              EMAIL AKUN
            </span>
            <p className="text-sm font-semibold text-gray-800 truncate">{email}</p>
          </div>
          <div className="size-8 rounded-lg bg-teal-50/60 flex items-center justify-center shrink-0 text-teal-600">
            <Mail className="size-4 text-teal-600 stroke-[2.2]" />
          </div>
        </div>

        {/* Status Akun Row */}
        <div className="border border-gray-200/90 rounded-xl p-3 sm:px-3.5 bg-white flex items-center justify-between gap-3 shadow-2xs">
          <span className="text-xs sm:text-sm text-gray-600 font-medium">Status Akun</span>
          <Badge className="bg-teal-50 text-teal-700 border-teal-200/80 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-teal-100">
            <span className="size-1.5 rounded-full bg-teal-500" />
            <span>{statusText}</span>
          </Badge>
        </div>

        {/* Peran Row */}
        <div className="border border-gray-200/90 rounded-xl p-3 sm:px-3.5 bg-white flex items-center justify-between gap-3 shadow-2xs">
          <span className="text-xs sm:text-sm text-gray-600 font-medium">Peran</span>
          <Badge className="bg-amber-50 text-amber-800 border-amber-200/70 px-3 py-0.5 rounded-full text-xs font-semibold hover:bg-amber-100">
            {roleName}
          </Badge>
        </div>
      </div>

      {/* Footer Security Note */}
      <div className="pt-2 flex items-center gap-1.5 text-xs text-gray-400">
        <Shield className="size-3.5 text-teal-600 shrink-0 stroke-[2.2]" />
        <span>Akun terproteksi sistem autentikasi SIMANTIK.</span>
      </div>
    </Card>
  );
}

export default ProfileAccountInfoCard;
