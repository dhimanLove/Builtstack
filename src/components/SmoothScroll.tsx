'use client';

import { useEffect, useRef, createContext, useContext } from 'react';
import Lenis from '@studio-freight/lenis';
import { useMotionValue, useSpring, motionValue } from 'framer-motion';

// Context
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

// eslint-disable-next-line react-refresh/only-export-components
export const useLenis = () => useContext(LenisContext);


// Provider

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  // Motion values (global reactive scroll state)
  const scrollY = useMotionValue(0);
  const scrollProgress = useMotionValue(0);
  const velocity = useMotionValue(0);

  // Smooth velocity (more natural feel)
  const smoothVelocity = useSpring(velocity, {
    damping: 30,
    stiffness: 200,
    mass: 0.5,
  });

  useEffect(() => {

    // Lenis Init (optimized)

    const lenis = new Lenis({
      duration: 1.1, // faster but smoother perception
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // cubic ease-out
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      infinite: false,
    });

    lenisRef.current = lenis;


    // Sync Lenis -> Motion Values

    lenis.on('scroll', ({ scroll, progress, velocity: vel }) => {
      scrollY.set(scroll);
      scrollProgress.set(progress);
      velocity.set(vel);
    });


    // RAF Loop (stable + efficient)

    let rafId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);


    // Pause on tab switch (perf boost)

    const onVisibility = () => {
      if (document.hidden) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);

     
    // Cleanup

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [scrollProgress, scrollY, velocity]);

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