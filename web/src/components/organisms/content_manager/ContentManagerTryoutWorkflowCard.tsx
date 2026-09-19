import {
  Calendar,
  CheckCircle2,
  FileCheck2,
  Shuffle,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import React from 'react';
import { Button } from '@/components/atoms';
import type { TryoutWorkflowAutomation } from '@/types/ui';
import { cn } from '@/utils/classname';

const DEFAULT_WORKFLOW: TryoutWorkflowAutomation = {
  modulUjian: 'Tryout TKA Bahasa Indonesia',
  kumpulanSoalTotal: 150,
  alokasiSiswa: 30,
  durasiMenit: 75,
  statusDistribusi: 'Published',
};

export interface ContentManagerTryoutWorkflowCardProps {
  workflow?: TryoutWorkflowAutomation;
  onManageQuestions?: () => void;
  className?: string;
}

export const ContentManagerTryoutWorkflowCard: React.FC<ContentManagerTryoutWorkflowCardProps> = ({
  workflow = DEFAULT_WORKFLOW,
  onManageQuestions,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-2xs select-none space-y-5',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Kumpulan Soal Tryout
        </h2>

        <Button
          type="button"
          variant="outline"
          onClick={onManageQuestions}
          className="h-10 px-4 rounded-xl font-bold text-xs bg-[#EAF6F8] hover:bg-cyan-100/80 border border-cyan-200 text-teal-800 flex items-center gap-2 cursor-pointer transition-colors self-start sm:self-auto"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Kelola Soal</span>
        </Button>
      </div>

      {/* Meta Bar */}
      <div className="w-full rounded-2xl bg-[#EAF6F8]/80 border border-cyan-100/90 p-4 sm:p-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {/* Item 1 */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Modul Ujian
            </span>
            <span className="text-sm font-black text-slate-900 block mt-0.5">
              {workflow.modulUjian}
            </span>
          </div>

          {/* Item 2 */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Kumpulan Soal
            </span>
            <span className="text-sm font-black text-slate-900 block mt-0.5">
              {workflow.kumpulanSoalTotal} Soal
            </span>
          </div>

          {/* Item 3 */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Alokasi & Durasi
            </span>
            <span className="text-sm font-black text-slate-900 block mt-0.5">
              {workflow.alokasiSiswa} Soal / Siswa • {workflow.durasiMenit} Menit
            </span>
          </div>

          {/* Item 4 */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Status Distribusi
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="text-sm font-black text-teal-900">{workflow.statusDistribusi}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alur Distribusi Soal Terotomatisasi Box */}
      <div className="w-full rounded-2xl bg-cyan-50/30 border border-cyan-100/70 p-4 sm:p-5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
          Alur Distribusi Soal Terotomatisasi
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Step 01 */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-2xs flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Step 01</span>
              <Calendar className="w-3.5 h-3.5 text-cyan-600" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-700 block">Kumpulan Soal</span>
              <span className="text-lg font-black text-slate-900 block mt-0.5">
                {workflow.kumpulanSoalTotal} Soal
              </span>
              <span className="text-[11px] text-slate-400 font-medium block mt-1 leading-snug">
                Bank butir tervalidasi kurikulum
              </span>
            </div>
          </div>

          {/* Step 02 */}
          <div className="bg-[#EAF6F8]/60 rounded-xl border border-cyan-200/80 p-4 shadow-2xs flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-teal-700 uppercase">Step 02</span>
              <Shuffle className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold text-teal-950 block">Mesin Pengacak</span>
              <span className="text-sm font-black text-teal-900 block mt-0.5">
                Sistem Memilih Acak
              </span>
              <span className="text-[11px] text-slate-500 font-medium block mt-1 leading-snug">
                Algoritma anti-bias sebaran kategori
              </span>
            </div>
          </div>

          {/* Step 03 */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-2xs flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Step 03</span>
              <FileCheck2 className="w-3.5 h-3.5 text-cyan-600" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-700 block">Alokasi Siswa</span>
              <span className="text-lg font-black text-slate-900 block mt-0.5">
                {workflow.alokasiSiswa} Soal
              </span>
              <span className="text-[11px] text-slate-400 font-medium block mt-1 leading-snug">
                Kuota terstandardisasi per sesi
              </span>
            </div>
          </div>

          {/* Output Card (Gold Accent) */}
          <div className="bg-[#FDF6E2] rounded-xl border border-[#FDE68A] p-4 shadow-2xs flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                Output
              </span>
              <Users className="w-4 h-4 text-amber-700" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Hasil Peserta</span>
              <span className="text-sm font-black text-slate-900 block mt-0.5">
                Kombinasi Unik & Seimbang
              </span>
              <span className="text-[11px] text-amber-900/80 font-medium block mt-1 leading-snug">
                Integritas asesmen terjaga
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagerTryoutWorkflowCard;
