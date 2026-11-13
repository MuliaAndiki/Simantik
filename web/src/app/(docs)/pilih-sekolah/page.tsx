import { buildPageMetadata } from '@/utils/seo-metadata.util';
import ContainerPilihSekolah from './_container/PilihSekolah';

export const metadata = buildPageMetadata({
  title: 'Pilih Sekolah & Jenjang',
  description:
    'Pilih asal sekolah SMA/SMK dan jenjang kelas untuk menyesuaikan pengalaman belajar mandiri dan tryout TKA Bahasa Indonesia di SIMANTIK.',
  canonicalPath: '/pilih-sekolah',
});

export default function Page() {
  return <ContainerPilihSekolah />;
}
