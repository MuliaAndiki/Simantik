import {
  AlertCircle,
  AlertTriangle,
  Check,
  GraduationCap,
  Info,
  Lock,
  Mail,
  PlusCircle,
  RotateCcw,
  User,
} from 'lucide-react';
import type * as React from 'react';
import { Button, Card, Input } from '@/components/atoms';
import {
  type SchoolOption,
  SchoolSearchSelect,
} from '@/components/molecules/auth/SchoolSearchSelect';
import { MySchoolSubmissionBanner } from '@/components/molecules/school/MySchoolSubmissionBanner';
import type { SchoolResponse } from '@/types/service';
import { cn } from '@/utils/classname';
import { type SchoolLevelFilterValue, toSelectableSchoolItem } from '@/utils/school-picker.util';

export interface ProfileSchoolOption {
  id: string;
  name: string;
}

export interface ProfileSchoolPickerProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchFocus?: () => void;
  showDropdown?: boolean;
  onDismissDropdown?: () => void;
  jenjangFilter: SchoolLevelFilterValue;
  onJenjangFilterChange: (value: SchoolLevelFilterValue) => void;
  schools: SchoolOption[];
  loading: boolean;
  selected: SchoolOption | null;
  onSelect: (school: SchoolOption) => void;
  onClear: () => void;
  error?: string;
  hasNoSchool?: boolean;
  jenjangNotice?: {
    previousLabel?: string;
    nextLabel: string;
    isChangingJenjang: boolean;
  } | null;
}

export interface ProfilePersonalInfoCardProps {
  fullName: string;
  onFullNameChange: (val: string) => void;
  email: string;
  schoolName: string;
  onSchoolNameChange?: (val: string) => void;
  schoolOptions?: ProfileSchoolOption[];
  selectedSchoolId?: string;
  onSelectSchoolId?: (schoolId: string) => void;
  schoolPickerProps?: ProfileSchoolPickerProps;
  onOpenProposeSchool?: () => void;
  mySchoolSubmissions?: SchoolResponse[];
  onResubmitSchool?: (school: SchoolResponse) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isSubmitting?: boolean;
  isDirty?: boolean;
  versionCode?: string;
  className?: string;
}

