import { BarChart2, Check, Minus, Users } from 'lucide-react';
import React from 'react';

export interface PracticePackageStatCardsProps {
  totalStudentsCompleted: number;
  averageScore: number;
  highestScore: number;
  highestScoreStudentName: string;
  lowestScore: number;
  lowestScoreStudentName: string;
}

export const PracticePackageStatCards: React.FC<PracticePackageStatCardsProps> = ({
  totalStudentsCompleted,
  averageScore,
  highestScore,
  highestScoreStudentName,
  lowestScore,
}) => {
  const formattedAverage = averageScore
    ? averageScore.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : '0,0';

  const cards = [
    {
      label: 'Siswa Mengerjakan',
      value: totalStudentsCompleted,
      subtitle: 'Siswa telah menyelesaikan paket',
      subtitleColor: 'text-slate-500',
      valueColor: 'text-slate-900',
      icon: Users,
      iconBg: 'bg-[#EAF6F8] text-[#0E7490]',
    },
    {
      label: 'Rata-rata Nilai',
      value: formattedAverage,
      subtitle: 'Skor rata-rata kelompok',
      subtitleColor: 'text-slate-500',
      valueColor: 'text-slate-900',
      icon: BarChart2,
      iconBg: 'bg-[#FEF7EB] text-[#D97706]',
    },
    {
      label: 'Nilai Tertinggi',
      value: highestScore,
      subtitle: `Siswa: ${highestScoreStudentName || '-'}`,
      subtitleColor: 'text-slate-500',
      valueColor: 'text-slate-900',
      icon: Check,
      iconBg: 'bg-[#E8F8F3] text-[#059669]',
    },
    {
      label: 'Nilai Terendah',
      value: lowestScore,
      subtitle: 'Perlu pendampingan',
      subtitleColor: 'text-rose-600',
      valueColor: 'text-[#DC2626]',
      icon: Minus,
      iconBg: 'bg-[#FEF2F2] text-[#DC2626]',
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
              <span className="text-xs font-bold text-slate-700">{card.label}</span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${card.iconBg}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 space-y-0.5">
              <span className={`text-3xl font-black tracking-tight ${card.valueColor}`}>
                {card.value}
              </span>
              <p className={`text-xs font-medium truncate ${card.subtitleColor}`}>
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
