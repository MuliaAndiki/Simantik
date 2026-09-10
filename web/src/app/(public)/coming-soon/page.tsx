import { Metadata } from 'next';

import { ComingSoonPage } from '@/components/page';

export const metadata: Metadata = {
  title: 'Segera Hadir | SIMANTIK - Platform Asesmen Adaptif & Tryout',
  description:
    'Sistem simulasi ujian dan tryout adaptif modern berbasis Item Response Theory (IRT) oleh SIMANTIK educourse.id.',
};

export default function Page() {
  return <ComingSoonPage />;
}
