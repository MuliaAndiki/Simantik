import { createContext } from 'react';
import type { ProctoringContextValue } from './proctoring.types';

export const ProctoringContext = createContext<ProctoringContextValue | null>(null);
