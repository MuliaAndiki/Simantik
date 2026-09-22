import { Suspense } from 'react';
import NewsCreateContainer from './_container/NewsCreateContainer';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] w-full items-center justify-center text-sm text-slate-500 font-medium">
          Memuat formulir berita...
        </div>
      }
    >
      <NewsCreateContainer />
    </Suspense>
  );
}
