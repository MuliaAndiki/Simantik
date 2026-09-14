import { Sparkles } from 'lucide-react';

export default function StudentBelajarRekomendasiPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-primary" />
        <h1 className="text-xl font-semibold">Rekomendasi Materi</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Materi yang direkomendasikan sistem berdasarkan analisis kemampuan dan hasil evaluasimu.
      </p>
    </div>
  );
}
