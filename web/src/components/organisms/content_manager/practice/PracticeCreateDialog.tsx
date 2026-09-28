import { Layers } from 'lucide-react';
import type * as React from 'react';
import { useId } from 'react';
import {
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
  ManagerDialogActions,
  ManagerFormDialogShell,
} from '@/components/molecules/dialog';
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

  return (
    <ManagerFormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      icon={<Layers className="size-5 text-[#0E7490] stroke-[2.2]" />}
      title={mode === 'create' ? 'Tambah Paket Latihan' : 'Edit Paket Latihan'}
      description={
        mode === 'create'
          ? 'Silakan isi formulir di bawah ini untuk menambahkan paket latihan baru.'
          : 'Perbarui informasi dan konfigurasi paket latihan ini.'
      }
      error={error}
      onSubmit={onSubmit}
    >
      <DialogField
        label={
          <>
            Judul Paket Latihan <span className="text-rose-500">*</span>
          </>
        }
        htmlFor={titleId}
      >
        <Input
          id={titleId}
          type="text"
          value={form.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Contoh: Latihan TKA Bahasa Indonesia — Pemahaman Tekstual"
          className={DIALOG_INPUT_CLASS}
          required
        />
      </DialogField>

      <DialogField label="Kompetensi / Subtes" htmlFor={compId}>
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
      </DialogField>

      <DialogField
        label={
          <>
            Jenjang <span className="text-rose-500">*</span>
          </>
        }
      >
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
      </DialogField>

      <DialogField label="Deskripsi Singkat" htmlFor={descId}>
        <textarea
          id={descId}
          rows={3}
          value={form.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Jelaskan cakupan topik atau tujuan paket latihan ini..."
          className={DIALOG_TEXTAREA_CLASS}
        />
      </DialogField>

      {mode === 'edit' && (
        <DialogField label="Status Publikasi" htmlFor={statusId}>
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
        </DialogField>
      )}

      <ManagerDialogActions
        onCancel={() => onOpenChange(false)}
        isSubmitting={isSubmitting}
        submitLabel={mode === 'create' ? 'Simpan Paket' : 'Perbarui Paket'}
      />
    </ManagerFormDialogShell>
  );
};

export default PracticeCreateDialog;
