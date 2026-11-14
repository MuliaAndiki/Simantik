'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  SchoolFormErrors,
  SchoolFormState,
} from '@/components/molecules/school/SchoolFormFields';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import type { GeoPlace, SchoolLevel } from '@/types/service';
import {
  buildSchoolProposalInitialForm,
  EMPTY_SCHOOL_FORM,
  placeToFormPatch,
} from '@/utils/school-proposal.util';

export interface UseSchoolMapFormOptions {
  initialForm?: SchoolFormState;
  initialSearch?: string;
  initialJenjang?: SchoolLevel;
  enabled?: boolean;
}

const isValidIndonesiaCoords = (lat: number | null | undefined, lng: number | null | undefined) =>
  typeof lat === 'number' &&
  typeof lng === 'number' &&
  Number.isFinite(lat) &&
  Number.isFinite(lng) &&
  lat >= -11 &&
  lat <= 6 &&
  lng >= 95 &&
  lng <= 141;

export function useSchoolMapForm({
  initialForm = EMPTY_SCHOOL_FORM,
  initialSearch = '',
  initialJenjang,
  enabled = true,
}: UseSchoolMapFormOptions = {}) {
  const api = useApi();
  const ns = useAppNameSpace();

  const trimmedInitialSearch = initialSearch.trim();
  const [searchInput, setSearchInput] = useState(trimmedInitialSearch);
  const [submittedSearch, setSubmittedSearch] = useState(
    trimmedInitialSearch.length >= 3 ? trimmedInitialSearch : ''
  );

  const [formData, setFormData] = useState<SchoolFormState>(() =>
    initialForm === EMPTY_SCHOOL_FORM && (trimmedInitialSearch || initialJenjang)
      ? buildSchoolProposalInitialForm(trimmedInitialSearch || undefined, initialJenjang)
      : initialForm
  );
  const [errors, setErrors] = useState<SchoolFormErrors>({});

  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(
    () =>
      typeof initialForm.latitude === 'number' && typeof initialForm.longitude === 'number'
        ? { lat: initialForm.latitude, lng: initialForm.longitude }
        : null
  );
  const [flyToTarget, setFlyToTarget] = useState<{
    lat: number;
    lng: number;
    zoom?: number;
  } | null>(null);
  const [reverseCoords, setReverseCoords] = useState<{ lat: number; lng: number } | null>(null);

  const lastFlownQueryRef = useRef<string | null>(null);
  const appliedReversePlaceRef = useRef<GeoPlace | null>(null);
  const warnedReverseKeyRef = useRef<string | null>(null);

  const geoSearchQuery = api.geo.query.searchSchools(submittedSearch, {
    enabled: enabled && submittedSearch.length >= 3,
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
    enabled: enabled && Boolean(reverseCoords),
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

  const handleFieldChange = useCallback(
    <K extends keyof SchoolFormState>(field: K, value: SchoolFormState[K]) => {
      setFormData((prev) => {
        const next = { ...prev, [field]: value };

        if (field === 'latitude' || field === 'longitude') {
          if (isValidIndonesiaCoords(next.latitude, next.longitude)) {
            const pos = { lat: next.latitude as number, lng: next.longitude as number };
            setSelectedPosition(pos);
            setFlyToTarget({ ...pos, zoom: 16 });
          } else if (next.latitude == null || next.longitude == null) {
            setSelectedPosition(null);
          }
        }

        return next;
      });
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const handleSearchSubmit = useCallback(() => {
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
  }, [geoSearchQuery, ns.alert, searchInput, submittedSearch]);

  const handleSelectSearchResult = useCallback((place: GeoPlace) => {
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
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
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
  }, []);

  const clearCoordinates = useCallback(() => {
    setReverseCoords(null);
    setSelectedPosition(null);
    setFormData((prev) => ({
      ...prev,
      latitude: null,
      longitude: null,
    }));
    setErrors((prev) => ({
      ...prev,
      latitude: undefined,
      longitude: undefined,
    }));
  }, []);

  const hydrateForm = useCallback(
    (nextForm: SchoolFormState, options?: { searchValue?: string }) => {
      setReverseCoords(null);
      setFormData(nextForm);
      setErrors({});
      if (options?.searchValue !== undefined) {
        setSearchInput(options.searchValue);
      }

      if (typeof nextForm.latitude === 'number' && typeof nextForm.longitude === 'number') {
        const pos = { lat: nextForm.latitude, lng: nextForm.longitude };
        setSelectedPosition(pos);
        setFlyToTarget({ ...pos, zoom: 16 });
      } else {
        setSelectedPosition(null);
        setFlyToTarget(null);
      }
    },
    []
  );

  const hasSearched = submittedSearch.length >= 3 && !geoSearchQuery.isFetching;

  return {
    searchInput,
    setSearchInput,
    formData,
    setFormData,
    errors,
    setErrors,
    handleFieldChange,
    handleSearchSubmit,
    handleSelectSearchResult,
    handleMapClick,
    clearCoordinates,
    hydrateForm,
    mapProps: {
      selectedPosition,
      selectedLabel: formData.nama.trim() || undefined,
      candidates: geoSearchQuery.data ?? [],
      flyToTarget,
      onMapClick: handleMapClick,
      onSelectCandidate: handleSelectSearchResult,
      isReversing: geoReverseQuery.isFetching,
    },
    geoFormProps: {
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
      isReversing: geoReverseQuery.isFetching,
    },
  };
}
