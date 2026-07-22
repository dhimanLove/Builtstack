import { useEffect, useRef, createContext, useContext, useCallback } from 'react';
import Lenis from '@studio-freight/lenis';
import { useMotionValue, useSpring, motionValue, useReducedMotion } from 'framer-motion';

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

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();

  const scrollY = useMotionValue(0);
  const scrollProgress = useMotionValue(0);
  const velocity = useMotionValue(0);

  const smoothVelocity = useSpring(velocity, {
    damping: 30,
    stiffness: 200,
    mass: 0.5,
  });

  const rafRef = useRef<number | null>(null);

  const raf = useCallback((time: number) => {
    lenisRef.current?.raf(time);
    rafRef.current = requestAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: reducedMotion ? 0 : 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      orientation: 'vertical',
      smoothWheel: !reducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      infinite: false,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ({ scroll, progress, velocity: vel }) => {
      scrollY.set(scroll);
      scrollProgress.set(progress);
      velocity.set(vel);
    });

    rafRef.current = requestAnimationFrame(raf);

    const onVisibility = () => {
      if (document.hidden) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onResize = () => lenis.resize();
    window.addEventListener('resize', onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
    };
  }, [raf, scrollProgress, scrollY, velocity, reducedMotion]);

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
