import { AlertCircle, ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import type React from "react";
import {
  SchoolMapPickerLazy,
  type SchoolMapPickerProps,
} from "@/components/molecules/map/SchoolMapPickerLazy";
import {
  SchoolProposalForm,
  type SchoolProposalFormProps,
} from "@/components/organisms/school/SchoolProposalForm";
import { cn } from "@/utils/classname";

export interface AdminSchoolFormTemplateProps {
  mode: "create" | "edit";
  mapProps: SchoolMapPickerProps;
  formProps: SchoolProposalFormProps;
  backHref?: string;
  isLoadingInitial?: boolean;
  isNotFound?: boolean;
  className?: string;
}

export const AdminSchoolFormTemplate: React.FC<
  AdminSchoolFormTemplateProps
> = ({
  mode,
  mapProps,
  formProps,
  backHref = "/admin/schools",
  isLoadingInitial = false,
  isNotFound = false,
  className,
}) => {
  const isEdit = mode === "edit";

  return (
    <div className={cn("w-full max-w-full mx-auto space-y-6", className)}>
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="h-3.5 w-1 rounded-full bg-teal-600 shrink-0"
                aria-hidden="true"
              />
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                Master Data Sekolah
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isEdit ? "Edit Data Sekolah" : "Tambah Sekolah Baru"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed max-w-2xl">
              Cari sekolah melalui peta OpenStreetMap atau klik titik lokasi di
              peta untuk mengisi koordinat serta wilayah administratif secara
              otomatis. Koordinat tetap opsional untuk admin dan dapat diisi
              atau dihapus manual.
            </p>
          </div>

          <Link
            href={backHref}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 self-start sm:self-center"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar</span>
          </Link>
        </div>
      </div>

      {isNotFound ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 md:p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              Data Sekolah Tidak Ditemukan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Sekolah yang ingin Anda ubah tidak tersedia atau telah dihapus.
            </p>
          </div>
          <div>
            <Link
              href={backHref}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#134653] px-5 text-xs font-bold text-white transition hover:bg-[#0B2D38]"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Manajemen Sekolah
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Peta Interaktif React-Leaflet */}
          <section className="lg:col-span-7 lg:sticky lg:top-6 space-y-3">
            <div className="rounded-2xl border border-slate-100/90 bg-white p-4 shadow-2xs sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    Peta Lokasi Sekolah
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Klik marker hasil pencarian atau klik sembarang titik di
                    peta untuk memilih lokasi.
                  </p>
                </div>
              </div>

              {isLoadingInitial ? (
                <div
                  style={{ minHeight: 360 }}
                  className="h-[360px] sm:h-[440px] lg:h-[560px] w-full animate-pulse rounded-xl bg-slate-100"
                />
              ) : (
                <SchoolMapPickerLazy
                  {...mapProps}
                  heightClassName="h-[360px] sm:h-[440px] lg:h-[560px]"
                />
              )}

              <p className="mt-2.5 text-[11px] text-slate-500">
                Data peta disediakan oleh OpenStreetMap. Jika nama sekolah belum
                muncul di pencarian, klik langsung titik lokasi pada peta atau
                isi form di samping secara manual.
              </p>
            </div>
          </section>

          {/* Form Detail Sekolah */}
          <section className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-100/90 bg-white p-5 shadow-2xs sm:p-6">
              {isLoadingInitial ? (
                <div className="space-y-4 py-2 animate-pulse">
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
                <SchoolProposalForm
                  {...formProps}
                  coordinatesRequired={false}
                  showManualCoordinates
                  submitLabel={isEdit ? "Simpan Perubahan" : "Tambah Sekolah"}
                  submittingLabel={
                    isEdit ? "Menyimpan Perubahan..." : "Menyimpan Sekolah..."
                  }
                  cancelLabel="Batal"
                />
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminSchoolFormTemplate;
