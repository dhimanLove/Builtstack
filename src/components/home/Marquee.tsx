'use client';

import { useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useAnimationFrame,
  useMotionValue,
} from 'framer-motion';

const ITEMS = [
  'Web Applications',
  'SaaS Platforms',
  'Brand Identity',
  'Mobile Apps',
  'Design Systems',
  'API Development',
  'UI/UX Design',
  'TypeScript',
  'Next.js',
  'Performance',
];

// More repetition = smoother illusion
const REPEATED = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

function VelocityRow({ baseVelocity = -40 }: { baseVelocity?: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const baseX = useMotionValue(0);

  const { scrollY } = useScroll();
  const scrollVel = useVelocity(scrollY);

  // 🔥 Better spring (responsive but smooth)
  const smoothVel = useSpring(scrollVel, {
    damping: 25,
    stiffness: 180,
    mass: 0.4,
  });

  // 🔥 More stable velocity mapping
  const velocityFactor = useTransform(
    smoothVel,
    [-1500, 0, 1500],
    [-2, 0, 2],
    { clamp: false }
  );

  const widthRef = useRef(0);

  // Cache width once (no layout thrash)
  useEffect(() => {
    if (containerRef.current) {
      widthRef.current = containerRef.current.scrollWidth / 2;
    }
  }, []);

  useAnimationFrame((_, delta) => {
    const deltaSeconds = delta / 1000;

    // Base movement (time-based, not frame-based)
    let move = baseVelocity * deltaSeconds;

    // Add scroll influence
    move += velocityFactor.get() * baseVelocity * 0.5;

    baseX.set(baseX.get() + move);

    const width = widthRef.current || 2000;

    // 🔥 Seamless wrap using modulo (no snapping)
    let wrapped = baseX.get() % width;

    if (wrapped < -width) wrapped += width;
    if (wrapped > 0) wrapped -= width;

    x.set(wrapped);
  });

  return (
    <div className="flex overflow-hidden" style={{ height: 88 }}>
      <motion.div
        ref={containerRef}
        className="flex shrink-0 items-center"
        style={{ x, willChange: 'transform' }}
      >
        {REPEATED.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span
              className="whitespace-nowrap font-light"
              style={{
                fontSize: 'clamp(1.3rem, 2.2vw, 2rem)',
                color: '#5a5a56',
                paddingLeft: '2.5rem',
                paddingRight: '2.5rem',
                letterSpacing: '-0.01em',
              }}
            >
              {item}
            </span>
            <span
              className="rounded-full shrink-0"
              style={{ width: 6, height: 6, background: '#d4f53c' }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section
      className="overflow-hidden"
      style={{
        borderTop: '1px solid #1e1e1e',
        borderBottom: '1px solid #1e1e1e',
      }}
    >
      <div style={{ borderBottom: '1px solid #1e1e1e' }}>
        <VelocityRow baseVelocity={-40} />
      </div>
      <VelocityRow baseVelocity={40} />
    </section>
  );
}