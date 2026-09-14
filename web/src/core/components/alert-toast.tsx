'use client';

import { CheckCircle2, CircleHelp, Info, TriangleAlert, XCircle } from 'lucide-react';
import type { ToastProps } from '@/types/ui';

// Warna ikon mengikuti token status di globals.css.
const iconMap: Record<string, { Icon: typeof Info; color: string }> = {
  success: { Icon: CheckCircle2, color: 'text-success' },
  error: { Icon: XCircle, color: 'text-destructive' },
  warning: { Icon: TriangleAlert, color: 'text-warning' },
  info: { Icon: Info, color: 'text-info' },
  question: { Icon: CircleHelp, color: 'text-accent-2' },
};

const defaultTitles: Record<string, string> = {
  success: 'Berhasil',
  error: 'Terjadi Kesalahan',
  warning: 'Peringatan',
  info: 'Informasi',
  question: 'Konfirmasi',
};

export function ToastEffect({ title, message, icon = 'info' }: ToastProps) {
  const { Icon, color } = iconMap[icon] ?? iconMap.info;
  const displayTitle = title !== undefined && title.trim() !== '' ? title : defaultTitles[icon];

  return (
    <div className="flex w-full items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-lg">
      <Icon className={`mt-0.5 size-5 shrink-0 ${color}`} />
      <div className="flex min-w-0 flex-col gap-0.5">
        {displayTitle && <p className="text-sm font-semibold text-foreground">{displayTitle}</p>}
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}
