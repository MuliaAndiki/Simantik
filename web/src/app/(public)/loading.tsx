import { PublicPageLoader } from '@/components/atoms/loading';

export default function PublicLoading() {
  return (
    <div className="w-full flex-1 min-h-screen flex items-center justify-center bg-white">
      <PublicPageLoader
        label="Memuat Halaman..."
        sublabel="Menyiapkan data pembelajaran dan antarmuka SIMANTIK..."
        size="md"
        containerClassName="min-h-screen w-full flex-1"
      />
    </div>
  );
}
