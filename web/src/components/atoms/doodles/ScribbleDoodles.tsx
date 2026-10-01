'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/classname';

// ============================================================================
// 1. Scribble Underline (Garis Coretan Bawah Kata / Headline)
// ============================================================================

export interface ScribbleUnderlineProps {
  className?: string;
  variant?: 'wavy' | 'double' | 'sketch' | 'zigzag' | 'loop';
  color?: string;
  delayMs?: number;
}

export function ScribbleUnderline({
  className,
  variant = 'wavy',
  color = 'currentColor',
  delayMs = 150,
}: ScribbleUnderlineProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delayMs);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <span
      ref={containerRef}
      className={cn('absolute -bottom-2.5 left-0 right-0 h-3.5 pointer-events-none z-0', className)}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 250 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        <title>Scribble underline</title>
        {variant === 'wavy' && (
          <path
            d="M3 14C35 4 65 18 100 10C140 2 180 16 247 6"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="300"
            strokeDashoffset={isVisible ? 0 : 300}
            style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.65, 0, 0.35, 1)' }}
          />
        )}

        {variant === 'double' && (
          <>
            <path
              d="M4 8C45 3 115 12 245 4"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="300"
              strokeDashoffset={isVisible ? 0 : 300}
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.65, 0, 0.35, 1)' }}
            />
            <path
              d="M12 15C60 9 140 18 240 11"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="300"
              strokeDashoffset={isVisible ? 0 : 300}
              style={{
                transition: 'stroke-dashoffset 0.9s cubic-bezier(0.65, 0, 0.35, 1) 0.15s',
              }}
            />
          </>
        )}

        {variant === 'sketch' && (
          <path
            d="M3 12C20 6 50 14 85 9C120 4 150 15 185 8C210 3 235 12 247 7"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="300"
            strokeDashoffset={isVisible ? 0 : 300}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.65, 0, 0.35, 1)' }}
          />
        )}

        {variant === 'zigzag' && (
          <path
            d="M4 14L25 5L50 15L75 6L100 14L125 5L150 15L175 6L200 14L225 5L246 12"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="350"
            strokeDashoffset={isVisible ? 0 : 350}
            style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.65, 0, 0.35, 1)' }}
          />
        )}

        {variant === 'loop' && (
          <path
            d="M3 13C40 14 70 3 95 12C120 20 150 4 180 12C205 18 230 7 247 11"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="300"
            strokeDashoffset={isVisible ? 0 : 300}
            style={{ transition: 'stroke-dashoffset 0.85s cubic-bezier(0.65, 0, 0.35, 1)' }}
          />
        )}
      </svg>
    </span>
  );
}

// ============================================================================
// 2. Scribble Circle (Lingkaran Coretan Pensil di Sekitar Kata / Skor)
// ============================================================================

export interface ScribbleCircleProps {
  children?: React.ReactNode;
  className?: string;
  circleColor?: string;
  strokeWidth?: number;
}

export function ScribbleCircle({
  children,
  className,
  circleColor = '#F5B731',
  strokeWidth = 2.5,
}: ScribbleCircleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.25 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={cn('relative inline-block px-2 py-0.5', className)}>
      <span className="relative z-10">{children}</span>
      <svg
        viewBox="0 0 120 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] pointer-events-none z-0 overflow-visible"
      >
        <title>Scribble circle</title>
        <path
          d="M12 28C6 14 30 4 60 5C95 6 114 16 112 30C109 43 78 47 45 45C18 43 4 33 8 20C11 10 32 6 52 7"
          stroke={circleColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="400"
          strokeDashoffset={isVisible ? 0 : 400}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.65, 0, 0.35, 1) 0.1s' }}
        />
      </svg>
    </span>
  );
}

// ============================================================================
// 3. Scribble Arrow (Panah Coretan Pensil Tangan)
// ============================================================================

export interface ScribbleArrowProps {
  className?: string;
  color?: string;
  direction?: 'left' | 'right' | 'down' | 'curve-up';
}

export function ScribbleArrow({
  className,
  color = '#0D9488',
  direction = 'curve-up',
}: ScribbleArrowProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={cn('inline-block pointer-events-none', className)}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 80 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-10 overflow-visible"
      >
        <title>Scribble arrow</title>
        {direction === 'curve-up' && (
          <>
            <path
              d="M10 42C25 45 50 35 60 15"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={isVisible ? 0 : 100}
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
            <path
              d="M46 12L61 14L63 28"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="60"
              strokeDashoffset={isVisible ? 0 : 60}
              style={{ transition: 'stroke-dashoffset 0.5s ease 0.4s' }}
            />
          </>
        )}

        {direction === 'down' && (
          <>
            <path
              d="M38 4C42 18 36 30 40 42"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={isVisible ? 0 : 100}
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
            <path
              d="M28 32L40 44L52 33"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="60"
              strokeDashoffset={isVisible ? 0 : 60}
              style={{ transition: 'stroke-dashoffset 0.5s ease 0.4s' }}
            />
          </>
        )}

        {direction === 'right' && (
          <>
            <path
              d="M6 25C24 22 48 26 70 24"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={isVisible ? 0 : 100}
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
            <path
              d="M58 14L72 24L57 35"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="60"
              strokeDashoffset={isVisible ? 0 : 60}
              style={{ transition: 'stroke-dashoffset 0.5s ease 0.4s' }}
            />
          </>
        )}

        {direction === 'left' && (
          <>
            <path
              d="M74 25C56 22 32 26 10 24"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={isVisible ? 0 : 100}
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
            <path
              d="M22 14L8 24L23 35"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="60"
              strokeDashoffset={isVisible ? 0 : 60}
              style={{ transition: 'stroke-dashoffset 0.5s ease 0.4s' }}
            />
          </>
        )}
      </svg>
    </span>
  );
}

// ============================================================================
// 4. Scribble Sparkle / Star (Bintang & Kilauan Tangan)
// ============================================================================

export interface ScribbleSparkleProps {
  className?: string;
  color?: string;
  size?: number;
}

export function ScribbleSparkle({ className, color = '#F5B731', size = 24 }: ScribbleSparkleProps) {
  return (
    <span
      className={cn('inline-block pointer-events-none animate-scribble-float', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <title>Scribble sparkle</title>
        <path
          d="M12 2C12.8 7.5 16.5 11.2 22 12C16.5 12.8 12.8 16.5 12 22C11.2 16.5 7.5 12.8 2 12C7.5 11.2 11.2 7.5 12 2Z"
          fill={color}
          opacity="0.9"
        />
      </svg>
    </span>
  );
}

// ============================================================================
// 5. Scroll Scribble Top Tracker (Indikator Coretan Garis Halus saat Scrolling)
// ============================================================================

export function ScrollScribbleTracker() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const progress = Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-60 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="h-full bg-linear-to-r from-teal-500 via-amber-400 to-teal-600 transition-all duration-75 ease-out rounded-r-full shadow-xs"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

export default ScribbleUnderline;
