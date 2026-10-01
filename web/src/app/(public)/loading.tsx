import { PublicPageLoader } from '@/components/atoms/loading';

export default function PublicLoading() {
  return (
    <PublicPageLoader
      label="Memuat Halaman..."
      sublabel="Menyiapkan data pembelajaran dan antarmuka SIMANTIK..."
      size="md"
    />
  );
}
