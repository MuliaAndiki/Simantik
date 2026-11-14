'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { SchoolOption } from '@/components/molecules/auth/SchoolSearchSelect';
import { SchoolOnboardingPage } from '@/components/page/onboarding/SchoolOnboardingPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import { useDebounce } from '@/hooks/useDebounce/useDebounce';
import type { SchoolResponse } from '@/types/service';
import {
  buildProposeSchoolHref,
  mergeSelectableSchools,
  type SchoolLevelFilterValue,
  toSelectableSchoolItem,
} from '@/utils/school-picker.util';
import { clearSchoolSkipInStorage, markSchoolSkippedInStorage } from '@/utils/school-skip.util';
import { getAccessToken } from '@/utils/session-cookie';

const SCHOOL_SEARCH_DEBOUNCE_MS = 350;

export default function ContainerPilihSekolah() {
  const router = useRouter();
  const api = useApi();
  const ns = useAppNameSpace();
  const updateMySchool = api.user.mutate.updateMySchool();

  const [hasAuth, setHasAuth] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [jenjangFilter, setJenjangFilter] = useState<SchoolLevelFilterValue>('all');
  const [selectedSchool, setSelectedSchool] = useState<SchoolOption | null>(null);
  const [error, setError] = useState<string>();
  const debouncedSearch = useDebounce(schoolSearch, SCHOOL_SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setHasAuth(Boolean(getAccessToken()));
  }, []);

  const meQuery = api.user.query.me({ enabled: hasAuth });
  const mySubmissionsQuery = api.school.query.mySubmissions({ enabled: hasAuth });

  const schoolQuery = api.school.query.listPublic({
    search: debouncedSearch.trim() || undefined,
    jenjang: jenjangFilter === 'all' ? undefined : jenjangFilter,
    limit: 20,
  });

  const schoolOptions: SchoolOption[] = useMemo(
    () =>
      mergeSelectableSchools(schoolQuery.data?.schools, mySubmissionsQuery.data ?? undefined, {
        search: debouncedSearch,
        jenjang: jenjangFilter,
      }),
    [debouncedSearch, jenjangFilter, mySubmissionsQuery.data, schoolQuery.data?.schools]
  );

  const handleSchoolSearchChange = (search: string) => {
    setSchoolSearch(search);
  };

  const handleJenjangFilterChange = (nextJenjang: SchoolLevelFilterValue) => {
    setJenjangFilter(nextJenjang);
  };

  const handleSchoolSelect = (school: SchoolOption) => {
    setSelectedSchool(school);
    setError(undefined);
  };

  const handleSchoolClear = () => {
    setSelectedSchool(null);
  };

  const handleNavigateToProposal = (seed?: string | SchoolResponse) => {
    if (!getAccessToken()) {
      ns.alert.toast({
        title: 'Perlu Login',
        message: 'Silakan masuk ke akun Anda terlebih dahulu untuk mengajukan sekolah baru.',
        icon: 'warning',
      });
      router.push('/login');
      return;
    }

    if (seed && typeof seed !== 'string') {
      router.push(buildProposeSchoolHref({ resubmitId: seed.id }));
      return;
    }

    router.push(
      buildProposeSchoolHref({
        query: typeof seed === 'string' ? seed : schoolSearch,
        jenjang: jenjangFilter,
      })
    );
  };

  const handleSkip = () => {
    if (!getAccessToken()) {
      router.replace('/home');
      return;
    }

    if (meQuery.data?.id) {
      markSchoolSkippedInStorage(meQuery.data.id);
    }
    router.replace('/home');
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
          clearSchoolSkipInStorage(meQuery.data?.id);
          router.replace('/home');
        },
      }
    );
  };

  return (
    <SchoolOnboardingPage
      schoolSearch={schoolSearch}
      onSchoolSearchChange={handleSchoolSearchChange}
      jenjangFilter={jenjangFilter}
      onJenjangFilterChange={handleJenjangFilterChange}
      schoolOptions={schoolOptions}
      schoolLoading={schoolQuery.isFetching}
      selectedSchool={selectedSchool}
      onSchoolSelect={handleSchoolSelect}
      onSchoolClear={handleSchoolClear}
      onRequestNewSchool={handleNavigateToProposal}
      mySubmissions={mySubmissionsQuery.data ?? undefined}
      onSelectSubmission={(school) => {
        if (school.verificationStatus === 'rejected') {
          handleNavigateToProposal(school);
          return;
        }
        handleSchoolSelect(toSelectableSchoolItem(school));
      }}
      onResubmitSubmission={handleNavigateToProposal}
      onSkip={handleSkip}
      onSubmit={handleSubmit}
      loading={updateMySchool.isPending}
      error={error}
    />
  );
}
