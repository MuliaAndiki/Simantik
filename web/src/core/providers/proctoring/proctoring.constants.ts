import type { ProctoringConfig } from './proctoring.types';

export const DEFAULT_PROCTORING_CONFIG: Required<ProctoringConfig> = {
  requireFullscreen: true,
  preventCopy: true,
  preventPaste: true,
  preventCut: true,
  preventContextMenu: true,
  preventDevtoolsShortcut: true,
  maxViolations: 3,
  deduplicationWindowMs: 750,
};
