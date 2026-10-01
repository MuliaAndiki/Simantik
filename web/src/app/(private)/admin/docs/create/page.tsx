import { Suspense } from 'react';
import DocsCreateContainer from '@/app/(private)/content_manager/docs/create/_container/DocsCreateContainer';

export default function AdminDocsCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] w-full items-center justify-center text-sm text-slate-500 font-medium">
          Memuat formulir dokumentasi...
        </div>
      }
    >
      <DocsCreateContainer />
    </Suspense>
  );
}
