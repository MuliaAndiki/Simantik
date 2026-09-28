import type * as React from 'react';
import { TableLoader } from '@/components/atoms/loading';

export interface TableLoadingRowProps {
  colSpan: number;
  label: string;
}

// Baris loading seragam untuk semua tabel data (ganti teks statis).
export function TableLoadingRow({ colSpan, label }: TableLoadingRowProps) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <TableLoader label={label} />
      </td>
    </tr>
  );
}

export interface TableEmptyRowProps {
  colSpan: number;
  message: string;
}

// Baris kosong seragam untuk semua tabel data.
export function TableEmptyRow({ colSpan, message }: TableEmptyRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-12 text-center text-slate-400 font-medium">
        {message}
      </td>
    </tr>
  );
}
