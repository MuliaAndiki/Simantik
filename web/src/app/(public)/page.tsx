import HomeContainer from './home/_containers/HomeContainer';

export const metadata = {
  title: 'SIMANTIK | Platform Pembelajaran & Asesmen Terintegrasi',
  description:
    'Platform pembelajaran adaptif dan asesmen cerdas berbasis kompetensi untuk siswa SMA/SMK se-Indonesia.',
};

export default function RootPublicPage() {
  return <HomeContainer />;
}
