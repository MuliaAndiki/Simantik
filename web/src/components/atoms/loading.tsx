import type * as React from 'react';
import { cn } from '@/utils/classname';

if (typeof window !== 'undefined') {
  import('@aejkatappaja/phantom-ui');
}

export interface CardSkeletonProps {
  className?: string;
  lines?: number;
}

// Skeleton shimmer untuk data card. Dipakai saat isLoading agar
// tidak ada data contoh yang tampil sebelum data API tiba.
export function CardSkeleton({ className, lines = 3 }: CardSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Memuat data"
      className={cn(
        'flex flex-col gap-3 p-5 rounded-2xl border border-slate-200 bg-white',
        className
      )}
    >
      <phantom-ui
        loading="true"
        animation="shimmer"
        count="1"
        style={{ height: '20px', width: '40%' }}
      ></phantom-ui>
      <phantom-ui
        loading="true"
        animation="shimmer"
        count="1"
        style={{ height: '28px', width: '80%' }}
      ></phantom-ui>
      <phantom-ui
        loading="true"
        animation="shimmer"
        count={String(lines)}
        style={{ height: '14px', width: '100%' }}
        count-gap="8"
      ></phantom-ui>
    </div>
  );
}

export interface TableLoaderProps {
  label?: string;
  className?: string;
}

// Spin loader untuk data tabel. Dipakai saat isLoading.
export function TableLoader({ label = 'Memuat data...', className }: TableLoaderProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={cn('flex flex-col items-center justify-center gap-3 py-10', className)}
    >
      <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-semibold text-slate-600">{label}</p>
    </div>
  );
}
