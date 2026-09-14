import { Users } from 'lucide-react';

export default function AdminStudentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Users className="size-5 text-primary" />
        <h1 className="text-xl font-semibold">Manajemen Siswa</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Kelola data akun siswa, status aktif, dan pantau progres pembelajaran.
      </p>
    </div>
  );
}
