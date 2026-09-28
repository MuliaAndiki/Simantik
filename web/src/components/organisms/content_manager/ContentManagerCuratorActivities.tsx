import React from 'react';
import { CardSkeleton } from '@/components/atoms/loading';
import { CuratorActivityItem } from '@/types/ui/content-manager-dashboard.types';
import { cn } from '@/utils/classname';

export interface ContentManagerCuratorActivitiesProps {
  activities?: CuratorActivityItem[];
  isLoading?: boolean;
  onOpenAuditTrail?: () => void;
  className?: string;
}

const DOT_COLOR_MAP: Record<CuratorActivityItem['dotColor'], string> = {
  yellow: 'bg-amber-400 ring-4 ring-amber-50',
  blue: 'bg-blue-500 ring-4 ring-blue-50',
  teal: 'bg-teal-500 ring-4 ring-teal-50',
  navy: 'bg-slate-700 ring-4 ring-slate-100',
};

export const ContentManagerCuratorActivities: React.FC<ContentManagerCuratorActivitiesProps> = ({
  activities,
  isLoading,
  onOpenAuditTrail,
  className,
}) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          'w-full bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-6 md:p-7 space-y-3',
          className
        )}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={`activity-skeleton-${i}`} lines={1} />
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) return null;
  const displayActivities = activities;

  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-6 md:p-7 flex flex-col justify-between',
        className
      )}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-4 bg-sky-500 rounded-full shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Aktivitas Kurator
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium shrink-0">Log Sistem</span>
        </div>

        {/* Timeline Activities */}
        <div className="space-y-4 mt-5">
          {displayActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="pt-1.5 shrink-0">
                <span
                  className={cn(
                    'block w-2.5 h-2.5 rounded-full transition-all',
                    DOT_COLOR_MAP[activity.dotColor] || DOT_COLOR_MAP.blue
                  )}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug break-words">
                  {activity.title}
                </p>
                <p className="text-[11px] text-slate-400 font-normal mt-0.5">{activity.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Button */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onOpenAuditTrail}
          className="w-full py-2.5 bg-[#F0F7FF] text-[#0284C7] hover:bg-[#E0F0FE] font-semibold text-xs rounded-xl transition text-center cursor-pointer"
        >
          Buka Audit Trail Lengkap
        </button>
      </div>
    </div>
  );
};

export default ContentManagerCuratorActivities;
