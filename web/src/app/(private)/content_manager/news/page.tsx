import { Newspaper } from 'lucide-react';

export default function ContentManagerNewsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Newspaper className="size-5 text-primary" />
        <h1 className="text-xl font-semibold">Manajemen Berita</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Publikasikan artikel, pengumuman, dan berita terbaru seputar pendidikan dan ujian.
      </p>
    </div>
  );
}
