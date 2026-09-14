import { LayoutDashboard } from 'lucide-react';

export default function ContentManagerDashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="size-5 text-primary" />
        <h1 className="text-xl font-semibold">Dashboard Content Manager</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Kelola modul materi, bank soal, konfigurasi tryout, dan konten publik SIMANTIK.
      </p>
    </div>
  );
}
