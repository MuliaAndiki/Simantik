import { ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import { SimantikLogo } from '@/components/atoms/auth/SimantikLogo';
import {
  SchoolMapPickerLazy,
  type SchoolMapPickerProps,
} from '@/components/molecules/map/SchoolMapPickerLazy';
import {
  SchoolProposalForm,
  type SchoolProposalFormProps,
} from '@/components/organisms/school/SchoolProposalForm';

export interface SchoolProposalTemplateProps {
  mapProps: SchoolMapPickerProps;
  formProps: SchoolProposalFormProps;
  backHref?: string;
  backLabel?: string;
  isResubmit?: boolean;
  isLoadingInitial?: boolean;
}

export function SchoolProposalTemplate({
  mapProps,
  formProps,
  backHref = '/pilih-sekolah',
  backLabel = 'Kembali ke Pilih Sekolah',
  isResubmit = false,
  isLoadingInitial = false,
}: SchoolProposalTemplateProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {backLabel}
            </Link>
            <div className="hidden sm:block h-5 w-px bg-slate-200" />
            <div className="hidden sm:block">
              <SimantikLogo showSubtitle={false} />
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold text-teal-700 border border-teal-200/70">
            <MapPin className="h-3.5 w-3.5" />
            Pemetaan Lokasi Sekolah
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {isResubmit ? 'Ajukan Ulang Data Sekolah' : 'Ajukan Sekolah Baru'}
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Cari sekolah Anda melalui peta OpenStreetMap atau klik langsung titik lokasi pada peta
            untuk akurasi koordinat &amp; wilayah. Sekolah Anda dapat langsung digunakan sembari
            menunggu verifikasi admin.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          <section className="lg:col-span-7 lg:sticky lg:top-6 space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Peta Lokasi Sekolah</h2>
                  <p className="text-xs text-slate-500">
                    Klik marker hasil pencarian atau klik sembarang titik di peta untuk memilih
                    lokasi.
                  </p>
                </div>
              </div>

              <SchoolMapPickerLazy
                {...mapProps}
                heightClassName="h-[340px] sm:h-[420px] lg:h-[540px]"
              />

              <p className="mt-2.5 text-[11px] text-slate-500">
                Data peta disediakan oleh OpenStreetMap. Klik titik pada peta jika nama sekolah
                belum muncul di pencarian.
              </p>
            </div>
          </section>

          <section className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              {isLoadingInitial ? (
                <div className="space-y-4 py-4 animate-pulse">
                  <div className="h-24 rounded-xl bg-slate-100" />
                  <div className="h-10 rounded-xl bg-slate-100" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 rounded-xl bg-slate-100" />
                    <div className="h-10 rounded-xl bg-slate-100" />
                  </div>
                  <div className="h-10 rounded-xl bg-slate-100" />
                  <div className="h-10 rounded-xl bg-slate-100" />
                </div>
              ) : (
                <SchoolProposalForm {...formProps} isResubmit={isResubmit} />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
