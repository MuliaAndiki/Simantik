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

  const schoolQuery = api.school.query.list({
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
      onSchoolSearchChange={setSchoolSearch}
      schoolOptions={schoolOptions}
      schoolLoading={schoolQuery.isFetching}
      selectedSchool={selectedSchool}
      onSchoolSelect={(school) => {
        setSelectedSchool(school);
        setError(undefined);
      }}
      onSchoolClear={() => setSelectedSchool(null)}
      onSubmit={handleSubmit}
      loading={updateMySchool.isPending}
      error={error}
    />
  );
}
