'use client';

import { BookOpen, Check, ShieldCheck } from 'lucide-react';
import type * as React from 'react';
import { useId } from 'react';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms';
import {
  DIALOG_INPUT_CLASS,
  DIALOG_TEXTAREA_CLASS,
  DialogField,
  ManagerFormDialogShell,
} from '@/components/molecules/dialog';
import type { SchoolLevel } from '@/types/service';
import type { MaterialStatusType, ModuleDialogForm } from '@/types/ui/material-manager.types';
import { MODULE_STATUS_OPTIONS, SCHOOL_LEVEL_OPTIONS } from '@/types/ui/material-manager.types';

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

  return (
    <ManagerFormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      icon={<BookOpen className="size-5 text-[#0E7490] stroke-[2.2]" />}
      title={mode === 'create' ? 'Tambah Modul Baru' : 'Edit Modul Pembelajaran'}
      description={
        mode === 'create'
          ? 'Silakan isi formulir di bawah ini untuk menambahkan modul pembelajaran baru.'
          : 'Perbarui informasi dan status modul pembelajaran ini.'
      }
      error={error}
      onSubmit={onSubmit}
      footer={
        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="size-3.5 text-cyan-600 shrink-0" />
          <span>Informasi modul akan langsung diperbarui di sistem</span>
        </div>
      }
    >
      <DialogField label="Judul Modul" htmlFor={titleId}>
        <Input
          id={titleId}
          type="text"
          value={form.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Contoh: Modul Matematika Kelas X"
          className={DIALOG_INPUT_CLASS}
          required
        />
      </DialogField>

      <DialogField label="Label Modul" htmlFor={labelId}>
        <Input
          id={labelId}
          type="text"
          value={form.label}
          onChange={(e) => onChange('label', e.target.value)}
          placeholder="Contoh: MAT-X-01"
          className={DIALOG_INPUT_CLASS}
          required
        />
      </DialogField>

      <DialogField label="Jenjang">
        <Select
          value={form.jenjang}
          onValueChange={(val) => onChange('jenjang', val as SchoolLevel)}
        >
          <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 bg-white text-sm focus:ring-cyan-500/30">
            <SelectValue placeholder="Pilih jenjang" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-gray-100 shadow-xl">
            {SCHOOL_LEVEL_OPTIONS.map((level) => (
              <SelectItem
                key={level.value}
                value={level.value}
                className="text-sm cursor-pointer rounded-lg hover:bg-slate-50 focus:bg-slate-50 my-0.5"
              >
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DialogField>

      <DialogField label="Deskripsi" htmlFor={descId}>
        <textarea
          id={descId}
          value={form.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Deskripsi singkat modul pembelajaran..."
          className={`${DIALOG_TEXTAREA_CLASS} min-h-[100px]`}
          required
        />
      </DialogField>

      {mode === 'edit' && (
        <DialogField label="Status Modul">
          <Select
            value={form.status}
            onValueChange={(value) => onChange('status', value as MaterialStatusType)}
          >
            <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 bg-white text-sm focus:ring-cyan-500/30">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 shadow-xl">
              {MODULE_STATUS_OPTIONS.map((status) => (
                <SelectItem
                  key={status.value}
                  value={status.value}
                  className="text-sm cursor-pointer rounded-lg hover:bg-slate-50 focus:bg-slate-50 my-0.5"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${status.color}`} />
                    <span>{status.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DialogField>
      )}

      <div className="flex items-center gap-3 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isSubmitting}
          className="w-1/3 h-11 rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium cursor-pointer shadow-2xs"
        >
          Batalkan
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || !form.title || !form.label || !form.description}
          isLoading={isSubmitting}
          className="flex-1 h-11 rounded-xl bg-[#0E7490] hover:bg-[#155e75] text-white text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors disabled:opacity-50"
        >
          {!isSubmitting && <Check className="size-4 stroke-[2.5]" />}
          <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Modul'}</span>
        </Button>
      </div>
    </ManagerFormDialogShell>
  );
}

export default MaterialCreateDialog;
