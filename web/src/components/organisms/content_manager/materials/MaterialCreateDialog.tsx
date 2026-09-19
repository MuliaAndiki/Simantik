'use client';

import { BookOpen, Check, ShieldCheck } from 'lucide-react';
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
import type { MaterialStatusType, ModuleDialogForm } from '@/types/ui/material-manager.types';

export interface MaterialCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  form: ModuleDialogForm;
  onChange: (field: keyof ModuleDialogForm, value: string) => void;
  error?: string | null;
  onSubmit: () => Promise<void> | void;
  isSubmitting?: boolean;
}

export function MaterialCreateDialog({
  open,
  onOpenChange,
  mode = 'create',
  form,
  onChange,
  error = null,
  onSubmit,
  isSubmitting = false,
}: MaterialCreateDialogProps) {
  const titleId = useId();
  const labelId = useId();
  const descId = useId();

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full rounded-3xl p-6 sm:p-8 bg-white border border-gray-100 shadow-2xl gap-0">
        {/* Top Icon & Close Button Header */}
        <div className="flex items-start justify-between">
          <div className="size-12 rounded-2xl bg-[#EAF6F8] text-[#0E7490] flex items-center justify-center border border-cyan-100/60 shadow-2xs">
            <BookOpen className="size-5 text-[#0E7490] stroke-[2.2]" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-4 space-y-1 text-left">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            {mode === 'create' ? 'Tambah Modul Baru' : 'Edit Modul Pembelajaran'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
            {mode === 'create'
              ? 'Silakan isi formulir di bawah ini untuk menambahkan modul pembelajaran baru.'
              : 'Perbarui informasi dan status modul pembelajaran ini.'}
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
              Judul Modul
            </label>
            <Input
              id={titleId}
              type="text"
              value={form.title}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="Contoh: Modul Matematika Kelas X"
              className="h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-cyan-500/30"
              required
            />
          </div>

          {/* Field: Label */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor={labelId}
              className="block text-xs sm:text-sm font-semibold text-gray-700"
            >
              Label Modul
            </label>
            <Input
              id={labelId}
              type="text"
              value={form.label}
              onChange={(e) => onChange('label', e.target.value)}
              placeholder="Contoh: MAT-X-01"
              className="h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-cyan-500/30"
              required
            />
          </div>

          {/* Field: Deskripsi */}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor={descId}
              className="block text-xs sm:text-sm font-semibold text-gray-700"
            >
              Deskripsi
            </label>
            <textarea
              id={descId}
              value={form.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Deskripsi singkat modul pembelajaran..."
              className="w-full flex rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-none"
              required
            />
          </div>

          {/* Field: Status (Edit Only) */}
          {mode === 'edit' && (
            <div className="space-y-1.5 text-left">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                Status Modul
              </label>
              <Select
                value={form.status}
                onValueChange={(val) => onChange('status', val as MaterialStatusType)}
              >
                <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 bg-white text-sm focus:ring-cyan-500/30">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                  <SelectItem
                    value="PUBLISHED"
                    className="text-sm cursor-pointer rounded-lg hover:bg-slate-50 focus:bg-slate-50 my-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span>Published</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="IN_REVIEW"
                    className="text-sm cursor-pointer rounded-lg hover:bg-slate-50 focus:bg-slate-50 my-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#F5B731]" />
                      <span>In Review</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="DRAFT"
                    className="text-sm cursor-pointer rounded-lg hover:bg-slate-50 focus:bg-slate-50 my-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
                      <span>Draft</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Validation Alert */}
          {error && (
            <p className="text-xs text-rose-600 font-medium bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-left">
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-1/3 h-11 rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium cursor-pointer shadow-2xs"
            >
              Batalkan
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !form.title || !form.label || !form.description}
              className="flex-1 h-11 rounded-xl bg-[#0E7490] hover:bg-[#155e75] text-white text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors disabled:opacity-50"
            >
              <Check className="size-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Modul'}</span>
            </Button>
          </div>
        </form>

        {/* Modal Footer Info */}
        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="size-3.5 text-cyan-600 shrink-0" />
          <span>Informasi modul akan langsung diperbarui di sistem</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MaterialCreateDialog;