export function ProfilePersonalInfoCard({
  fullName,
  onFullNameChange,
  email,
  schoolName,
  onSchoolNameChange,
  schoolOptions,
  selectedSchoolId,
  onSelectSchoolId,
  schoolPickerProps,
  onOpenProposeSchool,
  mySchoolSubmissions,
  onResubmitSchool,
  onSubmit,
  onReset,
  isSubmitting = false,
  isDirty = false,
  versionCode = '2025.1-SIM',
  className,
}: ProfilePersonalInfoCardProps) {
  const latestSubmission = mySchoolSubmissions?.[0];
  const canQuickSelectLatest =
    Boolean(latestSubmission) &&
    latestSubmission?.verificationStatus === 'pending' &&
    latestSubmission.id !== schoolPickerProps?.selected?.id &&
    latestSubmission.id !== selectedSchoolId;

  return (
    <Card
      className={cn(
        'p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-gray-200/80 bg-white shadow-xs space-y-6',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-2 border-b border-gray-100">
        <div className="size-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100/60">
          <User className="size-5 text-teal-600 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
            Informasi Pribadi
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
            Perbarui data profil siswa yang terdaftar di SIMANTIK.
          </p>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Full Name Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="profile-full-name"
            className="block text-xs sm:text-sm font-semibold text-gray-700"
          >
            Nama Lengkap
          </label>
          <div className="relative">
            <Input
              id="profile-full-name"
              type="text"
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="pr-10 h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-teal-500/30 text-gray-900"
              required
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <User className="size-4.5" />
            </div>
          </div>
        </div>

        {/* Email Field (Official Account Email) */}
        <div className="space-y-1.5">
          <label
            htmlFor="profile-email"
            className="block text-xs sm:text-sm font-semibold text-gray-700"
          >
            Email
          </label>
          <div className="relative">
            <Input
              id="profile-email"
              type="email"
              value={email}
              readOnly
              aria-readonly="true"
              className="pr-10 h-11 rounded-xl border-gray-200 bg-gray-50/60 text-sm text-gray-800 cursor-not-allowed select-text"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <Mail className="size-4.5" />
            </div>
          </div>
        </div>

        {/* School Field */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="profile-school"
              className="block text-xs sm:text-sm font-semibold text-gray-700"
            >
              Sekolah
            </label>
            {schoolPickerProps?.hasNoSchool && !schoolPickerProps.selected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                <AlertCircle className="size-3" />
                Belum memilih sekolah
              </span>
            )}
          </div>

          {schoolPickerProps ? (
            <div className="space-y-2">
              {schoolPickerProps.hasNoSchool && !schoolPickerProps.selected && (
                <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 leading-relaxed">
                  Filter berdasarkan jenjang atau ketik nama/NPSN sekolahmu di bawah. Jika sekolahmu
                  belum terdaftar, klik{' '}
                  <span className="font-semibold text-teal-700">Ajukan Sekolah Baru</span>.
                </p>
              )}
              <SchoolSearchSelect
                id="profile-school"
                search={schoolPickerProps.search}
                onSearchChange={schoolPickerProps.onSearchChange}
                onSearchFocus={schoolPickerProps.onSearchFocus}
                showDropdown={schoolPickerProps.showDropdown}
                onDismissDropdown={schoolPickerProps.onDismissDropdown}
                jenjangFilter={schoolPickerProps.jenjangFilter}
                onJenjangFilterChange={schoolPickerProps.onJenjangFilterChange}
                schools={schoolPickerProps.schools}
                loading={schoolPickerProps.loading}
                selected={schoolPickerProps.selected}
                onSelect={schoolPickerProps.onSelect}
                onClear={schoolPickerProps.onClear}
                onRequestNewSchool={onOpenProposeSchool ? () => onOpenProposeSchool() : undefined}
                alwaysShowProposeCta
                proposeLabel="Ajukan Sekolah Baru"
                placeholder="Cari nama sekolah atau NPSN..."
                error={schoolPickerProps.error}
                disabled={isSubmitting}
              />

              {schoolPickerProps.jenjangNotice?.isChangingJenjang &&
                schoolPickerProps.jenjangNotice.previousLabel && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/90 px-3.5 py-2.5 text-xs text-amber-900"
                  >
                    <AlertTriangle className="size-4.5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 leading-relaxed">
                      <p className="font-semibold text-amber-950">
                        Peringatan Perubahan Jenjang (
                        {schoolPickerProps.jenjangNotice.previousLabel} &rarr;{' '}
                        {schoolPickerProps.jenjangNotice.nextLabel})
                      </p>
                      <p className="text-amber-800">
                        Sekolah baru berada pada jenjang{' '}
                        <strong>{schoolPickerProps.jenjangNotice.nextLabel}</strong>.{' '}
                        <strong>Materi Belajar</strong>, <strong>Soal Latihan</strong>, dan{' '}
                        <strong>Tryout</strong> akan otomatis disesuaikan dengan jenjang{' '}
                        <strong>{schoolPickerProps.jenjangNotice.nextLabel}</strong>.
                      </p>
                    </div>
                  </div>
                )}

              {schoolPickerProps.jenjangNotice &&
                !schoolPickerProps.jenjangNotice.isChangingJenjang &&
                schoolPickerProps.jenjangNotice.nextLabel && (
                  <div
                    role="status"
                    className="flex items-start gap-2.5 rounded-xl border border-sky-200 bg-sky-50/80 px-3.5 py-2.5 text-xs text-sky-900 leading-relaxed"
                  >
                    <Info className="size-4 text-sky-600 shrink-0 mt-0.5" />
                    <p>
                      Sekolah yang dipilih berjenjang{' '}
                      <strong>{schoolPickerProps.jenjangNotice.nextLabel}</strong>.{' '}
                      <strong>Materi Belajar</strong>, <strong>Soal Latihan</strong>, dan{' '}
                      <strong>Tryout</strong> akan otomatis disesuaikan dengan jenjang{' '}
                      <strong>{schoolPickerProps.jenjangNotice.nextLabel}</strong>.
                    </p>
                  </div>
                )}
            </div>
          ) : (
            <>
              <div className="relative">
                {schoolOptions && schoolOptions.length > 0 && onSelectSchoolId ? (
                  <select
                    id="profile-school"
                    value={
                      selectedSchoolId ||
                      schoolOptions.find(
                        (s) => s.name.toLowerCase() === (schoolName ?? '').toLowerCase()
                      )?.id ||
                      ''
                    }
                    onChange={(e) => onSelectSchoolId(e.target.value)}
                    className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 pr-10 text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Pilih asal sekolah
                    </option>
                    {schoolOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id="profile-school"
                    type="text"
                    value={schoolName}
                    onChange={(e) => onSchoolNameChange?.(e.target.value)}
                    placeholder="Nama sekolah asal"
                    className="pr-10 h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-teal-500/30 text-gray-900"
                  />
                )}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                  <GraduationCap className="size-4.5" />
                </div>
              </div>
              {onOpenProposeSchool && (
                <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                  <span>Sekolah tidak ada di daftar?</span>
                  <button
                    type="button"
                    onClick={onOpenProposeSchool}
                    className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-800 underline underline-offset-4 cursor-pointer"
                  >
                    <PlusCircle className="size-3.5" />
                    Ajukan Sekolah Baru
                  </button>
                </div>
              )}
            </>
          )}

          {mySchoolSubmissions && mySchoolSubmissions.length > 0 && (
            <div className="pt-1.5">
              <MySchoolSubmissionBanner
                submissions={mySchoolSubmissions}
                onSelectSubmission={
                  canQuickSelectLatest
                    ? (s) => {
                        if (schoolPickerProps) {
                          schoolPickerProps.onSelect(toSelectableSchoolItem(s));
                        } else {
                          onSelectSchoolId?.(s.id);
                        }
                      }
                    : undefined
                }
                onResubmit={onResubmitSchool}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            isLoading={isSubmitting}
            className="h-11 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold text-sm px-6 gap-2 shadow-xs cursor-pointer transition-colors disabled:opacity-50"
          >
            {!isSubmitting && <Check className="size-4 stroke-[2.5]" />}
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            disabled={isSubmitting || !isDirty}
            className="h-11 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-5 cursor-pointer transition-colors disabled:opacity-40"
          >
            <RotateCcw className="size-3.5 sm:hidden" />
            <span>Batal</span>
          </Button>
        </div>
      </form>

      {/* Card Footer Security & Version Metadata */}
      <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Lock className="size-3.5 text-gray-400 stroke-[2.2]" />
          <span>Data akun dilindungi enkripsi privasi siswa.</span>
        </div>
        <div className="font-mono text-[11px] text-gray-400 font-medium tracking-wider">
          VER: {versionCode}
        </div>
      </div>
    </Card>
  );
}

export default ProfilePersonalInfoCard;
