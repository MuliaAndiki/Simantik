'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { TryoutPreStartModal } from '@/components/organisms/student/TryoutPreStartModal';
import { StudentTryoutPage } from '@/components/page/private/student/StudentTryoutPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';

// Minimal latihan yang harus diselesaikan siswa sebelum mengerjakan tryout.
const MIN_COMPLETED_PRACTICES = 1;

export default function StudentTryout() {
  const router = useRouter();
  const ns = useAppNameSpace();
  const { tryout, practice } = useApi();

  // Fetch tryout list. Filtering by PUBLISHED is ideal; fallback to client-side.
  const { data, isLoading } = tryout.query.list({ limit: 50 });

  // Jumlah latihan berstatus completed milik siswa (cukup baca total).
  const { data: completedPractices } = practice.query.attempts({
    status: 'completed',
    limit: 1,
  });
  const completedCount = completedPractices?.total ?? 0;

  // Peringatan sekali saat data sudah termuat bila latihan belum memenuhi minimum.
  const hasWarnedRef = useRef(false);
  useEffect(() => {
    if (hasWarnedRef.current || completedPractices === undefined) return;
    if (completedCount < MIN_COMPLETED_PRACTICES) {
      hasWarnedRef.current = true;
      ns.alert.toast({
        title: 'Latihan Belum Cukup',
        message: `Kamu baru menyelesaikan ${completedCount} latihan (minimum ${MIN_COMPLETED_PRACTICES}). Selesaikan latihan dulu agar hasil tryout lebih maksimal.`,
        icon: 'warning',
      });
    }
  }, [completedPractices, completedCount, ns.alert]);

  const tryouts =
    data?.tryouts
      ?.filter((t) => t.status === 'PUBLISHED')
      ?.map((t) => ({
        id: t.id,
        title: t.title,
        description:
          t.description ||
          `Jenjang: ${t.jenjang}, Kedaluwarsa: ${t.end_at ? new Date(t.end_at).toLocaleDateString() : 'Tanpa Batas'}`,
        durationMinutes: t.duration_seconds ? Math.round(t.duration_seconds / 60) : undefined,
        totalQuestions: t.total_questions || undefined,
        onStartTryout: () => handleStartClick(t.id),
      })) ?? [];

  // Pre-start modal (seperti practice): klik mulai → popup aturan → konfirmasi → masuk sesi.
  const [selectedTryout, setSelectedTryout] = useState<{
    id: string;
    durationMinutes?: number;
    totalQuestions?: number;
  } | null>(null);
  const [isPreStartOpen, setIsPreStartOpen] = useState(false);
  const [isPreStartChecked, setIsPreStartChecked] = useState(false);

  function handleStartClick(tryoutId: string) {
    const target = tryouts.find((t) => t.id === tryoutId);
    setSelectedTryout(
      target
        ? {
            id: target.id,
            durationMinutes: target.durationMinutes,
            totalQuestions: target.totalQuestions,
          }
        : { id: tryoutId }
    );
    setIsPreStartChecked(false);
    setIsPreStartOpen(true);
  }

  function handlePreStartClose() {
    setIsPreStartOpen(false);
    setSelectedTryout(null);
  }

  // Fallback hero (katalog kosong): modal mode auto, backend yang mencocokkan tryout.
  function handleFallbackStart() {
    setSelectedTryout({ id: 'auto' });
    setIsPreStartChecked(false);
    setIsPreStartOpen(true);
  }

  function handlePreStartConfirm() {
    if (!selectedTryout) return;
    setIsPreStartOpen(false);
    // confirmed=1 agar halaman detail langsung mulai tanpa modal ganda.
    router.push(`/student/tryout/${selectedTryout.id}?confirmed=1`);
  }

  if (isLoading) return <div>Memuat data tryout...</div>;

  return (
    <>
      <StudentTryoutPage tryouts={tryouts} onStartTryout={handleFallbackStart} />
      <TryoutPreStartModal
        isOpen={isPreStartOpen}
        isChecked={isPreStartChecked}
        durationMinutes={selectedTryout?.durationMinutes}
        totalQuestions={selectedTryout?.totalQuestions}
        onCheckChange={setIsPreStartChecked}
        onConfirm={handlePreStartConfirm}
        onClose={handlePreStartClose}
      />
    </>
  );
}
