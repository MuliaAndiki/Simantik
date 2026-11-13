'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  SchoolFormErrors,
  SchoolFormState,
} from '@/components/molecules/school/SchoolFormFields';
import { SchoolProposalPage } from '@/components/page/onboarding/SchoolProposalPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import type { GeoPlace, SchoolResponse } from '@/types/service';
import {
  buildSchoolProposalInitialForm,
  EMPTY_SCHOOL_FORM,
  placeToFormPatch,
  validateProposeSchoolForm,
} from '@/utils/school-proposal.util';
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
  const resubmitId = searchParams.get('resubmit')?.trim() ?? '';
  const returnTo = resolveSafeReturnTo(searchParams.get('returnTo'));
  const backHref = returnTo !== '/home' ? returnTo : '/pilih-sekolah';
  const backLabel = returnTo !== '/home' ? 'Kembali' : 'Kembali ke Pilih Sekolah';

  const [hasAuth, setHasAuth] = useState(false);

  const [searchInput, setSearchInput] = useState(initialQ);
  const [submittedSearch, setSubmittedSearch] = useState(initialQ.length >= 3 ? initialQ : '');

  const [formData, setFormData] = useState<SchoolFormState>(() =>
    initialQ ? buildSchoolProposalInitialForm(initialQ) : EMPTY_SCHOOL_FORM
  );
  const [errors, setErrors] = useState<SchoolFormErrors>({});

  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [flyToTarget, setFlyToTarget] = useState<{
    lat: number;
    lng: number;
    zoom?: number;
  } | null>(null);
  const [reverseCoords, setReverseCoords] = useState<{ lat: number; lng: number } | null>(null);

  const hydratedResubmitRef = useRef<string | null>(null);
  const missingResubmitToastRef = useRef<string | null>(null);
  const lastFlownQueryRef = useRef<string | null>(null);
  const appliedReversePlaceRef = useRef<GeoPlace | null>(null);
  const warnedReverseKeyRef = useRef<string | null>(null);

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
    const initial = buildSchoolProposalInitialForm(targetResubmission);
    setFormData(initial);
    setErrors({});
    if (targetResubmission.nama) {
      setSearchInput(targetResubmission.nama);
    }

    if (typeof initial.latitude === 'number' && typeof initial.longitude === 'number') {
      const pos = { lat: initial.latitude, lng: initial.longitude };
      setSelectedPosition(pos);
      setFlyToTarget({ ...pos, zoom: 16 });
    }
  }, [resubmitId, targetResubmission]);

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

  const geoSearchQuery = api.geo.query.searchSchools(submittedSearch, {
    enabled: hasAuth && submittedSearch.length >= 3,
  });

  useEffect(() => {
    const results = geoSearchQuery.data;
    if (!results || results.length === 0 || !submittedSearch) return;
    if (lastFlownQueryRef.current === submittedSearch) return;

    lastFlownQueryRef.current = submittedSearch;
    const first = results[0];
    setFlyToTarget({ lat: first.latitude, lng: first.longitude, zoom: 13 });
  }, [geoSearchQuery.data, submittedSearch]);

  const geoReverseQuery = api.geo.query.reverse(reverseCoords?.lat, reverseCoords?.lng, {
    enabled: hasAuth && Boolean(reverseCoords),
  });

  useEffect(() => {
    const place = geoReverseQuery.data;
    if (!place || !reverseCoords) return;
    if (appliedReversePlaceRef.current === place) return;

    appliedReversePlaceRef.current = place;
    const patch = placeToFormPatch(place, { fillName: false });
    setFormData((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => ({
      ...prev,
      provinsi: undefined,
      kabupaten: undefined,
      kecamatan: undefined,
      latitude: undefined,
      longitude: undefined,
    }));
  }, [geoReverseQuery.data, reverseCoords]);

  useEffect(() => {
    if (!geoReverseQuery.isError || !reverseCoords) return;
    const key = `${reverseCoords.lat.toFixed(5)},${reverseCoords.lng.toFixed(5)}`;
    if (warnedReverseKeyRef.current === key) return;

    warnedReverseKeyRef.current = key;
    ns.alert.toast({
      title: 'Wilayah tidak terdeteksi otomatis',
      message:
        'Koordinat tetap tersimpan. Silakan isi Provinsi, Kabupaten/Kota, dan Kecamatan manual.',
      icon: 'warning',
    });
  }, [geoReverseQuery.isError, ns.alert, reverseCoords]);

  const proposeSchool = api.school.mutate.propose();
  const updateMySchool = api.user.mutate.updateMySchool();

  const handleFieldChange = <K extends keyof SchoolFormState>(
    field: K,
    value: SchoolFormState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSearchSubmit = () => {
    const trimmed = searchInput.trim();
    if (trimmed.length < 3) {
      ns.alert.toast({
        title: 'Kata kunci terlalu pendek',
        message: 'Masukkan minimal 3 karakter nama sekolah untuk mencari di peta.',
        icon: 'warning',
      });
      return;
    }

    if (trimmed === submittedSearch) {
      void geoSearchQuery.refetch();
      const first = geoSearchQuery.data?.[0];
      if (first) {
        setFlyToTarget({ lat: first.latitude, lng: first.longitude, zoom: 13 });
      }
      return;
    }

    setSubmittedSearch(trimmed);
  };

  const handleSelectSearchResult = (place: GeoPlace) => {
    setReverseCoords(null);
    const patch = placeToFormPatch(place, { fillName: true });
    setSelectedPosition({ lat: place.latitude, lng: place.longitude });
    setFlyToTarget({ lat: place.latitude, lng: place.longitude, zoom: 16 });
    setFormData((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => ({
      ...prev,
      nama: undefined,
      jenjang: undefined,
      status: undefined,
      provinsi: undefined,
      kabupaten: undefined,
      kecamatan: undefined,
      latitude: undefined,
      longitude: undefined,
    }));
  };

  const handleMapClick = (lat: number, lng: number) => {
    const roundedLat = Number(lat.toFixed(6));
    const roundedLng = Number(lng.toFixed(6));
    setSelectedPosition({ lat: roundedLat, lng: roundedLng });
    setFormData((prev) => ({
      ...prev,
      latitude: roundedLat,
      longitude: roundedLng,
    }));
    setErrors((prev) => ({
      ...prev,
      latitude: undefined,
      longitude: undefined,
    }));
    setReverseCoords({ lat: roundedLat, lng: roundedLng });
  };

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

  const hasSearched = submittedSearch.length >= 3 && !geoSearchQuery.isFetching;

  return (
    <SchoolProposalPage
      backHref={backHref}
      backLabel={backLabel}
      isResubmit={Boolean(resubmitId)}
      isLoadingInitial={
        Boolean(resubmitId) && (!hasAuth || mySubmissionsQuery.isLoading) && !targetResubmission
      }
      mapProps={{
        selectedPosition,
        selectedLabel: formData.nama.trim() || undefined,
        candidates: geoSearchQuery.data ?? [],
        flyToTarget,
        onMapClick: handleMapClick,
        onSelectCandidate: handleSelectSearchResult,
        isReversing: geoReverseQuery.isFetching,
      }}
      formProps={{
        formData,
        errors,
        onFieldChange: handleFieldChange,
        searchInput,
        onSearchInputChange: setSearchInput,
        onSearchSubmit: handleSearchSubmit,
        isSearching: geoSearchQuery.isFetching,
        searchResults: geoSearchQuery.data ?? [],
        hasSearched,
        onSelectSearchResult: handleSelectSearchResult,
        rejectionReason: targetResubmission?.rejectionReason,
        isReversing: geoReverseQuery.isFetching,
        isSubmitting: proposeSchool.isPending || updateMySchool.isPending,
        onSubmit: handleSubmit,
        onCancel: () => router.push(backHref),
        cancelLabel: backLabel,
      }}
    />
  );
}
