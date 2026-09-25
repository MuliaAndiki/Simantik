import { Ban, Calendar, CheckCircle2, Mail, School, User } from 'lucide-react';
import type React from 'react';
import { cn } from '@/utils/classname';

export interface AdminStudentProfileHeroProps {
  fullName: string;
  email: string;
  status: string; // 'active' | 'suspended' | 'inactive'
  nis?: string;
  schoolName?: string;
  gradeAndMajor?: string;
  registeredDate?: string;
  className?: string;
}

export const AdminStudentProfileHero: React.FC<AdminStudentProfileHeroProps> = ({
  fullName,
  email,
  status,
  nis = '202609012',
  schoolName = 'SMAN 3 Bandung',
  gradeAndMajor = 'XII MIPA 2',
  registeredDate = '12 September 2026',
  className,
}) => {
  const isInactive = status === 'inactive' || status === 'suspended';

  // Get initials from full name
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6',
        className
      )}
    >
      {/* Left: Avatar and Identity */}
      <div className="flex items-start sm:items-center gap-4.5">
        {/* Avatar Square */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-[#ccebf0] text-[#134653] font-black text-2xl flex items-center justify-center tracking-tight shadow-2xs select-none">
            {initials || 'ST'}
          </div>
          {/* Status Badge in corner */}
          <div
            className={cn(
              'absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs',
              isInactive ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
            )}
          >
            {isInactive ? <Ban className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {fullName}
            </h2>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold',
                isInactive ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              )}
            >
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  isInactive ? 'bg-rose-500' : 'bg-emerald-500'
                )}
              />
              {isInactive ? 'Nonaktif' : 'Aktif'}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{email}</span>
          </div>

          {/* Chips Row */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-slate-700 border border-sky-100/70">
              <span className="text-slate-400 mr-1 font-medium">NIS:</span> {nis}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-slate-700 border border-sky-100/70">
              <span className="text-slate-400 mr-1 font-medium">Sekolah:</span> {schoolName}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-slate-700 border border-sky-100/70">
              <span className="text-slate-400 mr-1 font-medium">Kelas:</span> {gradeAndMajor}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Registration Date */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto">
        <Calendar className="w-4 h-4 text-slate-400" />
        <span>Terdaftar sejak {registeredDate}</span>
      </div>
    </div>
  );
};

export default AdminStudentProfileHero;
