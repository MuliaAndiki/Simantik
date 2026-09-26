'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_PROCTORING_CONFIG } from './proctoring.constants';
import { ProctoringContext } from './proctoring.context';
import type {
  ProctoringConfig,
  ProctoringViolation,
  ProctoringViolationType,
} from './proctoring.types';

interface ProctoringProviderProps {
  children: ReactNode;
  config?: ProctoringConfig;
  onViolation?: (violation: ProctoringViolation) => void;
  onMaxViolationReached?: (violations: ProctoringViolation[]) => void;
}

function generateViolationId(type: ProctoringViolationType, now: number): string {
  const cryptoApi = typeof crypto !== 'undefined' ? crypto : undefined;
  if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
    return cryptoApi.randomUUID();
  }
  return `${type}-${now}-${Math.random().toString(36).slice(2, 10)}`;
}

function createViolation(
  type: ProctoringViolationType,
  metadata?: Record<string, unknown>
): ProctoringViolation {
  const now = Date.now();
  return {
    id: generateViolationId(type, now),
    type,
    timestamp: now,
    occurredAt: new Date(now).toISOString(),
    metadata,
  };
}

export function ProctoringProvider({
  children,
  config,
  onViolation,
  onMaxViolationReached,
}: ProctoringProviderProps) {
  const resolvedConfig = useMemo<Required<ProctoringConfig>>(
    () => ({ ...DEFAULT_PROCTORING_CONFIG, ...config }),
    [config]
  );

  const [isActive, setIsActiveState] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [supportsFullscreen, setSupportsFullscreen] = useState(false);
  const [violations, setViolations] = useState<ProctoringViolation[]>([]);

  // Refs hold the latest values so the stable event handlers never go stale.
  const configRef = useRef(resolvedConfig);
  const onViolationRef = useRef(onViolation);
  const onMaxViolationReachedRef = useRef(onMaxViolationReached);
  const isActiveRef = useRef(false);
  const violationsRef = useRef<ProctoringViolation[]>([]);
  const maxReachedRef = useRef(false);
  const lastViolationAtRef = useRef(0);

  useEffect(() => {
    configRef.current = resolvedConfig;
    onViolationRef.current = onViolation;
    onMaxViolationReachedRef.current = onMaxViolationReached;
  }, [resolvedConfig, onViolation, onMaxViolationReached]);

  useEffect(() => {
    setSupportsFullscreen(
      typeof document !== 'undefined' &&
        typeof document.documentElement.requestFullscreen === 'function'
    );
  }, []);

  const setIsActive = useCallback((value: boolean) => {
    isActiveRef.current = value;
    setIsActiveState(value);
  }, []);

  const reportViolation = useCallback(
    (type: ProctoringViolationType, metadata?: Record<string, unknown>) => {
      if (!isActiveRef.current) return;

      const cfg = configRef.current;
      const now = Date.now();

      if (now - lastViolationAtRef.current < cfg.deduplicationWindowMs) {
        return;
      }
      lastViolationAtRef.current = now;

      const violation = createViolation(type, metadata);
      const next = [...violationsRef.current, violation];
      violationsRef.current = next;
      setViolations(next);

      onViolationRef.current?.(violation);

      if (!maxReachedRef.current && next.length >= cfg.maxViolations) {
        maxReachedRef.current = true;
        onMaxViolationReachedRef.current?.(next);
      }
    },
    []
  );

  const enterFullscreen = useCallback(async () => {
    const el = typeof document !== 'undefined' ? document.documentElement : null;
    if (!el || typeof el.requestFullscreen !== 'function') return;

    try {
      await el.requestFullscreen();
      setIsFullscreen(true);
    } catch {
      setIsFullscreen(false);
    }
  }, []);

  const startProctoring = useCallback(async () => {
    violationsRef.current = [];
    setViolations([]);
    maxReachedRef.current = false;
    lastViolationAtRef.current = 0;

    setIsActive(true);

    if (configRef.current.requireFullscreen) {
      await enterFullscreen();
    }
  }, [enterFullscreen, setIsActive]);

  const stopProctoring = useCallback(() => {
    setIsActive(false);

    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, [setIsActive]);

  useEffect(() => {
    if (!isActive) return;

    let blurTimeout: NodeJS.Timeout;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        blurTimeout = setTimeout(() => {
          reportViolation('TAB_SWITCH', { visibilityState: document.visibilityState });
        }, 3000);
      } else {
        clearTimeout(blurTimeout);
      }
    };

    const handleBlur = () => {
      blurTimeout = setTimeout(() => {
        reportViolation('WINDOW_BLUR');
      }, 3000);
    };

    const handleFocus = () => {
      clearTimeout(blurTimeout);
    };

    const handleFullscreenChange = () => {
      const fullscreen = document.fullscreenElement !== null;
      setIsFullscreen(fullscreen);
      if (!fullscreen) {
        reportViolation('EXIT_FULLSCREEN');
      }
    };

    const handleCopy = (event: ClipboardEvent) => {
      reportViolation('COPY_ATTEMPT');
      if (configRef.current.preventCopy) event.preventDefault();
    };

    const handlePaste = (event: ClipboardEvent) => {
      reportViolation('PASTE_ATTEMPT');
      if (configRef.current.preventPaste) event.preventDefault();
    };

    const handleCut = (event: ClipboardEvent) => {
      reportViolation('CUT_ATTEMPT');
      if (configRef.current.preventCut) event.preventDefault();
    };

    const handleContextMenu = (event: MouseEvent) => {
      reportViolation('RIGHT_CLICK');
      if (configRef.current.preventContextMenu) event.preventDefault();
    };

    const handleKeydown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      const isDevtoolsShortcut =
        event.key === 'F12' ||
        (event.ctrlKey && event.shiftKey && (key === 'I' || key === 'J' || key === 'C'));

      if (!isDevtoolsShortcut) return;

      reportViolation('DEVTOOLS_SHORTCUT', { key: event.key });
      if (configRef.current.preventDevtoolsShortcut) event.preventDefault();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [isActive, reportViolation]);

  const value = useMemo(
    () => ({
      isActive,
      isFullscreen,
      supportsFullscreen,
      violationCount: violations.length,
      violations,
      lastViolation: violations.length > 0 ? violations[violations.length - 1] : null,
      startProctoring,
      stopProctoring,
      enterFullscreen,
      reportViolation,
    }),
    [
      isActive,
      isFullscreen,
      supportsFullscreen,
      violations,
      startProctoring,
      stopProctoring,
      enterFullscreen,
      reportViolation,
    ]
  );

  return <ProctoringContext.Provider value={value}>{children}</ProctoringContext.Provider>;
}
