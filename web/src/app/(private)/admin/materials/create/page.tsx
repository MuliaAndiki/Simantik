import { Suspense } from 'react';
import { MaterialCreateContainer } from '@/app/(private)/content_manager/materials/create/_container/MaterialCreateContainer';

export default function AdminMaterialCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] w-full items-center justify-center text-sm text-slate-500 font-medium">
          Memuat formulir materi pembelajaran...
        </div>
      }
    >
      <MaterialCreateContainer />
    </Suspense>
  );
}
