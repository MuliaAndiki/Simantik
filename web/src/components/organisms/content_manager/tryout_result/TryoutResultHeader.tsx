import { ArrowLeft, Download, Printer } from 'lucide-react';
import React from 'react';

export interface TryoutResultHeaderProps {
  tryoutTitle: string;
  onBack: () => void;
  onPrint?: () => void;
  onExportPdf?: () => void;
}

export const TryoutResultHeader: React.FC<TryoutResultHeaderProps> = ({
  tryoutTitle,
  onBack,
  onPrint,
  onExportPdf,
}) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar with Back and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Kembali ke Aktivitas Siswa</span>
        </button>

        <div className="flex items-center gap-2.5 self-start sm:self-center flex-wrap">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Hasil Siswa</span>
          </button>

          <button
            type="button"
            onClick={onExportPdf || handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#134653] hover:bg-[#0B2D38] text-white rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor PDF</span>
          </button>
        </div>
      </div>

      {/* Main Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <span>Paket TryOut</span>
          <span>&gt;</span>
          <span>Aktivitas Siswa</span>
          <span>&gt;</span>
          <span className="text-cyan-800">Hasil Pengerjaan Siswa</span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
          Hasil Pengerjaan TryOut Siswa
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          {tryoutTitle || 'Simulasi Ujian Tryout'}
        </p>
      </div>
    </div>
  );
};

export default TryoutResultHeader;
