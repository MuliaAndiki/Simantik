import { Suspense } from 'react';
import ContainerVerifyOtp from './_container/VerifyOtp';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ContainerVerifyOtp />
    </Suspense>
  );
}
