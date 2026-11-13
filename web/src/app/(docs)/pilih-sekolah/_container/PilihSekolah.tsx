'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SchoolOption } from '@/components/molecules/auth/SchoolSearchSelect';
import type {
  SchoolFormErrors,
  SchoolFormState,
} from '@/components/molecules/school/SchoolFormFields';
import { SchoolOnboardingPage } from '@/components/page/onboarding/SchoolOnboardingPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import { useDebounce } from '@/hooks/useDebounce/useDebounce';
import type { SchoolResponse } from '@/types/service';
import {
  buildSchoolProposalInitialForm,
  EMPTY_SCHOOL_FORM,
  validateProposeSchoolForm,
} from '@/utils/school-proposal.util';
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
  const proposeSchool = api.school.mutate.propose();

  const [schoolSearch, setSchoolSearch] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<SchoolOption | null>(null);
  const [error, setError] = useState<string>();
  const debouncedSearch = useDebounce(schoolSearch, SCHOOL_SEARCH_DEBOUNCE_MS);

  // Proposal dialog state
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [proposalForm, setProposalForm] = useState<SchoolFormState>(EMPTY_SCHOOL_FORM);
  const [proposalErrors, setProposalErrors] = useState<SchoolFormErrors>({});

  const hasAuth = !!getAccessToken();
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

  const handleOpenProposalDialog = (seed?: string | SchoolResponse) => {
    if (!getAccessToken()) {
      ns.alert.toast({
        title: 'Perlu Login',
        message: 'Silakan masuk ke akun Anda terlebih dahulu untuk mengajukan sekolah baru.',
        icon: 'warning',
      });
      router.push('/login');
      return;
    }

    setProposalForm(buildSchoolProposalInitialForm(seed));
    setProposalErrors({});
    setIsProposalOpen(true);
  };

  const handleProposalFieldChange = <K extends keyof SchoolFormState>(
    field: K,
    value: SchoolFormState[K]
  ) => {
    setProposalForm((prev) => ({ ...prev, [field]: value }));
    setProposalErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, errors } = validateProposeSchoolForm(proposalForm);
    if (errors || !data) {
      setProposalErrors(errors ?? {});
      return;
    }

    try {
      const res = await proposeSchool.mutateAsync(data);
      if (res.data) {
        setSelectedSchool(toSchoolOption(res.data));
        setError(undefined);
      }
      setIsProposalOpen(false);
    } catch {
      // Error toast ditangani oleh useAppMutation
    }
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
      onRequestNewSchool={handleOpenProposalDialog}
      mySubmissions={mySubmissionsQuery.data ?? undefined}
      onSelectSubmission={(school) => {
        if (school.verificationStatus === 'rejected') {
          handleOpenProposalDialog(school);
          return;
        }
        handleSchoolSelect(toSchoolOption(school));
      }}
      onResubmitSubmission={handleOpenProposalDialog}
      proposalDialogProps={{
        open: isProposalOpen,
        onOpenChange: setIsProposalOpen,
        formData: proposalForm,
        errors: proposalErrors,
        onChange: handleProposalFieldChange,
        onSubmit: handleSubmitProposal,
        isSubmitting: proposeSchool.isPending,
      }}
      onSubmit={handleSubmit}
      loading={updateMySchool.isPending}
      error={error}
    />
  );
}
