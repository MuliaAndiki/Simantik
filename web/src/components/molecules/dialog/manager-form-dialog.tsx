import { Check } from 'lucide-react';
import React from 'react';
import { Button, Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/atoms';
import { cn } from '@/utils/classname';

export const DIALOG_INPUT_CLASS =
  'h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-cyan-500/30';

export const DIALOG_TEXTAREA_CLASS =
  'w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20 transition resize-none';

export interface ManagerFormDialogShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: React.ReactNode;
  iconBoxClassName?: string;
  headerExtra?: React.ReactNode;
  title: string;
  description: string;
  error?: string | null;
  footer?: React.ReactNode;
  formClassName?: string;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  children: React.ReactNode;
}

// Shell dialog form (content-manager + profil):
// Dialog + ikon header + judul + form + error + footer opsional.
export function ManagerFormDialogShell({
  open,
  onOpenChange,
  icon,
  iconBoxClassName,
  headerExtra,
  title,
  description,
  error,
  footer,
  formClassName,
  onSubmit,
  children,
}: ManagerFormDialogShellProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full rounded-3xl p-6 sm:p-8 bg-white border border-gray-100 shadow-2xl gap-0">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              'size-12 rounded-2xl bg-[#EAF6F8] text-[#0E7490] flex items-center justify-center border border-cyan-100/60 shadow-2xs',
              iconBoxClassName
            )}
          >
            {icon}
          </div>
          {headerExtra}
        </div>

        <div className="mt-4 space-y-1 text-left">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
            {description}
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className={cn('mt-6 space-y-4', formClassName)}>
          {children}

          {error && (
            <p className="text-xs text-rose-600 font-medium bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-left">
              {error}
            </p>
          )}
        </form>

        {footer}
      </DialogContent>
    </Dialog>
  );
}

export interface DialogFieldProps {
  label: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

// Pembungkus field + label seragam untuk dialog form.
export function DialogField({ label, htmlFor, children, className }: DialogFieldProps) {
  return (
    <div className={cn('space-y-1.5 text-left', className)}>
      <label htmlFor={htmlFor} className="block text-xs sm:text-sm font-semibold text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

export interface ManagerDialogActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel: string;
  cancelLabel?: string;
}

// Tombol Batal + Submit varian practice/tryout.
export function ManagerDialogActions({
  onCancel,
  isSubmitting = false,
  submitLabel,
  cancelLabel = 'Batal',
}: ManagerDialogActionsProps) {
  return (
    <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="w-full sm:w-auto h-11 px-5 rounded-xl border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50"
      >
        {cancelLabel}
      </Button>
      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#134653] hover:bg-[#0E343E] text-white font-semibold text-sm shadow-xs transition cursor-pointer"
      >
        {isSubmitting ? 'Menyimpan...' : submitLabel}
      </Button>
    </div>
  );
}

export interface AmberDialogActionsProps {
  onCancel: () => void;
  submitDisabled?: boolean;
  isSubmitting?: boolean;
  submitLabel: React.ReactNode;
  submittingLabel?: React.ReactNode;
  cancelLabel?: string;
  cancelClassName?: string;
}

// Tombol Batalkan + Submit amber varian profil (password, avatar).
export function AmberDialogActions({
  onCancel,
  submitDisabled = false,
  isSubmitting = false,
  submitLabel,
  submittingLabel = 'Menyimpan...',
  cancelLabel = 'Batalkan',
  cancelClassName,
}: AmberDialogActionsProps) {
  return (
    <div className="flex items-center gap-3 pt-3">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className={cn(
          'w-1/3 h-11 rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium cursor-pointer shadow-2xs',
          cancelClassName
        )}
      >
        {cancelLabel}
      </Button>

      <Button
        type="submit"
        disabled={submitDisabled}
        isLoading={isSubmitting}
        className="flex-1 h-11 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors disabled:opacity-50"
      >
        {!isSubmitting && <Check className="size-4 stroke-[2.5]" />}
        <span>{isSubmitting ? submittingLabel : submitLabel}</span>
      </Button>
    </div>
  );
}
