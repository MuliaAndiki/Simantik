import type { LucideIcon } from 'lucide-react';
import type React from 'react';
import { cn } from '@/utils/classname';

export interface SettingsTabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface SettingsShellProps {
  kicker: string;
  title: string;
  description: string;
  roleBadge: React.ReactNode;
  tabs: SettingsTabItem[];
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Kerangka laman pengaturan (banner + navigasi tab + isi).
 * Bahasa desain disamakan dengan pengaturan admin: banner putih,
 * aksen teal, tab aktif bg-[#EAF6F8].
 */
export const SettingsShell: React.FC<SettingsShellProps> = ({
  kicker,
  title,
  description,
  roleBadge,
  tabs,
  activeTab,
  onActiveTabChange,
  children,
  className,
}) => {
  return (
    <div className={cn('w-full space-y-6', className)}>
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-3.5 w-1 rounded-full bg-teal-600 shrink-0" aria-hidden="true" />
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                {kicker}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100">
              {roleBadge}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6 border-b border-slate-100 pb-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onActiveTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#EAF6F8] text-teal-800 border border-cyan-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {children}
    </div>
  );
};

export default SettingsShell;
