import { Suspense } from 'react';
import TutorialsCreateContainer from '@/app/(private)/content_manager/tutorials/create/_container/TutorialsCreateContainer';

export default function AdminTutorialsCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] w-full items-center justify-center text-sm text-slate-500 font-medium">
          Memuat formulir tutorial...
        </div>
      }
    >
      <TutorialsCreateContainer />
    </Suspense>
  );
}
