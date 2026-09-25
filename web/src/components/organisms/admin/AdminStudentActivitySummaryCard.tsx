import { BarChart2, BookOpen, Clock } from 'lucide-react';
import type React from 'react';
import { cn } from '@/utils/classname';

export interface AdminStudentActivitySummaryCardProps {
  practiceCount?: number;
  tryoutCount?: number;
  className?: string;
}

export const AdminStudentActivitySummaryCard: React.FC<AdminStudentActivitySummaryCardProps> = ({
  practiceCount = 24,
  tryoutCount = 3,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 space-y-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
          <BarChart2 className="w-4 h-4" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Ringkasan Aktivitas</h3>
      </div>

      {/* 2 Stat Boxes */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Latihan */}
        <div className="bg-[#f4fafd] rounded-xl p-4 border border-sky-50/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Latihan
            </span>
            <BookOpen className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{practiceCount}</span>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Paket Selesai</p>
          </div>
        </div>

        {/* Tryout */}
        <div className="bg-[#f4fafd] rounded-xl p-4 border border-sky-50/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Tryout
            </span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{tryoutCount}</span>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Simulasi Nasional</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentActivitySummaryCard;
