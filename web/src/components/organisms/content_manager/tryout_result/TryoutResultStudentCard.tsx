import { GraduationCap, Mail, School, Sparkles, UserCheck } from 'lucide-react';
import React from 'react';
import { JenjangBadge } from '@/components/molecules/table';
import type { AttemptReviewResponse } from '@/types/service';

export interface TryoutResultStudentCardProps {
  review: AttemptReviewResponse | null;
}

export const TryoutResultStudentCard: React.FC<TryoutResultStudentCardProps> = ({ review }) => {
  const studentName = review?.student_name || 'Siswa SIMANTIK';
  const studentEmail = review?.student_email || 'siswa@simantik.id';
  const studentSchool = review?.student_school || 'SMA Negeri Terpadu';
  const studentGrade = review?.student_grade || '12 SMA';
  const studentNis = review?.student_nis || '2024109283';
  const tryoutTitle = review?.tryout_title || 'Paket TryOut Adaptif';

  const initials = studentName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
      {/* Student Identity Left */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-800 text-white font-black text-lg sm:text-xl flex items-center justify-center shrink-0 shadow-md">
          {initials || 'ST'}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {studentName}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 text-[11px] font-bold">
              <UserCheck className="w-3 h-3" />
              <span>NIS: {studentNis}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium flex-wrap">
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              <span>{studentGrade}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <School className="w-3.5 h-3.5 text-slate-400" />
              <span>{studentSchool}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{studentEmail}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Package Badge Right */}
      <div className="flex items-center gap-3 self-start md:self-center p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 shrink-0">
        <div className="p-2 rounded-lg bg-cyan-100/60 text-cyan-800">
          <Sparkles className="w-4 h-4 text-cyan-700" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Paket Ujian
          </p>
          <p className="text-xs sm:text-sm font-black text-slate-800 line-clamp-1 max-w-[200px] sm:max-w-xs">
            {tryoutTitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TryoutResultStudentCard;
