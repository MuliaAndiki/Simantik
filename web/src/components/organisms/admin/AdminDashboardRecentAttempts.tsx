import { Activity, ArrowRight } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/atoms';
import type { RecentAttemptItem } from '@/types/service';
import { cn } from '@/utils/classname';

export interface AdminDashboardRecentAttemptsProps {
  activities: RecentAttemptItem[];
  onViewAllTryouts?: () => void;
  className?: string;
}

export const AdminDashboardRecentAttempts: React.FC<AdminDashboardRecentAttemptsProps> = ({
  activities,
  onViewAllTryouts,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-5 md:p-6 flex flex-col justify-between',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-1 rounded-full bg-teal-600 shrink-0" aria-hidden="true" />
            <h3 className="text-xs font-black text-slate-700 tracking-wider uppercase">
              Aktivitas Ujian Realtime
            </h3>
          </div>
          {onViewAllTryouts && (
            <button
              type="button"
              onClick={onViewAllTryouts}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Tryout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {activities.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 font-medium">
            Belum ada aktivitas pengerjaan tryout terbaru.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activities.slice(0, 5).map((act) => (
              <div key={act.attempt_id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-8 rounded-full bg-sky-50 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 border border-sky-100">
                    {act.student_name ? act.student_name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{act.student_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {act.tryout_title || 'Tryout TKA'} • {act.student_email}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Skor: {act.score !== null ? act.score : '-'}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {act.submitted_at
                      ? new Date(act.submitted_at).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Selesai'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardRecentAttempts;
