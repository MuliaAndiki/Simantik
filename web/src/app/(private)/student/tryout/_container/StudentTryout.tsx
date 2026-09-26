'use client';

import { useRouter } from 'next/navigation';
import { StudentTryoutPage } from '@/components/page/private/student/StudentTryoutPage';
import { useApi } from '@/hooks/useApi';

export default function StudentTryout() {
  const router = useRouter();
  const { tryout } = useApi();

  // Fetch tryout list. Filtering by PUBLISHED is ideal; fallback to client-side.
  const { data, isLoading } = tryout.query.list({ limit: 50 });

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
