'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SchoolProposalPage } from '@/components/page/onboarding/SchoolProposalPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import { useSchoolMapForm } from '@/hooks/useService/school/useSchoolMapForm';
import type { SchoolResponse } from '@/types/service';
import {
  buildSchoolProposalInitialForm,
  normalizeSchoolLevelParam,
  validateProposeSchoolForm,
} from '@/utils/school-proposal.util';
import { clearSchoolSkipInStorage } from '@/utils/school-skip.util';
import { getAccessToken } from '@/utils/session-cookie';

function resolveSafeReturnTo(raw: string | null): string {
  if (!raw?.startsWith('/') || raw.startsWith('//')) {
    return '/home';
  }
  return raw;
}

export default function ContainerAjukanSekolah() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const api = useApi();
  const ns = useAppNameSpace();

  const initialQ = searchParams.get('q')?.trim() ?? '';
  const initialJenjang = normalizeSchoolLevelParam(searchParams.get('jenjang'));
  const resubmitId = searchParams.get('resubmit')?.trim() ?? '';
  const returnTo = resolveSafeReturnTo(searchParams.get('returnTo'));
  const backHref = returnTo !== '/home' ? returnTo : '/pilih-sekolah';
  const backLabel = returnTo !== '/home' ? 'Kembali' : 'Kembali ke Pilih Sekolah';

  const [hasAuth, setHasAuth] = useState(false);

  const hydratedResubmitRef = useRef<string | null>(null);
  const missingResubmitToastRef = useRef<string | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      ns.alert.toast({
        title: 'Perlu Login',
        message: 'Silakan masuk ke akun Anda terlebih dahulu untuk mengajukan sekolah baru.',
        icon: 'warning',
      });
      router.replace('/login');
      return;
    }
    setHasAuth(true);
  }, [ns.alert, router]);

  const { formData, setErrors, hydrateForm, mapProps, geoFormProps } = useSchoolMapForm({
    initialSearch: initialQ,
    initialJenjang,
    enabled: hasAuth,
  });

  const meQuery = api.user.query.me({ enabled: hasAuth });
  const mySubmissionsQuery = api.school.query.mySubmissions({
    enabled: hasAuth && Boolean(resubmitId),
  });

  const targetResubmission: SchoolResponse | undefined = useMemo(() => {
    if (!resubmitId || !mySubmissionsQuery.data) return undefined;
    return mySubmissionsQuery.data.find((item) => item.id === resubmitId);
  }, [mySubmissionsQuery.data, resubmitId]);

  useEffect(() => {
    if (!resubmitId || !targetResubmission) return;
    if (hydratedResubmitRef.current === targetResubmission.id) return;

    hydratedResubmitRef.current = targetResubmission.id;
    hydrateForm(buildSchoolProposalInitialForm(targetResubmission), {
      searchValue: targetResubmission.nama || '',
    });
  }, [hydrateForm, resubmitId, targetResubmission]);

  useEffect(() => {
    if (!resubmitId || !hasAuth) return;
    if (mySubmissionsQuery.isLoading || mySubmissionsQuery.isFetching) return;
    if (!targetResubmission && missingResubmitToastRef.current !== resubmitId) {
      missingResubmitToastRef.current = resubmitId;
      ns.alert.toast({
        title: 'Data tidak ditemukan',
        message: 'Pengajuan sebelumnya tidak ditemukan. Silakan ajukan sekolah baru.',
        icon: 'warning',
      });
    }
  }, [
    hasAuth,
    mySubmissionsQuery.isFetching,
    mySubmissionsQuery.isLoading,
    ns.alert,
    resubmitId,
    targetResubmission,
  ]);

  const proposeSchool = api.school.mutate.propose();
  const updateMySchool = api.user.mutate.updateMySchool();

  const handleSubmit = async () => {
    const { data, errors: validationErrors } = validateProposeSchoolForm(formData);
    if (validationErrors || !data) {
      setErrors(validationErrors ?? {});
      const firstError = Object.values(validationErrors ?? {}).find(Boolean);
      if (firstError) {
        ns.alert.toast({
          title: 'Lengkapi data sekolah',
          message: firstError,
          icon: 'warning',
        });
      }
      return;
    }

    try {
      const proposeRes = await proposeSchool.mutateAsync(data);
      const createdSchoolId = proposeRes.data?.id;

      if (createdSchoolId) {
        try {
          await updateMySchool.mutateAsync({ schoolId: createdSchoolId });
          clearSchoolSkipInStorage(meQuery.data?.id);
          router.replace(returnTo);
          return;
        } catch {
          ns.alert.toast({
            title: 'Sekolah tersimpan',
            message:
              'Sekolah berhasil diajukan. Silakan pilih sekolah Anda di halaman Pilih Sekolah.',
            icon: 'info',
          });
          router.replace('/pilih-sekolah');
          return;
        }
      }

      router.replace(backHref);
    } catch {
      // Error toast ditangani oleh useAppMutation
    }
  };

  return (
    <SchoolProposalPage
      backHref={backHref}
      backLabel={backLabel}
      isResubmit={Boolean(resubmitId)}
      isLoadingInitial={
        Boolean(resubmitId) && (!hasAuth || mySubmissionsQuery.isLoading) && !targetResubmission
      }
      mapProps={mapProps}
      formProps={{
        ...geoFormProps,
        rejectionReason: targetResubmission?.rejectionReason,
        isSubmitting: proposeSchool.isPending || updateMySchool.isPending,
        onSubmit: handleSubmit,
        onCancel: () => router.push(backHref),
        cancelLabel: backLabel,
      }}
    />
  );
}
