import { Video } from 'lucide-react';

export default function ContentManagerTutorialsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Video className="size-5 text-primary" />
        <h1 className="text-xl font-semibold">Manajemen Tutorial</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Kelola video panduan dan tutorial penggunaan platform untuk siswa dan guru.
      </p>
    </div>
  );
}
