import { MessageSquareQuote } from 'lucide-react';

export default function ContentManagerTestimonialsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <MessageSquareQuote className="size-5 text-primary" />
        <h1 className="text-xl font-semibold">Manajemen Testimoni</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Tinjau, moderasi, dan kelola testimoni siswa yang ditampilkan pada halaman publik.
      </p>
    </div>
  );
}
