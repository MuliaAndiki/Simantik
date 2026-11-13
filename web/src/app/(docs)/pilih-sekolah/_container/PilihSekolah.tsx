'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { SchoolOption } from '@/components/molecules/auth/SchoolSearchSelect';
import { SchoolOnboardingPage } from '@/components/page/onboarding/SchoolOnboardingPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import { useDebounce } from '@/hooks/useDebounce/useDebounce';
import type { SchoolResponse } from '@/types/service';
import { markSchoolSkippedInStorage } from '@/utils/school-skip.util';
import { getAccessToken } from '@/utils/session-cookie';

const SCHOOL_SEARCH_DEBOUNCE_MS = 800;

function toSchoolOption(school: SchoolResponse): SchoolOption {
  return {
    id: school.id,
    nama: school.nama,
    npsn: school.npsn,
    jenjang: school.jenjang,
    verificationStatus: school.verificationStatus,
  };
}

export default function ContainerPilihSekolah() {
  const router = useRouter();
  const api = useApi();
  const ns = useAppNameSpace();
  const updateMySchool = api.user.mutate.updateMySchool();

  const [hasAuth, setHasAuth] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState('');
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
    limit: 20,
  });
  const schoolOptions: SchoolOption[] = schoolQuery.data?.schools.map(toSchoolOption) ?? [];

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
      router.push(`/pilih-sekolah/ajukan?resubmit=${encodeURIComponent(seed.id)}`);
      return;
    }

    const qParam =
      typeof seed === 'string' && seed.trim() ? `?q=${encodeURIComponent(seed.trim())}` : '';
    router.push(`/pilih-sekolah/ajukan${qParam}`);
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
      onRequestNewSchool={handleNavigateToProposal}
      mySubmissions={mySubmissionsQuery.data ?? undefined}
      onSelectSubmission={(school) => {
        if (school.verificationStatus === 'rejected') {
          handleNavigateToProposal(school);
          return;
        }
        handleSchoolSelect(toSchoolOption(school));
      }}
      onResubmitSubmission={handleNavigateToProposal}
      onSkip={handleSkip}
      onSubmit={handleSubmit}
      loading={updateMySchool.isPending}
      error={error}
    />
  );
}
