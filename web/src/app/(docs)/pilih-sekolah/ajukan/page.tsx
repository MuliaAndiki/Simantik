import type { Metadata } from 'next';
import { Suspense } from 'react';
import { buildPageMetadata } from '@/utils/seo-metadata.util';
import ContainerAjukanSekolah from './_container/AjukanSekolah';

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: 'Ajukan Sekolah Baru',
    description:
      'Ajukan data sekolah baru lengkap dengan titik koordinat peta OpenStreetMap dan wilayah administratif untuk diverifikasi admin SIMANTIK.',
    canonicalPath: '/pilih-sekolah/ajukan',
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-sm text-slate-500">
          Memuat halaman pengajuan sekolah...
        </div>
      }
    >
      <ContainerAjukanSekolah />
    </Suspense>
  );
}
