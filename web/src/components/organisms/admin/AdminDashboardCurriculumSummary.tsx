import { BookOpen, FileQuestion, Plus, Trophy } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface AdminDashboardCurriculumSummaryProps {
  totalMaterials: number;
  totalQuestions: number;
  totalTryouts: number;
  onCreateMaterial?: () => void;
  onCreateNews?: () => void;
  className?: string;
}

export const AdminDashboardCurriculumSummary: React.FC<AdminDashboardCurriculumSummaryProps> = ({
  totalMaterials,
  totalQuestions,
  totalTryouts,
  onCreateMaterial,
  onCreateNews,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-5 md:p-6 space-y-4 flex flex-col justify-between',
        className
      )}
    >
      <div>
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <span className="h-3.5 w-1 rounded-full bg-teal-600 shrink-0" aria-hidden="true" />
          <h3 className="text-xs font-black text-slate-700 tracking-wider uppercase">
            Ringkasan Konten Kurikulum
          </h3>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2.5">
              <BookOpen className="size-4 text-sky-600" />
              <span className="text-xs font-semibold text-slate-700">
                Materi Modul Pembelajaran
              </span>
            </div>
            <span className="text-xs font-black text-slate-900">{totalMaterials}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2.5">
              <FileQuestion className="size-4 text-teal-600" />
              <span className="text-xs font-semibold text-slate-700">Bank Butir Soal Tersedia</span>
            </div>
            <span className="text-xs font-black text-slate-900">{totalQuestions}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2.5">
              <Trophy className="size-4 text-amber-600" />
              <span className="text-xs font-semibold text-slate-700">Paket Tryout Aktif</span>
            </div>
            <span className="text-xs font-black text-slate-900">{totalTryouts}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 space-y-2">
        {onCreateMaterial && (
          <Button
            type="button"
            onClick={onCreateMaterial}
            className="w-full h-9 rounded-xl font-bold text-xs bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 shadow-2xs flex items-center justify-center gap-1.5 border-0 cursor-pointer transition-transform active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Tambah Materi Baru</span>
          </Button>
        )}
        {onCreateNews && (
          <Button
            type="button"
            variant="outline"
            onClick={onCreateNews}
            className="w-full h-9 rounded-xl font-bold text-xs bg-[#EAF6F8] hover:bg-cyan-100/70 border border-cyan-200 text-teal-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Berita / Panduan</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardCurriculumSummary;
