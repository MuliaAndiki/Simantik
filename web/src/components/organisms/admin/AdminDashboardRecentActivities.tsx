import React from 'react';
import type { AdminAuditLogItem } from '@/types/service';
import { cn } from '@/utils/classname';

export interface AdminDashboardRecentActivitiesProps {
  activities?: AdminAuditLogItem[];
  onViewAllLogs?: () => void;
  className?: string;
}

export const AdminDashboardRecentActivities: React.FC<AdminDashboardRecentActivitiesProps> = ({
  activities,
  onViewAllLogs,
  className,
}) => {
  const displayActivities = activities || [];

  const getAvatarColors = (name: string, index: number) => {
    const palette = [
      'bg-sky-50 text-sky-700 border-sky-100',
      'bg-amber-50 text-amber-700 border-amber-100',
      'bg-purple-50 text-purple-700 border-purple-100',
      'bg-emerald-50 text-emerald-700 border-emerald-100',
    ];
    return palette[index % palette.length];
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (name.slice(0, 2) || 'AD').toUpperCase();
  };

  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 flex flex-col justify-between select-none',
        className
      )}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Aktivitas Terbaru</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Audit log tindakan staf dan perbaruan data
            </p>
          </div>
          {onViewAllLogs && (
            <button
              type="button"
              onClick={onViewAllLogs}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors cursor-pointer"
            >
              Semua Log
            </button>
          )}
        </div>

        {/* Activity Items */}
        <div className="divide-y divide-slate-100 mt-1">
          {displayActivities.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">Belum ada aktivitas.</div>
          ) : (
            displayActivities.map((item, idx) => (
              <div key={item.id} className="py-3 flex items-start gap-3">
                <div
                  className={cn(
                    'size-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5',
                    getAvatarColors(item.user_name, idx)
                  )}
                >
                  {getInitials(item.user_name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-700 leading-snug">
                    <strong className="font-bold text-slate-900">{item.user_name}</strong>{' '}
                    <span className="text-slate-600">{item.action}</span>
                    {item.target_title ? (
                      <>
                        {' '}
                        <span className="font-bold text-teal-900">“{item.target_title}”</span>
                      </>
                    ) : null}
                  </p>
                  <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                    {item.relative_time || item.formatted_time || 'Baru saja'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardRecentActivities;
