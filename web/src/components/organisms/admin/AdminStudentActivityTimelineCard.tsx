import { History } from 'lucide-react';
import type React from 'react';
import { cn } from '@/utils/classname';

export interface TimelineActivityItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
}

export interface AdminStudentActivityTimelineCardProps {
  activities?: TimelineActivityItem[];
  onViewSystemLog?: () => void;
  className?: string;
}

export const AdminStudentActivityTimelineCard: React.FC<AdminStudentActivityTimelineCardProps> = ({
  activities,
  onViewSystemLog,
  className,
}) => {
  if (!activities || activities.length === 0) {
    return (
      <div
        className={cn(
          'w-full bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 space-y-5',
          className
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Aktivitas Terbaru</h3>
        </div>
        <p className="text-sm text-slate-400 font-medium">Belum ada aktivitas.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 space-y-5',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Aktivitas Terbaru</h3>
        </div>

        <button
          type="button"
          onClick={onViewSystemLog}
          className="text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors cursor-pointer"
        >
          Log Sistem
        </button>
      </div>

      {/* Timeline List */}
      <div className="relative pl-5 space-y-6 before:absolute before:left-2 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-150">
        {activities.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#134653] ring-4 ring-cyan-50 group-hover:scale-125 transition-transform" />

            {/* Content */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-700 block">{item.timestamp}</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStudentActivityTimelineCard;
