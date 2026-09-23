import { ArrowRight, BookOpen, Plus, School, Trophy, UserCheck, Users } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface AdminDashboardQuickActionsProps {
  onNavigateSchools: () => void;
  onNavigateStudents: () => void;
  onNavigateContentManagers: () => void;
  onNavigateTryouts: () => void;
  onNavigateMaterials: () => void;
  className?: string;
}

export const AdminDashboardQuickActions: React.FC<AdminDashboardQuickActionsProps> = ({
  onNavigateSchools,
  onNavigateStudents,
  onNavigateContentManagers,
  onNavigateTryouts,
  onNavigateMaterials,
  className,
}) => {
  return (
    <section className={cn('w-full space-y-3.5 select-none', className)}>
      <div className="flex items-center gap-2">
        <span className="h-3.5 w-1 rounded-full bg-teal-600 shrink-0" aria-hidden="true" />
        <h2 className="text-xs font-black text-slate-700 tracking-wider uppercase">
          Manajemen & Aksi Cepat
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Action 1: Kelola Sekolah */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Kelola Sekolah</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Master data NPSN, jenjang pendidikan, status akreditasi, dan sebaran wilayah sekolah.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onNavigateSchools}
            className="w-full h-9 rounded-xl font-bold text-xs bg-[#EAF6F8] hover:bg-cyan-100/70 border border-cyan-200 text-teal-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Buka Sekolah</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Action 2: Kelola Siswa */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Kelola Siswa</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Pantau seluruh akun siswa, status aktif/suspend, dan audit riwayat akademik belajar.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onNavigateStudents}
            className="w-full h-9 rounded-xl font-bold text-xs bg-[#EAF6F8] hover:bg-cyan-100/70 border border-cyan-200 text-teal-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Buka Siswa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Action 3: Kelola Content Manager */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Kelola Content Manager</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Atur hak akses, peran sistem, dan status kurator pembuat materi serta bank butir soal.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onNavigateContentManagers}
            className="w-full h-9 rounded-xl font-bold text-xs bg-[#EAF6F8] hover:bg-cyan-100/70 border border-cyan-200 text-teal-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Buka Kurator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardQuickActions;
