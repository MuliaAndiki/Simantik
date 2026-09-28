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
} from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface AdminFormDialogShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  maxWidthClass?: string;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  children: React.ReactNode;
}

// Shell dialog form admin (sekolah, siswa): header + form + footer Batal/Submit kuning.
export function AdminFormDialogShell({
  open,
  onOpenChange,
  title,
  description,
  maxWidthClass = 'sm:max-w-md',
  submitLabel,
  isSubmitting = false,
  onSubmit,
  children,
}: AdminFormDialogShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(maxWidthClass, 'rounded-2xl')}>
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-slate-900">{title}</DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          {children}

          <DialogFooter className="pt-2">
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
              {isSubmitting ? 'Menyimpan...' : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export interface AdminFieldProps {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// Pembungkus field + label seragam untuk dialog form admin.
export function AdminField({ label, children, className }: AdminFieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="text-xs font-bold text-slate-700">{label}</label>
      {children}
    </div>
  );
}

export const ADMIN_INPUT_CLASS = 'h-10 rounded-xl bg-slate-50 border-slate-200 text-xs';

export interface AdminTextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  bold?: boolean;
}

// Input teks seragam dialog admin.
export function AdminTextInput({ bold = true, className, ...props }: AdminTextInputProps) {
  return <Input className={cn(ADMIN_INPUT_CLASS, bold && 'font-semibold', className)} {...props} />;
}
