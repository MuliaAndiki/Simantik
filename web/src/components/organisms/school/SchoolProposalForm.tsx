import { AlertCircle, CheckCircle2, Loader2, MapPin, Search } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/atoms/button';
import { AdminTextInput } from '@/components/molecules/dialog';
import {
  type SchoolFormErrors,
  SchoolFormFields,
  type SchoolFormState,
} from '@/components/molecules/school/SchoolFormFields';
import type { GeoPlace } from '@/types/service';

export interface SchoolProposalFormProps {
  formData: SchoolFormState;
  errors?: SchoolFormErrors;
  onFieldChange: <K extends keyof SchoolFormState>(field: K, value: SchoolFormState[K]) => void;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: () => void;
  isSearching?: boolean;
  searchResults?: GeoPlace[];
  hasSearched?: boolean;
  onSelectSearchResult?: (place: GeoPlace) => void;
  rejectionReason?: string;
  isReversing?: boolean;
  isSubmitting?: boolean;
  isResubmit?: boolean;
  onSubmit: () => void;
  onCancel?: () => void;
  cancelLabel?: string;
}

export const SchoolProposalForm: React.FC<SchoolProposalFormProps> = ({
  formData,
  errors,
  onFieldChange,
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  isSearching = false,
  searchResults = [],
  hasSearched = false,
  onSelectSearchResult,
  rejectionReason,
  isReversing = false,
  isSubmitting = false,
  isResubmit = false,
  onSubmit,
  onCancel,
  cancelLabel = 'Kembali',
}) => {
  const hasCoordinates =
    typeof formData.latitude === 'number' && typeof formData.longitude === 'number';
  const coordinateError = errors?.latitude || errors?.longitude;

  const handleSearchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  const handleProposalFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="space-y-6">
      {rejectionReason && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <p className="font-semibold">Alasan Penolakan Sebelumnya</p>
              <p className="mt-0.5 text-rose-700">{rejectionReason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Langkah 1: Pencarian Sekolah via OpenStreetMap */}
      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-700">
            1. Cari Sekolah di Peta (OSM)
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Ketik minimal 3 karakter lalu klik Cari atau tekan Enter. Klik hasil atau titik di peta
            untuk mengisi koordinat &amp; wilayah otomatis.
          </p>
        </div>

        <form onSubmit={handleSearchFormSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <AdminTextInput
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              placeholder="Contoh: SMAN 1 Bandung"
              bold={false}
              disabled={isSubmitting}
              className="pl-9 bg-white"
            />
          </div>
          <Button
            type="submit"
            disabled={isSearching || isSubmitting || searchInput.trim().length < 3}
            className="h-10 shrink-0 rounded-xl px-4 text-xs"
          >
            {isSearching ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Cari
              </span>
            ) : (
              'Cari'
            )}
          </Button>
        </form>

        {isSearching && (
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-600" />
            Mencari lokasi sekolah melalui OpenStreetMap...
          </div>
        )}

        {!isSearching && hasSearched && searchResults.length === 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
            Lokasi sekolah belum ditemukan di hasil pencarian. Anda tetap dapat mengklik titik
            lokasi sekolah langsung pada peta, lalu melengkapi detail sekolah secara manual.
          </div>
        )}

        {!isSearching && searchResults.length > 0 && (
          <div className="max-h-52 space-y-1.5 overflow-y-auto pr-1">
            {searchResults.map((place, index) => {
              const regionSummary = [place.kecamatan, place.kabupaten, place.provinsi]
                .filter(Boolean)
                .join(', ');
              const isSelected =
                hasCoordinates &&
                Math.abs((formData.latitude ?? 0) - place.latitude) < 0.00005 &&
                Math.abs((formData.longitude ?? 0) - place.longitude) < 0.00005;

              return (
                <button
                  key={`${place.latitude}-${place.longitude}-${index}`}
                  type="button"
                  onClick={() => onSelectSearchResult?.(place)}
                  className={`w-full rounded-lg border px-3 py-2 text-left transition cursor-pointer ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/80 ring-1 ring-teal-500/30'
                      : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-900">{place.name}</p>
                      <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">
                        {regionSummary || place.displayName}
                      </p>
                    </div>
                    <MapPin
                      className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                        isSelected ? 'text-teal-600' : 'text-slate-400'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Langkah 2: Verifikasi Koordinat & Isi Detail Sekolah */}
      <form onSubmit={handleProposalFormSubmit} className="space-y-4">
        <div
          className={`rounded-xl border px-3.5 py-2.5 text-xs ${
            coordinateError
              ? 'border-rose-300 bg-rose-50 text-rose-800'
              : hasCoordinates
                ? 'border-emerald-200 bg-emerald-50/80 text-emerald-900'
                : 'border-amber-200 bg-amber-50/80 text-amber-900'
          }`}
        >
          <div className="flex items-start gap-2">
            {hasCoordinates ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            )}
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="font-semibold">
                  {hasCoordinates
                    ? 'Koordinat Peta Terpilih'
                    : 'Titik Lokasi Belum Dipilih (Wajib)'}
                </span>
                {isReversing && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-teal-700">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Memperbarui wilayah...
                  </span>
                )}
              </div>
              {hasCoordinates ? (
                <div className="grid grid-cols-2 gap-2 pt-0.5 font-mono text-[11px] text-slate-700">
                  <div className="rounded-md bg-white/80 px-2 py-1 border border-emerald-200/70">
                    Lat: {formData.latitude?.toFixed(6)}
                  </div>
                  <div className="rounded-md bg-white/80 px-2 py-1 border border-emerald-200/70">
                    Lng: {formData.longitude?.toFixed(6)}
                  </div>
                </div>
              ) : (
                <p className="text-[11px]">
                  Pilih sekolah dari hasil pencarian atau klik langsung lokasi sekolah di peta.
                </p>
              )}
              {coordinateError && (
                <p className="text-[11px] font-medium text-rose-700">{coordinateError}</p>
              )}
            </div>
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-slate-500">
          Kolom <strong className="text-slate-700">Provinsi</strong>,{' '}
          <strong className="text-slate-700">Kabupaten/Kota</strong>, dan{' '}
          <strong className="text-slate-700">Kecamatan</strong> terisi otomatis dari peta dan dapat
          diedit manual. <strong className="text-slate-700">NPSN</strong> &amp;{' '}
          <strong className="text-slate-700">Alamat Lengkap</strong> wajib diisi secara manual.
        </p>

        <SchoolFormFields
          formData={formData}
          onChange={onFieldChange}
          errors={errors}
          disabled={isSubmitting}
          showCoordinates={false}
        />

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="h-11 rounded-xl px-5 text-xs"
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            type="submit"
            disabled={!hasCoordinates || isSubmitting}
            isLoading={isSubmitting}
            className="h-11 rounded-xl px-6 text-xs font-semibold"
          >
            {isSubmitting
              ? 'Mengirim Pengajuan...'
              : isResubmit
                ? 'Simpan & Ajukan Ulang'
                : 'Ajukan & Gunakan Sekolah'}
          </Button>
        </div>
      </form>
    </div>
  );
};
