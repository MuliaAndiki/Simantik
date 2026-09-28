import { Trophy } from 'lucide-react';
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
import type { TryoutDialogForm, TryoutStatusType } from '@/types/ui/tryout-manager.types';

export interface TryoutCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  form: TryoutDialogForm;
  onChange: <K extends keyof TryoutDialogForm>(field: K, value: TryoutDialogForm[K]) => void;
  error?: string | null;
  onSubmit: () => Promise<void> | void;
  isSubmitting?: boolean;
}

export const TryoutCreateDialog: React.FC<TryoutCreateDialogProps> = ({
  open,
  onOpenChange,
  mode = 'create',
  form,
  onChange,
  error = null,
  onSubmit,
  isSubmitting = false,
}) => {
  const titleId = useId();
  const descId = useId();
  const durationId = useId();
  const statusId = useId();

  return (
    <ManagerFormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      icon={<Trophy className="size-5 text-[#0E7490] stroke-[2.2]" />}
      title={mode === 'create' ? 'Tambah Paket Tryout' : 'Edit Paket Tryout'}
      description={
        mode === 'create'
          ? 'Silakan isi formulir di bawah ini untuk menambahkan paket simulasi ujian tryout baru.'
          : 'Perbarui konfigurasi durasi, alokasi soal, dan status paket tryout ini.'
      }
      error={error}
      onSubmit={onSubmit}
    >
      <DialogField
        label={
          <>
            Judul Paket Tryout <span className="text-rose-500">*</span>
          </>
        }
        htmlFor={titleId}
      >
        <Input
          id={titleId}
          type="text"
          value={form.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Contoh: Tryout TKA Bahasa Indonesia — Paket 1"
          className={DIALOG_INPUT_CLASS}
          required
        />
      </DialogField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DialogField
          label={
            <>
              Durasi (Menit) <span className="text-rose-500">*</span>
            </>
          }
          htmlFor={durationId}
        >
          <Input
            id={durationId}
            type="number"
            min={1}
            value={form.duration_minutes || ''}
            onChange={(e) => onChange('duration_minutes', Number(e.target.value) || 0)}
            placeholder="75"
            className={DIALOG_INPUT_CLASS}
            required
          />
        </DialogField>
      </div>

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
          <SelectTrigger className="h-11 rounded-xl w-full border-gray-200 bg-white text-sm focus:ring-cyan-500/30">
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
          placeholder="Deskripsi simulasi ujian, petunjuk teknis, atau target standar..."
          className={DIALOG_TEXTAREA_CLASS}
        />
      </DialogField>

      {mode === 'edit' && (
        <DialogField label="Status Publikasi" htmlFor={statusId}>
          <Select
            value={form.status}
            onValueChange={(val) => onChange('status', val as TryoutStatusType)}
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
        submitLabel={mode === 'create' ? 'Simpan Tryout' : 'Perbarui Tryout'}
      />
    </ManagerFormDialogShell>
  );
};

export default TryoutCreateDialog;
