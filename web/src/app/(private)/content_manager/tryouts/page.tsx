import { Trophy } from 'lucide-react';

export default function ContentManagerTryoutsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Trophy className="size-5 text-primary" />
        <h1 className="text-xl font-semibold">Manajemen Tryout</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Konfigurasi paket tryout, alokasi soal, durasi waktu, dan jadwal pelaksanaan ujian.
      </p>
    </div>
  );
}
