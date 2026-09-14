import { User } from 'lucide-react';

export default function StudentProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <User className="size-5 text-primary" />
        <h1 className="text-xl font-semibold">Profil Siswa</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Kelola informasi akun, profil akademik, dan preferensi belajarmu.
      </p>
    </div>
  );
}
