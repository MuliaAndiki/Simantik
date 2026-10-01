'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactLenis, useLenis } from 'lenis/react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { ScrollScribbleTracker } from '@/components/atoms/doodles/ScribbleDoodles';

interface LenisProviderProps {
  children: ReactNode;
}

// Component to sync Lenis with GSAP ScrollTrigger
function ScrollTriggerSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Update ScrollTrigger on Lenis scroll
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on('scroll', handleScroll);

    // Set up GSAP ticker to drive Lenis smoothly
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);

    // Disable lag smoothing so animations stay crisp and synced
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after initial setup
    ScrollTrigger.refresh();

    return () => {
      lenis.off('scroll', handleScroll);
      gsap.ticker.remove(updateTicker);
    };
  }, [lenis]);

  return null;
}

export function LenisProvider({ children }: LenisProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
        autoRaf: false, // GSAP ticker drives RAF
      }}
    >
      <ScrollTriggerSync />
      <ScrollScribbleTracker />
      {children}
    </ReactLenis>
  );
}

export default LenisProvider;
