import { ArrowLeft, Download, Printer } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export interface PracticeResultHeaderProps {
  basePath: string;
  packageId: string;
  packageTitle: string;
  onBack: () => void;
  onPrint?: () => void;
  onExportPdf?: () => void;
}

export const PracticeResultHeader: React.FC<PracticeResultHeaderProps> = ({
  basePath,
  packageId,
  packageTitle,
  onBack,
  onPrint,
  onExportPdf,
}) => {
  return (
    <div className="space-y-3">
      {/* Breadcrumb Bar */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs font-semibold text-slate-500"
      >
        <Link href={`${basePath}/practice`} className="hover:text-slate-800 transition">
          Paket Latihan
        </Link>
        <span className="text-slate-400">/</span>
        <Link
          href={`${basePath}/practice/${packageId}`}
          className="hover:text-slate-800 transition truncate max-w-[200px]"
          title={packageTitle}
        >
          Aktivitas Siswa
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-900 font-bold">Hasil Latihan</span>
      </nav>

      {/* Top Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#0E7490] transition w-fit cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 group-hover:text-[#0E7490] transition-transform" />
          <span>Kembali ke Aktivitas Siswa</span>
        </button>

        {/* Action Buttons: Cetak & Ekspor PDF */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={onPrint || (() => typeof window !== 'undefined' && window.print())}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak Ringkasan</span>
          </button>

          <button
            type="button"
            onClick={onExportPdf || (() => typeof window !== 'undefined' && window.print())}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#134653] hover:bg-[#0B2D38] text-white text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Hasil PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeResultHeader;
