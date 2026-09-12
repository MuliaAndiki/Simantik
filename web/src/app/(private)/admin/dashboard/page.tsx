import { LayoutDashboard } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="size-5 text-primary" />
        <h1 className="text-xl font-semibold">Dashboard Admin</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Selamat datang di panel admin. Kelola siswa, sekolah, dan konten SIMANTIK dari sini.
      </p>
    </div>
  );
}
