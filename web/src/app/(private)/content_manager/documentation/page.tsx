import { FileText } from 'lucide-react';

export default function ContentManagerDocumentationPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <FileText className="size-5 text-primary" />
        <h1 className="text-xl font-semibold">Manajemen Dokumentasi</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Kelola panduan platform, dokumentasi teknis, dan informasi sistem untuk publik.
      </p>
    </div>
  );
}
