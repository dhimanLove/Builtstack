'use client';

import { useEffect, useRef, createContext, useContext } from 'react';
import Lenis from '@studio-freight/lenis';
import { useMotionValue, useSpring, motionValue } from 'framer-motion';

// ── Context - expose lenis + scroll progress globally ─────────
interface LenisContextType {
  lenis: Lenis | null;
  scrollY: ReturnType<typeof motionValue<number>>;
  scrollProgress: ReturnType<typeof motionValue<number>>;
  velocity: ReturnType<typeof motionValue<number>>;
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollY: motionValue(0),
  scrollProgress: motionValue(0),
  velocity: motionValue(0),
});

export const useLenis = () => useContext(LenisContext);

// ── Provider ──────────────────────────────────────────────────
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  // Live motion values - any component can subscribe via useLenis()
  const scrollY        = useMotionValue(0);
  const scrollProgress = useMotionValue(0);
  const velocity       = useMotionValue(0);

  // Springified velocity for smooth-reading components
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
      infinite: false,
    });

    // Feed Lenis scroll data into motion values every frame
    lenisRef.current.on('scroll', ({
                                     scroll,
                                     progress,
                                     velocity: vel,
                                   }: {
      scroll: number;
      progress: number;
      velocity: number;
    }) => {
      scrollY.set(scroll);
      scrollProgress.set(progress);
      velocity.set(vel);
    });

    // RAF loop - Framer Motion's useAnimationFrame would conflict,
    // so we keep a dedicated loop just for Lenis
    let rafId: number;
    function raf(time: number) {
      lenisRef.current?.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Pause Lenis when tab is hidden - saves CPU
    const onVisibility = () => {
      if (document.hidden) {
        lenisRef.current?.stop();
      } else {
        lenisRef.current?.start();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      lenisRef.current?.destroy();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [scrollY, scrollProgress, velocity]);

  return (
      <LenisContext.Provider
          value={{
            lenis: lenisRef.current,
            scrollY,
            scrollProgress,
            velocity: smoothVelocity,
          }}
      >
        {children}
      </LenisContext.Provider>
  );
}