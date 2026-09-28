import React from 'react';
import { Dialog, DialogContent } from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface ExamDialogShellProps {
  isOpen: boolean;
  onCancel?: () => void;
  dismissable?: boolean;
  contentClassName?: string;
  children: React.ReactNode;
}

// Shell dialog ujian/latihan: overlay gelap + konten rounded + tombol-X bawaan disembunyikan.
export function ExamDialogShell({
  isOpen,
  onCancel,
  dismissable = true,
  contentClassName,
  children,
}: ExamDialogShellProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          if (dismissable) onCancel?.();
        }
      }}
    >
      <DialogContent
        className={cn(
          'w-full rounded-[28px] bg-white border border-slate-100 shadow-2xl [&>button]:hidden',
          contentClassName
        )}
        overlayClassName="bg-slate-950/70 backdrop-blur-sm fixed inset-0 z-50"
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
