import { Suspense } from 'react';
import ContainerResetPassword from './_container/ResetPassword';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ContainerResetPassword />
    </Suspense>
  );
}
