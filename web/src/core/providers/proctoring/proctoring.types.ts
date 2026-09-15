export type ProctoringViolationType =
  | 'TAB_SWITCH'
  | 'WINDOW_BLUR'
  | 'EXIT_FULLSCREEN'
  | 'COPY_ATTEMPT'
  | 'PASTE_ATTEMPT'
  | 'CUT_ATTEMPT'
  | 'RIGHT_CLICK'
  | 'DEVTOOLS_SHORTCUT';

export interface ProctoringViolation {
  id: string;
  type: ProctoringViolationType;
  timestamp: number;
  occurredAt: string;
  metadata?: Record<string, unknown>;
}

export interface ProctoringConfig {
  requireFullscreen?: boolean;
  preventCopy?: boolean;
  preventPaste?: boolean;
  preventCut?: boolean;
  preventContextMenu?: boolean;
  preventDevtoolsShortcut?: boolean;
  maxViolations?: number;
  deduplicationWindowMs?: number;
}

export interface ProctoringContextValue {
  isActive: boolean;
  isFullscreen: boolean;
  supportsFullscreen: boolean;
  violationCount: number;
  violations: ProctoringViolation[];
  lastViolation: ProctoringViolation | null;
  startProctoring: () => Promise<void>;
  stopProctoring: () => void;
  enterFullscreen: () => Promise<void>;
  reportViolation: (type: ProctoringViolationType, metadata?: Record<string, unknown>) => void;
}
