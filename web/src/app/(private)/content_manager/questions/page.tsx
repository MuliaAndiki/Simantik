import { FileQuestion } from 'lucide-react';

export default function ContentManagerQuestionsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <FileQuestion className="size-5 text-primary" />
        <h1 className="text-xl font-semibold">Bank Soal</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Kelola bank soal, pemetaan kompetensi, tingkat kesulitan, dan kunci pembahasan.
      </p>
    </div>
  );
}
