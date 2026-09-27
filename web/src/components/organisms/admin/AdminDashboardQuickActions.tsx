import { BookOpen, CalendarCheck, FilePlus, Newspaper, UserPlus } from 'lucide-react';
import React from 'react';
import { cn } from '@/utils/classname';

export interface AdminDashboardQuickActionsProps {
  onAddStudent?: () => void;
  onAddMaterial?: () => void;
  onAddPackage?: () => void;
  onAddTryout?: () => void;
  onAddNews?: () => void;
  className?: string;
}

export const AdminDashboardQuickActions: React.FC<AdminDashboardQuickActionsProps> = ({
  onAddStudent,
  onAddMaterial,
  onAddPackage,
  onAddTryout,
  onAddNews,
  className,
}) => {
  const actions = [
    {
      id: 'student',
      title: 'Tambah Siswa',
      subtitle: 'Registrasi akun baru',
      icon: UserPlus,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
      onClick: onAddStudent,
    },
    {
      id: 'material',
      title: 'Tambah Materi',
      subtitle: 'Unggah modul teks/',
      icon: BookOpen,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      onClick: onAddMaterial,
    },
    {
      id: 'package',
      title: 'Tambah Paket',
      subtitle: 'Set latihan terarah',
      icon: FilePlus,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      onClick: onAddPackage,
    },
    {
      id: 'tryout',
      title: 'Tambah Tryout',
      subtitle: 'Jadwalkan simulasi',
      icon: CalendarCheck,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      onClick: onAddTryout,
    },
    {
      id: 'news',
      title: 'Tambah News',
      subtitle: 'Rilis pengumuman',
      icon: Newspaper,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      onClick: onAddNews,
    },
  ];

  return (
    <section className={cn('w-full space-y-2.5 select-none', className)}>
      <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-800 uppercase">
        <span>Aksi Cepat</span>
        <span className="text-slate-300">•</span>
        <span className="text-slate-500 font-medium normal-case">
          Buat atau perbarui modul SIMANTIK secara langsung
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              type="button"
              onClick={act.onClick}
              className="bg-white rounded-2xl border border-slate-200/80 hover:border-teal-500/50 hover:shadow-xs p-3.5 sm:p-4 flex items-center gap-3.5 text-left transition-all cursor-pointer group"
            >
              <div
                className={cn(
                  'size-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
                  act.iconBg
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                  {act.title}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  {act.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default AdminDashboardQuickActions;
