import { School } from 'lucide-react';

export default function AdminSchoolsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <School className="size-5 text-primary" />
        <h1 className="text-xl font-semibold">Manajemen Sekolah</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Kelola master data sekolah (NPSN, jenjang, status negeri/swasta, alamat wilayah).
      </p>
    </div>
  );
}
