import { BarChart3, SquarePen, Target } from 'lucide-react';
import type * as React from 'react';
import { DashboardSectionHeader } from '@/components/molecules/student/DashboardSectionHeader';
import { QuickActionCard } from '@/components/molecules/student/QuickActionCard';
import { cn } from '@/utils/classname';

export interface QuickActionsGridProps {
  onStartPractice?: () => void;
  onStartTryout?: () => void;
  onViewEvaluation?: () => void;
  practiceHref?: string;
  tryoutHref?: string;
  evaluationHref?: string;
  className?: string;
}

export function QuickActionsGrid({
  onStartPractice,
  onStartTryout,
  onViewEvaluation,
  practiceHref = '/student/practice',
  tryoutHref = '/student/tryout',
  evaluationHref = '/student/evaluation',
  className,
}: QuickActionsGridProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <DashboardSectionHeader
        title="Mulai Sekarang"
        subtitle="Pilih menu cepat untuk langsung beraktivitas dalam pembelajaranmu"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <QuickActionCard
          title="Mulai Latihan"
          description="Uji pemahamanmu secara berkala melalui paket latihan soal terstruktur."
          actionText="Mulai Latihan Sekarang"
          href={practiceHref}
          onClick={onStartPractice}
          icon={SquarePen}
          iconBgColor="bg-[#E0F7FA]"
          iconColor="text-[#0284c7]"
        />

        <QuickActionCard
          title="Mulai Tryout"
          description="Simulasikan ujian TKA berstandar nasional dengan batas waktu pengerjaan."
          actionText="Buka Sesi Tryout"
          href={tryoutHref}
          onClick={onStartTryout}
          icon={Target}
          iconBgColor="bg-[#FEF3C7]"
          iconColor="text-[#D97706]"
        />

        <QuickActionCard
          title="Lihat Evaluasi"
          description="Pantau analisis kekuatan materi dan capaian kompetensi Bahasa Indonesia."
          actionText="Cek Analisis Lengkap"
          href={evaluationHref}
          onClick={onViewEvaluation}
          icon={BarChart3}
          iconBgColor="bg-[#EFF6FF]"
          iconColor="text-[#2563EB]"
        />
      </div>
    </section>
  );
}
