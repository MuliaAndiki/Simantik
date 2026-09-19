'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SchoolOption } from '@/components/molecules/auth/SchoolSearchSelect';
import { SchoolOnboardingPage } from '@/components/page/onboarding/SchoolOnboardingPage';
import { useApi } from '@/hooks/useApi';
import { useDebounce } from '@/hooks/useDebounce/useDebounce';

const SCHOOL_SEARCH_DEBOUNCE_MS = 1500;

export default function ContainerPilihSekolah() {
  const router = useRouter();
  const api = useApi();
  const updateMySchool = api.user.mutate.updateMySchool();

  const [schoolSearch, setSchoolSearch] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<SchoolOption | null>(null);
  const [error, setError] = useState<string>();
  const debouncedSearch = useDebounce(schoolSearch, SCHOOL_SEARCH_DEBOUNCE_MS);

  const schoolQuery = api.school.query.listPublic({
    search: debouncedSearch.trim() || undefined,
    limit: 20,
  });
  const schoolOptions: SchoolOption[] =
    schoolQuery.data?.schools.map((s) => ({
      id: s.id,
      nama: s.nama,
      npsn: s.npsn,
      jenjang: s.jenjang,
    })) ?? [];

  const handleSchoolSearchChange = (search: string) => {
    setSchoolSearch(search);
  };

  const handleSchoolSelect = (school: SchoolOption) => {
    setSelectedSchool(school);
    setError(undefined);
  };

  const handleSchoolClear = () => {
    setSelectedSchool(null);
  };

  const handleSubmit = () => {
    if (!selectedSchool) {
      setError('Sekolah wajib dipilih');
      return;
    }
    setError(undefined);

    updateMySchool.mutate(
      { schoolId: selectedSchool.id },
      {
        onSuccess: () => {
          router.replace('/home');
        },
      }
    );
  };

  return (
    <SchoolOnboardingPage
      schoolSearch={schoolSearch}
      onSchoolSearchChange={handleSchoolSearchChange}
      schoolOptions={schoolOptions}
      schoolLoading={schoolQuery.isFetching}
      selectedSchool={selectedSchool}
      onSchoolSelect={handleSchoolSelect}
      onSchoolClear={handleSchoolClear}
      onSubmit={handleSubmit}
      loading={updateMySchool.isPending}
      error={error}
    />
  );
}
