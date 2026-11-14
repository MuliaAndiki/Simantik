import { Info } from 'lucide-react';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { FormField } from '@/components/molecules/auth/FormField';
import {
  type SchoolOption,
  SchoolSearchSelect,
} from '@/components/molecules/auth/SchoolSearchSelect';
import { MySchoolSubmissionBanner } from '@/components/molecules/school/MySchoolSubmissionBanner';
import type { SchoolResponse } from '@/types/service';
import { cn } from '@/utils/classname';
import { formatSchoolLevelLabel, type SchoolLevelFilterValue } from '@/utils/school-picker.util';

export interface SchoolOnboardingFormProps {
  schoolSearch: string;
  onSchoolSearchChange: (value: string) => void;
  jenjangFilter?: SchoolLevelFilterValue;
  onJenjangFilterChange?: (value: SchoolLevelFilterValue) => void;
  schoolOptions: SchoolOption[];
  schoolLoading: boolean;
  selectedSchool: SchoolOption | null;
  onSchoolSelect: (school: SchoolOption) => void;
  onSchoolClear: () => void;
  onRequestNewSchool?: (initialSearch?: string) => void;
  mySubmissions?: SchoolResponse[];
  onSelectSubmission?: (school: SchoolResponse) => void;
  onResubmitSubmission?: (school: SchoolResponse) => void;
  onSkip?: () => void;
  onSubmit: (e?: React.FormEvent) => void;
  loading?: boolean;
  error?: string;
}

export function SchoolOnboardingForm({
  schoolSearch,
  onSchoolSearchChange,
  jenjangFilter = 'all',
  onJenjangFilterChange,
  schoolOptions,
  schoolLoading,
  selectedSchool,
  onSchoolSelect,
  onSchoolClear,
  onRequestNewSchool,
  mySubmissions,
  onSelectSubmission,
  onResubmitSubmission,
  onSkip,
  onSubmit,
  loading = false,
  error,
}: SchoolOnboardingFormProps) {
  const selectedJenjangLabel = formatSchoolLevelLabel(selectedSchool?.jenjang);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {mySubmissions && mySubmissions.length > 0 && (
        <MySchoolSubmissionBanner
          submissions={mySubmissions}
          onSelectSubmission={onSelectSubmission}
          onResubmit={onResubmitSubmission}
        />
      )}

      <FormField id="school" label="Sekolah" error={error} required>
        <SchoolSearchSelect
          search={schoolSearch}
          onSearchChange={onSchoolSearchChange}
          jenjangFilter={jenjangFilter}
          onJenjangFilterChange={onJenjangFilterChange}
          schools={schoolOptions}
          loading={schoolLoading}
          selected={selectedSchool}
          onSelect={onSchoolSelect}
          onClear={onSchoolClear}
          onRequestNewSchool={onRequestNewSchool}
          disabled={loading}
        />
      </FormField>

      <div
        role="status"
        className={cn(
          'flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed transition-colors',
          selectedJenjangLabel
            ? 'bg-teal-50/80 border-teal-200 text-teal-900'
            : 'bg-slate-50 border-slate-200/80 text-slate-600'
        )}
      >
        <Info
          className={cn(
            'size-4 shrink-0 mt-0.5',
            selectedJenjangLabel ? 'text-teal-600' : 'text-slate-500'
          )}
        />
        {selectedJenjangLabel ? (
          <p>
            Kamu memilih sekolah jenjang <strong>{selectedJenjangLabel}</strong> &mdash;{' '}
            <strong>Materi Belajar</strong>, <strong>Soal Latihan</strong>, dan{' '}
            <strong>Tryout</strong> akan disesuaikan untuk jenjang{' '}
            <strong>{selectedJenjangLabel}</strong>.
          </p>
        ) : (
          <p>
            <strong>Materi Belajar</strong>, <strong>Soal Latihan</strong>, dan{' '}
            <strong>Tryout</strong> akan otomatis disesuaikan dengan jenjang sekolah yang kamu
            pilih.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <Button
          type="submit"
          className="w-full h-12 rounded-sm"
          disabled={!selectedSchool}
          isLoading={loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan & Lanjutkan'}
        </Button>

        {onSkip && (
          <Button
            type="button"
            variant="ghost"
            onClick={onSkip}
            disabled={loading}
            className="w-full h-10 rounded-sm text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            Lewati dulu
          </Button>
        )}
      </div>
    </form>
  );
}
