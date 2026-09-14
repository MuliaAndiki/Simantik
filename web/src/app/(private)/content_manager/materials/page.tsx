import { BookOpen } from 'lucide-react';

export default function ContentManagerMaterialsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <BookOpen className="size-5 text-primary" />
        <h1 className="text-xl font-semibold">Manajemen Materi</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Buat, tinjau, dan publikasikan materi pembelajaran kurikulum SMA/SMK.
      </p>
    </div>
  );
}
