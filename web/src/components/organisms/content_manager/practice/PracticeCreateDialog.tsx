import { Layers } from 'lucide-react';
import type * as React from 'react';
import { useId } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms';
import type { SchoolLevel } from '@/types/service';
import { SCHOOL_LEVEL_OPTIONS } from '@/types/ui/material-manager.types';
import type { PracticeDialogForm, PracticeStatusType } from '@/types/ui/practice-manager.types';
import type { PracticeManagerCompetencyOption } from './PracticeFilterBar';

export interface PracticeCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  form: PracticeDialogForm;
  competencies?: PracticeManagerCompetencyOption[];

  onChange: <K extends keyof PracticeDialogForm>(field: K, value: PracticeDialogForm[K]) => void;
  error?: string | null;
  onSubmit: () => Promise<void> | void;
  isSubmitting?: boolean;
}

export const PracticeCreateDialog: React.FC<PracticeCreateDialogProps> = ({
  open,
  onOpenChange,
  mode = 'create',
  form,
  competencies = [],
  onChange,
  error = null,
  onSubmit,
  isSubmitting = false,
}) => {
  const titleId = useId();
  const descId = useId();
  const compId = useId();
  const statusId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full rounded-3xl p-6 sm:p-8 bg-white border border-gray-100 shadow-2xl gap-0">
        {/* Top Icon Header */}
        <div className="flex items-start justify-between">
          <div className="size-12 rounded-2xl bg-[#EAF6F8] text-[#0E7490] flex items-center justify-center border border-cyan-100/60 shadow-2xs">
            <Layers className="size-5 text-[#0E7490] stroke-[2.2]" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-4 space-y-1 text-left">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            {mode === 'create' ? 'Tambah Paket Latihan' : 'Edit Paket Latihan'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
            {mode === 'create'
              ? 'Silakan isi formulir di bawah ini untuk menambahkan paket latihan baru.'
              : 'Perbarui informasi dan konfigurasi paket latihan ini.'}
          </DialogDescription>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Field: Judul */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor={titleId}
              className="block text-xs sm:text-sm font-semibold text-gray-700"
            >
              Judul Paket Latihan <span className="text-rose-500">*</span>
            </label>
            <Input
              id={titleId}
              type="text"
              value={form.title}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="Contoh: Latihan TKA Bahasa Indonesia — Pemahaman Tekstual"
              className="h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-cyan-500/30"
              required
            />
          </div>

          {/* Field: Kompetensi / Subtes */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor={compId}
              className="block text-xs sm:text-sm font-semibold text-gray-700"
            >
              Kompetensi / Subtes
            </label>
            <Select
              value={form.competency_id || 'none'}
              onValueChange={(val) => onChange('competency_id', val === 'none' ? '' : val)}
            >
              <SelectTrigger
                id={compId}
                className="h-11 rounded-xl border-gray-200 bg-white text-sm focus:ring-cyan-500/30"
              >
                <SelectValue placeholder="Pilih Kompetensi" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-xl bg-white">
                <SelectItem value="none">-- Umum / Tanpa Kompetensi Khusus --</SelectItem>
                {competencies.map((comp) => (
                  <SelectItem key={comp.id} value={comp.id}>
                    {comp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Field: Jenjang */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">
              Jenjang <span className="text-rose-500">*</span>
            </label>
            <Select
              value={form.jenjang}
              onValueChange={(val) => onChange('jenjang', val as SchoolLevel)}
            >
              <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white text-sm focus:ring-cyan-500/30">
                <SelectValue placeholder="Pilih jenjang" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-xl bg-white">
                {SCHOOL_LEVEL_OPTIONS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Field: Deskripsi */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor={descId}
              className="block text-xs sm:text-sm font-semibold text-gray-700"
            >
              Deskripsi Singkat
            </label>
            <textarea
              id={descId}
              rows={3}
              value={form.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Jelaskan cakupan topik atau tujuan paket latihan ini..."
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20 transition resize-none"
            />
          </div>

          {/* Field: Status (Edit Mode only) */}
          {mode === 'edit' && (
            <div className="space-y-1.5 text-left">
              <label
                htmlFor={statusId}
                className="block text-xs sm:text-sm font-semibold text-gray-700"
              >
                Status Publikasi
              </label>
              <Select
                value={form.status}
                onValueChange={(val) => onChange('status', val as PracticeStatusType)}
              >
                <SelectTrigger
                  id={statusId}
                  className="h-11 rounded-xl border-gray-200 bg-white text-sm focus:ring-cyan-500/30"
                >
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 shadow-xl bg-white">
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="UNPUBLISHED">Unpublished</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-xs font-semibold text-rose-600 text-left bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto h-11 px-5 rounded-xl border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#134653] hover:bg-[#0E343E] text-white font-semibold text-sm shadow-xs transition cursor-pointer"
            >
              {isSubmitting
                ? 'Menyimpan...'
                : mode === 'create'
                  ? 'Simpan Paket'
                  : 'Perbarui Paket'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PracticeCreateDialog;
