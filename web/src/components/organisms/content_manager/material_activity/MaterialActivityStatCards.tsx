import { CheckCircle2, Hourglass, Percent, Users } from 'lucide-react';
import React from 'react';

export interface MaterialActivityStatCardsProps {
  totalStudents: number;
  accessedStudents: number;
  unaccessedStudents: number;
  participationRate: number;
}

export const MaterialActivityStatCards: React.FC<MaterialActivityStatCardsProps> = ({
  totalStudents,
  accessedStudents,
  unaccessedStudents,
  participationRate,
}) => {
  const cards = [
    {
      label: 'TOTAL SISWA',
      value: totalStudents,
      subtitle: 'Siswa Terdaftar',
      subtitleColor: 'text-slate-500',
      icon: Users,
      iconBg: 'bg-[#EBF7FC] text-[#0284C7]',
    },
    {
      label: 'SUDAH DIAKSES',
      value: accessedStudents,
      subtitle: 'Telah membuka',
      subtitleColor: 'text-[#059669]',
      icon: CheckCircle2,
      iconBg: 'bg-[#E8F8F3] text-[#059669]',
    },
    {
      label: 'BELUM DIAKSES',
      value: unaccessedStudents,
      subtitle: 'Belum membuka',
      subtitleColor: 'text-slate-400',
      icon: Hourglass,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'PERSENTASE',
      value: `${Math.round(participationRate)}%`,
      subtitle: 'Rasio Partisipasi',
      subtitleColor: 'text-slate-500',
      icon: Percent,
      iconBg: 'bg-[#FEF7EB] text-[#D97706]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {card.label}
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 space-y-0.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {card.value}
              </span>
              <p className={`text-xs font-semibold ${card.subtitleColor}`}>{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
