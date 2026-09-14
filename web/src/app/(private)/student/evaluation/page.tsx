import { BarChart3 } from 'lucide-react';

export default function StudentEvaluasiPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="size-5 text-primary" />
        <h1 className="text-xl font-semibold">Evaluasi & Analisis Kemampuan</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Lihat analisis kompetensi, kekuatan, dan area yang perlu ditingkatkan.
      </p>
    </div>
  );
}
