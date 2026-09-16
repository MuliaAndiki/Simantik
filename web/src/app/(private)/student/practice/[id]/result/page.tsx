import { Suspense } from 'react';
import StudentPracticeResult from './_container/StudentPracticeResult';

export default function StudentPracticeResultRoute() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto p-12 text-center text-slate-500 font-medium">
          Memuat pembahasan latihan...
        </div>
      }
    >
      <StudentPracticeResult />
    </Suspense>
  );
}
