import type React from 'react';

export interface ContributionStatItem {
  label: string;
  value: number | string;
  subtext: string;
}

export interface ContributionPanelProps {
  title: string;
  description: string;
  items: ContributionStatItem[];
  isLoading?: boolean;
  children?: React.ReactNode;
}

/** Panel ringkasan kontribusi (statistik + aksi lanjutan). */
export const ContributionPanel: React.FC<ContributionPanelProps> = ({
  title,
  description,
  items,
  isLoading = false,
  children,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{description}</p>
      </div>

      {isLoading ? (
        <p className="text-xs text-slate-500 font-medium">Memuat statistik...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.label} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-2xl font-black text-slate-900">{item.value}</div>
              <div className="text-xs font-bold text-slate-700 mt-1">{item.label}</div>
              <div className="text-[11px] text-slate-500 font-medium">{item.subtext}</div>
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  );
};

export default ContributionPanel;
