import { Lock, Server, ShieldCheck, User } from 'lucide-react';
import type React from 'react';
import { Button, Input } from '@/components/atoms';
import { cn } from '@/utils/classname';

export type AdminSettingsTab = 'profile' | 'security' | 'system';

export interface AdminSettingsContentProps {
  activeTab: AdminSettingsTab;
  onActiveTabChange: (tab: AdminSettingsTab) => void;
  fullName: string;
  email: string;
  onFullNameChange: (name: string) => void;
  onSaveProfile: (e: React.FormEvent) => void;
  onSavePassword: (e: React.FormEvent) => void;
  className?: string;
}

export const AdminSettingsContent: React.FC<AdminSettingsContentProps> = ({
  activeTab,
  onActiveTabChange,
  fullName,
  email,
  onFullNameChange,
  onSaveProfile,
  onSavePassword,
  className,
}) => {
  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Top Banner with Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-3.5 w-1 rounded-full bg-teal-600 shrink-0" aria-hidden="true" />
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                Konfigurasi Platform
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pengaturan Admin & Sistem
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
              Konfigurasi profil administrator, hak akses, integrasi platform, dan keamanan
              SIMANTIK.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100">
              <ShieldCheck className="size-3.5" />
              Role: Super Admin
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-100 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => onActiveTabChange('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#EAF6F8] text-teal-800 border border-cyan-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <User className="size-4" />
            Profil Admin
          </button>
          <button
            type="button"
            onClick={() => onActiveTabChange('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#EAF6F8] text-teal-800 border border-cyan-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Lock className="size-4" />
            Keamanan & Sandi
          </button>
          <button
            type="button"
            onClick={() => onActiveTabChange('system')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'system'
                ? 'bg-[#EAF6F8] text-teal-800 border border-cyan-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Server className="size-4" />
            Status Layanan & API
          </button>
        </div>
      </div>

      {/* Tab 1: Profil Admin */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Informasi Akun Administrator</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Data identitas ini digunakan pada seluruh catatan audit log dan penerbitan kurikulum.
            </p>
          </div>

          <form onSubmit={onSaveProfile} className="space-y-4 max-w-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
              <Input
                value={fullName}
                onChange={(e) => onFullNameChange(e.target.value)}
                placeholder="Nama Lengkap"
                className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Alamat Email</label>
              <Input
                value={email}
                disabled
                className="h-10 rounded-xl bg-slate-100 border-slate-200 text-xs font-medium text-slate-500 cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-400">
                Email super admin hanya dapat diubah melalui konfigurasi root environment.
              </span>
            </div>

            <Button
              type="submit"
              className="mt-2 h-10 px-5 rounded-xl font-bold text-xs bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 border-0 shadow-2xs cursor-pointer transition-transform active:scale-98"
            >
              Simpan Perubahan
            </Button>
          </form>
        </div>
      )}

      {/* Tab 2: Keamanan */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Autentikasi & Keamanan</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Perbarui kata sandi akun dan amankan sesi admin.
            </p>
          </div>

          <form onSubmit={onSavePassword} className="space-y-4 max-w-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Kata Sandi Lama</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Kata Sandi Baru</label>
              <Input
                type="password"
                placeholder="Minimal 8 karakter"
                className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Konfirmasi Kata Sandi Baru</label>
              <Input
                type="password"
                placeholder="Ulangi kata sandi baru"
                className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs"
              />
            </div>

            <Button
              type="submit"
              className="mt-2 h-10 px-5 rounded-xl font-bold text-xs bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 border-0 shadow-2xs cursor-pointer transition-transform active:scale-98"
            >
              Perbarui Kata Sandi
            </Button>
          </form>
        </div>
      )}

      {/* Tab 3: Status Layanan */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Status Layanan & Konektivitas</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Informasi status infrastruktur REST API backend, PostgreSQL database, dan object
              storage R2.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Go REST API (Fiber)
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">Status: Online (200 OK)</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                PostgreSQL DB
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Status: Connected & Migrated
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Cloudflare R2 Storage
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">Status: S3 Bucket Active</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsContent;
