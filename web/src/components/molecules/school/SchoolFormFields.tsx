import type React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms';
import { AdminField, AdminTextInput } from '@/components/molecules/dialog';
import type { SchoolLevel, SchoolStatusType } from '@/types/service';

export interface SchoolFormState {
  id?: string;
  npsn: string;
  nama: string;
  jenjang: SchoolLevel;
  status: SchoolStatusType;
  alamat: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  latitude?: number | null;
  longitude?: number | null;
}

export type SchoolFormErrors = Partial<Record<keyof SchoolFormState, string>>;

export interface SchoolFormFieldsProps {
  formData: SchoolFormState;
  onChange: <K extends keyof SchoolFormState>(field: K, value: SchoolFormState[K]) => void;
  errors?: SchoolFormErrors;
  disabled?: boolean;
  showCoordinates?: boolean;
}

export const SchoolFormFields: React.FC<SchoolFormFieldsProps> = ({
  formData,
  onChange,
  errors,
  disabled = false,
  showCoordinates = true,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AdminField
          label={
            <>
              NPSN <span className="text-rose-500">*</span>
            </>
          }
        >
          <AdminTextInput
            value={formData.npsn}
            onChange={(e) => onChange('npsn', e.target.value)}
            placeholder="Contoh: 20101456"
            bold={false}
            disabled={disabled}
            aria-invalid={!!errors?.npsn}
          />
          {errors?.npsn && <p className="text-[11px] text-rose-600">{errors.npsn}</p>}
        </AdminField>

        <AdminField label="Jenjang Pendidikan">
          <Select
            value={formData.jenjang}
            onValueChange={(val: SchoolLevel) => onChange('jenjang', val)}
            disabled={disabled}
          >
            <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sma">SMA</SelectItem>
              <SelectItem value="smk">SMK</SelectItem>
              <SelectItem value="smp">SMP</SelectItem>
              <SelectItem value="sd">SD</SelectItem>
            </SelectContent>
          </Select>
          {errors?.jenjang && <p className="text-[11px] text-rose-600">{errors.jenjang}</p>}
        </AdminField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AdminField
          label={
            <>
              Nama Sekolah <span className="text-rose-500">*</span>
            </>
          }
        >
          <AdminTextInput
            value={formData.nama}
            onChange={(e) => onChange('nama', e.target.value)}
            placeholder="Contoh: SMAN 1 Jakarta"
            bold={false}
            disabled={disabled}
            aria-invalid={!!errors?.nama}
          />
          {errors?.nama && <p className="text-[11px] text-rose-600">{errors.nama}</p>}
        </AdminField>

        <AdminField label="Status Sekolah">
          <Select
            value={formData.status}
            onValueChange={(val: SchoolStatusType) => onChange('status', val)}
            disabled={disabled}
          >
            <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="negeri">Negeri</SelectItem>
              <SelectItem value="swasta">Swasta</SelectItem>
            </SelectContent>
          </Select>
          {errors?.status && <p className="text-[11px] text-rose-600">{errors.status}</p>}
        </AdminField>
      </div>

      <AdminField
        label={
          <>
            Alamat Lengkap <span className="text-rose-500">*</span>
          </>
        }
      >
        <AdminTextInput
          value={formData.alamat}
          onChange={(e) => onChange('alamat', e.target.value)}
          placeholder="Jalan, Nomor, RT/RW"
          bold={false}
          disabled={disabled}
          aria-invalid={!!errors?.alamat}
        />
        {errors?.alamat && <p className="text-[11px] text-rose-600">{errors.alamat}</p>}
      </AdminField>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <AdminField label="Provinsi" className="[&>label]:text-[11px] [&>label]:text-slate-600">
          <AdminTextInput
            value={formData.provinsi}
            onChange={(e) => onChange('provinsi', e.target.value)}
            placeholder="DKI Jakarta"
            bold={false}
            disabled={disabled}
            className="h-9"
          />
        </AdminField>
        <AdminField
          label="Kabupaten/Kota"
          className="[&>label]:text-[11px] [&>label]:text-slate-600"
        >
          <AdminTextInput
            value={formData.kabupaten}
            onChange={(e) => onChange('kabupaten', e.target.value)}
            placeholder="Jakarta Pusat"
            bold={false}
            disabled={disabled}
            className="h-9"
          />
        </AdminField>
        <AdminField label="Kecamatan" className="[&>label]:text-[11px] [&>label]:text-slate-600">
          <AdminTextInput
            value={formData.kecamatan}
            onChange={(e) => onChange('kecamatan', e.target.value)}
            placeholder="Gambir"
            bold={false}
            disabled={disabled}
            className="h-9"
          />
        </AdminField>
      </div>

      {showCoordinates && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AdminField
            label="Latitude (Opsional)"
            className="[&>label]:text-[11px] [&>label]:text-slate-600"
          >
            <AdminTextInput
              type="number"
              step="any"
              value={formData.latitude ?? ''}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === '') {
                  onChange('latitude', null);
                  return;
                }
                const parsed = Number(raw);
                onChange('latitude', Number.isFinite(parsed) ? parsed : null);
              }}
              placeholder="-6.200000"
              bold={false}
              disabled={disabled}
              className="h-9"
              aria-invalid={!!errors?.latitude}
            />
            {errors?.latitude && <p className="text-[11px] text-rose-600">{errors.latitude}</p>}
          </AdminField>
          <AdminField
            label="Longitude (Opsional)"
            className="[&>label]:text-[11px] [&>label]:text-slate-600"
          >
            <AdminTextInput
              type="number"
              step="any"
              value={formData.longitude ?? ''}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === '') {
                  onChange('longitude', null);
                  return;
                }
                const parsed = Number(raw);
                onChange('longitude', Number.isFinite(parsed) ? parsed : null);
              }}
              placeholder="106.816666"
              bold={false}
              disabled={disabled}
              className="h-9"
              aria-invalid={!!errors?.longitude}
            />
            {errors?.longitude && <p className="text-[11px] text-rose-600">{errors.longitude}</p>}
          </AdminField>
        </div>
      )}
    </div>
  );
};
