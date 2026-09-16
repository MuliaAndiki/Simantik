import { ChevronRight, Printer } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/atoms';

export interface PracticeResultHeaderProps {
  categoryLabel?: string;
  title?: string;
  description?: string;
  testId?: string;
  onPrint?: () => void;
}

export const PracticeResultHeader: React.FC<PracticeResultHeaderProps> = ({
  categoryLabel = 'LATIHAN SOAL / PAKET 04 TKA BAHASA INDONESIA',
  title = 'Hasil Latihan',
  description = 'Lihat hasil latihanmu dan pahami pembahasan terstruktur pada setiap butir soal.',
  testId = 'SIM-TKA-04-2024',
  onPrint,
}) => {
  return (
    <div className="w-full space-y-3">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link
          href="/student/dashboard"
          className="hover:text-teal-700 transition-colors cursor-pointer"
        >
          Portal Siswa
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
        <Link
          href="/student/practice"
          className="hover:text-teal-700 transition-colors cursor-pointer"
        >
          Ruang Belajar Mandiri
        </Link>
      </nav>

      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
        <div>
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            {categoryLabel}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

        {/* Action / Test ID Badges */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-teal-900 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span>ID Tes: {testId}</span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onPrint}
            title="Cetak Hasil Latihan"
            className="h-8 w-8 rounded-full border-slate-200 text-slate-600 hover:text-teal-800 hover:bg-slate-100 cursor-pointer transition shadow-2xs"
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">Cetak Pembahasan</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
