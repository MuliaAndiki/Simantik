'use client';

import { useContext } from 'react';
import type { ProctoringContextValue } from '@/core/providers/proctoring';
import { ProctoringContext } from '@/core/providers/proctoring';

export function useProctoring(): ProctoringContextValue {
  const context = useContext(ProctoringContext);

  if (!context) {
    throw new Error('useProctoring must be used within a ProctoringProvider');
  }

  return context;
}

export { ProctoringProvider } from '@/core/providers/proctoring';
export default useProctoring;
