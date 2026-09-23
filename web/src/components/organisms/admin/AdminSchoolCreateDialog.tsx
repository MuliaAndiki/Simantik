import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms';
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-slate-900">
            {mode === 'create' ? 'Tambah Master Data Sekolah' : 'Edit Data Sekolah'}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Isi data lengkap sekolah sesuai dengan catatan resmi Dapodik Kemendikbudristek.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                NPSN <span className="text-rose-500">*</span>
              </label>
              <Input
                value={formData.npsn}
                onChange={(e) => onChange('npsn', e.target.value)}
                placeholder="Contoh: 20101456"
                className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Jenjang Pendidikan</label>
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Nama Sekolah <span className="text-rose-500">*</span>
              </label>
              <Input
                value={formData.nama}
                onChange={(e) => onChange('nama', e.target.value)}
                placeholder="Contoh: SMAN 1 Jakarta"
                className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Status Sekolah</label>
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
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Alamat Lengkap <span className="text-rose-500">*</span>
            </label>
            <Input
              value={formData.alamat}
              onChange={(e) => onChange('alamat', e.target.value)}
              placeholder="Jalan, Nomor, RT/RW"
              className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Provinsi</label>
              <Input
                value={formData.provinsi}
                onChange={(e) => onChange('provinsi', e.target.value)}
                placeholder="DKI Jakarta"
                className="h-9 rounded-xl bg-slate-50 border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Kabupaten/Kota</label>
              <Input
                value={formData.kabupaten}
                onChange={(e) => onChange('kabupaten', e.target.value)}
                placeholder="Jakarta Pusat"
                className="h-9 rounded-xl bg-slate-50 border-slate-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Kecamatan</label>
              <Input
                value={formData.kecamatan}
                onChange={(e) => onChange('kecamatan', e.target.value)}
                placeholder="Gambir"
                className="h-9 rounded-xl bg-slate-50 border-slate-200 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-xl text-xs font-bold text-slate-700 border-slate-200"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 rounded-xl font-bold text-xs bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 border-0 shadow-2xs cursor-pointer transition-transform active:scale-98"
            >
              {isSubmitting
                ? 'Menyimpan...'
                : mode === 'create'
                  ? 'Tambah Sekolah'
                  : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSchoolCreateDialog;
