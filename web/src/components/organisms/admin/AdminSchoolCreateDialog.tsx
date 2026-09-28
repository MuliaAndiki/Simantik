import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms';
import { AdminField, AdminFormDialogShell, AdminTextInput } from '@/components/molecules/dialog';
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
}

export interface AdminSchoolCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  formData: SchoolFormState;
  onChange: <K extends keyof SchoolFormState>(field: K, value: SchoolFormState[K]) => void;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const AdminSchoolCreateDialog: React.FC<AdminSchoolCreateDialogProps> = ({
  open,
  onOpenChange,
  mode,
  formData,
  onChange,
  onSubmit,
  isSubmitting = false,
}) => {
  return (
    <AdminFormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={mode === 'create' ? 'Tambah Master Data Sekolah' : 'Edit Data Sekolah'}
      description="Isi data lengkap sekolah sesuai dengan catatan resmi Dapodik Kemendikbudristek."
      maxWidthClass="sm:max-w-lg"
      submitLabel={mode === 'create' ? 'Tambah Sekolah' : 'Simpan Perubahan'}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
    >
      <div className="grid grid-cols-2 gap-3">
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
          />
        </AdminField>

        <AdminField label="Jenjang Pendidikan">
          <Select
            value={formData.jenjang}
            onValueChange={(val: SchoolLevel) => onChange('jenjang', val)}
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
        </AdminField>
      </div>

      <div className="grid grid-cols-2 gap-3">
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
          />
        </AdminField>

        <AdminField label="Status Sekolah">
          <Select
            value={formData.status}
            onValueChange={(val: SchoolStatusType) => onChange('status', val)}
          >
            <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="negeri">Negeri</SelectItem>
              <SelectItem value="swasta">Swasta</SelectItem>
            </SelectContent>
          </Select>
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
        />
      </AdminField>

      <div className="grid grid-cols-3 gap-2.5">
        <AdminField label="Provinsi" className="[&>label]:text-[11px] [&>label]:text-slate-600">
          <AdminTextInput
            value={formData.provinsi}
            onChange={(e) => onChange('provinsi', e.target.value)}
            placeholder="DKI Jakarta"
            bold={false}
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
            className="h-9"
          />
        </AdminField>
        <AdminField label="Kecamatan" className="[&>label]:text-[11px] [&>label]:text-slate-600">
          <AdminTextInput
            value={formData.kecamatan}
            onChange={(e) => onChange('kecamatan', e.target.value)}
            placeholder="Gambir"
            bold={false}
            className="h-9"
          />
        </AdminField>
      </div>
    </AdminFormDialogShell>
  );
};

export default AdminSchoolCreateDialog;
