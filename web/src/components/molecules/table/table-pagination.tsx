import type * as React from 'react';
import { Button } from '@/components/atoms/button';

export interface TablePaginationProps {
  currentPage: number;
  totalItems: number;
  rowsPerPage: number;
  displayedCount: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
  className?: string;
}

// Pagination sederhana: "Menampilkan X dari Y label" + Sebelumnya/Halaman/Selanjutnya.
// Dipakai tabel admin (students, schools, content-managers).
export function TablePagination({
  currentPage,
  totalItems,
  rowsPerPage,
  displayedCount,
  itemLabel,
  onPageChange,
  className,
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
  if (totalItems <= rowsPerPage) return null;

  return (
    <div className={`flex items-center justify-between pt-2 ${className ?? ''}`}>
      <span className="text-xs text-slate-400 font-medium">
        Menampilkan {displayedCount} dari {totalItems} {itemLabel}
      </span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="text-xs font-semibold rounded-lg"
        >
          Sebelumnya
        </Button>
        <span className="text-xs font-bold px-2 text-slate-700">
          {currentPage} / {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="text-xs font-semibold rounded-lg"
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );
}
