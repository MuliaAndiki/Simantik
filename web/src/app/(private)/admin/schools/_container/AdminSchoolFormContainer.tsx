'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { AdminSchoolFormPage } from '@/components/page/private/admin/AdminSchoolFormPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import { useSchoolMapForm } from '@/hooks/useService/school/useSchoolMapForm';
import {
  buildSchoolProposalInitialForm,
  validateAdminSchoolForm,
} from '@/utils/school-proposal.util';

export interface AdminSchoolFormContainerProps {
  mode: 'create' | 'edit';
  schoolId?: string;
}

export function AdminSchoolFormContainer({ mode, schoolId = '' }: AdminSchoolFormContainerProps) {
  const router = useRouter();
  const api = useApi();
  const ns = useAppNameSpace();

  const isEdit = mode === 'edit';
  const hydratedVersionRef = useRef<string | null>(null);

  const detailQuery = api.school.query.detail(schoolId, {
    enabled: isEdit && Boolean(schoolId),
  });

  const { formData, setErrors, hydrateForm, clearCoordinates, mapProps, geoFormProps } =
    useSchoolMapForm({
      enabled: true,
    });

  useEffect(() => {
    if (!isEdit || !detailQuery.data) return;

    const school = detailQuery.data;
    const versionKey = `${school.id}:${school.updatedAt}`;
    if (hydratedVersionRef.current === versionKey) return;

    hydratedVersionRef.current = versionKey;
    hydrateForm(buildSchoolProposalInitialForm(school), {
      searchValue: school.nama || '',
    });
  }, [detailQuery.data, hydrateForm, isEdit]);

  const createMutation = api.school.mutate.create();
  const updateMutation = api.school.mutate.update();

  const handleSubmit = async () => {
    const { data, errors: validationErrors } = validateAdminSchoolForm(formData);
    if (validationErrors || !data) {
      setErrors(validationErrors ?? {});
      const firstError = Object.values(validationErrors ?? {}).find(Boolean);
      if (firstError) {
        ns.alert.toast({
          title: 'Form Belum Lengkap',
          message: firstError,
          icon: 'warning',
        });
      }
      return;
    }

    try {
      if (isEdit && schoolId) {
        await updateMutation.mutateAsync({
          id: schoolId,
          body: {
            ...data,
            provinsi: formData.provinsi.trim(),
            kabupaten: formData.kabupaten.trim(),
            kecamatan: formData.kecamatan.trim(),
          },
        });
      } else {
        await createMutation.mutateAsync(data);
      }

      router.push('/admin/schools');
    } catch {
      // Toast ditangani oleh useAppMutation
    }
  };

  const isLoadingInitial = isEdit && detailQuery.isLoading && !detailQuery.data;
  const isNotFound =
    isEdit &&
    (!schoolId || (!detailQuery.isLoading && !detailQuery.isFetching && !detailQuery.data));

  return (
    <AdminSchoolFormPage
      mode={mode}
      backHref="/admin/schools"
      isLoadingInitial={isLoadingInitial}
      isNotFound={isNotFound}
      mapProps={mapProps}
      formProps={{
        ...geoFormProps,
        onClearCoordinates: clearCoordinates,
        isSubmitting: createMutation.isPending || updateMutation.isPending,
        onSubmit: handleSubmit,
        onCancel: () => router.push('/admin/schools'),
      }}
    />
  );
}

export default AdminSchoolFormContainer;
