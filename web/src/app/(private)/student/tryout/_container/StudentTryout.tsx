'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
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
        title: t.title,
        description:
          t.description ||
          `Jenjang: ${t.jenjang}, Kedaluwarsa: ${t.end_at ? new Date(t.end_at).toLocaleDateString() : 'Tanpa Batas'}`,
        onStartTryout: () => router.push(`/student/tryout/${t.id}`),
      })) ?? [];

  if (isLoading) return <div>Memuat data tryout...</div>;

  return <StudentTryoutPage tryouts={tryouts} />;
}
