'use client';

import { useRouter } from 'next/navigation';
import { StudentTryoutPage } from '@/components/page/private/student/StudentTryoutPage';

export default function StudentTryout() {
  const router = useRouter();

  const handleStartTryout = () => {
    router.push('/student/tryout/auto');
  };

  return <StudentTryoutPage onStartTryout={handleStartTryout} />;
}
