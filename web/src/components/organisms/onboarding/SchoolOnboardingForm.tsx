import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { FormField } from '@/components/molecules/auth/FormField';
import {
  type SchoolOption,
  SchoolSearchSelect,
} from '@/components/molecules/auth/SchoolSearchSelect';
import { MySchoolSubmissionBanner } from '@/components/molecules/school/MySchoolSubmissionBanner';
import type { SchoolResponse } from '@/types/service';

export interface SchoolOnboardingFormProps {
  schoolSearch: string;
  onSchoolSearchChange: (value: string) => void;
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
          schools={schoolOptions}
          loading={schoolLoading}
          selected={selectedSchool}
          onSelect={onSchoolSelect}
          onClear={onSchoolClear}
          onRequestNewSchool={onRequestNewSchool}
          disabled={loading}
        />
      </FormField>

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
