import { ShieldCheck } from 'lucide-react';
import type * as React from 'react';
import { cn } from '@/utils/classname';

export interface AuthSecurityNoticeProps {
  className?: string;
  variant?: 'default' | 'forgot-password' | 'otp';
}

export function AuthSecurityNotice({ className, variant = 'default' }: AuthSecurityNoticeProps) {
  return (
    <div
      className={cn(
        'w-full bg-[#F0FDFB] border border-[#CCFBF1] rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 text-left transition-all',
        className
      )}
    >
      <div className="shrink-0 mt-0.5 text-teal-600 bg-teal-100/60 p-1.5 rounded-lg">
        <ShieldCheck className="w-4 h-4" />
      </div>

      <div className="text-xs space-y-1">
        {variant === 'default' && (
          <>
            <p className="font-bold text-slate-800">Data kamu aman bersama kami.</p>
            <p className="text-slate-600 leading-relaxed">
              Kami berkomitmen menjaga privasi dan keamanan akun belajarmu sesuai standar enkripsi
              terkini.
            </p>
          </>
        )}

        {variant === 'forgot-password' && (
          <p className="text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-800">Data kamu tetap aman.</span> Tautan reset
            password hanya dapat digunakan untuk akun yang terdaftar.
          </p>
        )}

        {variant === 'otp' && (
          <>
            <p className="font-bold text-slate-800">Keamanan Akun Pelajar:</p>
            <ul className="text-slate-600 space-y-0.5 leading-relaxed">
              <li>• Kode verifikasi berlaku selama 5 menit.</li>
              <li>• Jangan bagikan kode verifikasi kepada siapa pun.</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
