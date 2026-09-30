import { FileText, Lock, Server, ShieldCheck, User } from 'lucide-react';
import type React from 'react';
import { Button, Input } from '@/components/atoms';
import {
  type PasswordFormState,
  ProfileSettingsPanel,
  SecuritySettingsPanel,
  SettingsShell,
} from '@/components/organisms/settings';
import type { AdminAuditLogItem } from '@/types/service';
import { AdminDashboardRecentActivities } from './AdminDashboardRecentActivities';

export type AdminSettingsTab = 'profile' | 'security' | 'system' | 'logs';

export interface AdminSettingsContentProps {
  activeTab: AdminSettingsTab;
  onActiveTabChange: (tab: AdminSettingsTab) => void;
  fullName: string;
  email: string;
  onFullNameChange: (name: string) => void;
  onSaveProfile: (e: React.FormEvent) => void;
  passwordForm: PasswordFormState;
  passwordError?: string | null;
  isSubmittingPassword?: boolean;
  onPasswordFieldChange: <K extends keyof PasswordFormState>(
    field: K,
    value: PasswordFormState[K]
  ) => void;
  onSubmitPassword: () => void;
  isSavingProfile?: boolean;
  className?: string;
  auditLogs?: AdminAuditLogItem[];
}

export const AdminSettingsContent: React.FC<AdminSettingsContentProps> = ({
  activeTab,
  onActiveTabChange,
  fullName,
  email,
  onFullNameChange,
  onSaveProfile,
  passwordForm,
  passwordError,
  isSubmittingPassword = false,
  onPasswordFieldChange,
  onSubmitPassword,
  isSavingProfile = false,
  className,
  auditLogs,
}) => {
  return (
    <SettingsShell
      kicker="Konfigurasi Platform"
      title="Pengaturan Admin & Sistem"
      description="Konfigurasi profil administrator, hak akses, integrasi platform, dan keamanan SIMANTIK."
      roleBadge={
        <>
          <ShieldCheck className="size-3.5" />
          Role: Super Admin
        </>
      }
      tabs={[
        { id: 'profile', label: 'Profil Admin', icon: User },
        { id: 'security', label: 'Keamanan & Sandi', icon: Lock },
        { id: 'system', label: 'Status Layanan & API', icon: Server },
        { id: 'logs', label: 'Sistem Log Web', icon: FileText },
      ]}
      activeTab={activeTab}
      onActiveTabChange={(tab) => onActiveTabChange(tab as AdminSettingsTab)}
      className={className}
    >
      {/* Tab 1: Profil Admin */}
      {activeTab === 'profile' && (
        <ProfileSettingsPanel
          title="Informasi Akun Administrator"
          description="Data identitas ini digunakan pada seluruh catatan audit log dan penerbitan kurikulum."
          fullName={fullName}
          email={email}
          emailNote="Email super admin hanya dapat diubah melalui konfigurasi root environment."
          isSaving={isSavingProfile}
          onFullNameChange={onFullNameChange}
          onSaveProfile={onSaveProfile}
        />
      )}

      {/* Tab 2: Keamanan */}
      {activeTab === 'security' && (
        <SecuritySettingsPanel
          form={passwordForm}
          error={passwordError}
          isSubmitting={isSubmittingPassword}
          onFieldChange={onPasswordFieldChange}
          onSubmitPassword={onSubmitPassword}
        />
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

      {/* Tab 4: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 md:p-8 space-y-6">
          <AdminDashboardRecentActivities
            activities={auditLogs}
            className="border-0 shadow-none p-0"
          />
        </div>
      )}
    </SettingsShell>
  );
};

export default AdminSettingsContent;
