'use client';

import { useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

const EASE = [0.23, 1, 0.32, 1] as const; // Premium smoother easing

const shineVariants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1 },
};

const secondaryBorderVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 0.6 },
};

const secondaryOverlayVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1 },
};

// Improved Magnetic Button – Premium Edition
function MagneticButton({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smoother, more premium springs
  const sx = useSpring(x, {
    stiffness: 280,
    damping: 24,
    mass: 0.8,
  });
  const sy = useSpring(y, {
    stiffness: 280,
    damping: 24,
    mass: 0.8,
  });

  // Glow intensity tied to mouse distance
  const glowOpacity = useMotionValue(0);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const centerX = r.left + r.width / 2;
    const centerY = r.top + r.height / 2;

    const distX = (e.clientX - centerX) * 0.32;
    const distY = (e.clientY - centerY) * 0.32;

    x.set(distX);
    y.set(distY);

    // Dynamic glow based on distance from center
    const distance = Math.sqrt(distX * distX + distY * distY);
    glowOpacity.set(Math.min(distance / 80, 1));
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
    glowOpacity.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: reducedMotion ? 1 : 0.96 }}
      initial="rest"
      whileHover="hover"
      style={{
        x: reducedMotion ? 0 : sx,
        y: reducedMotion ? 0 : sy,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 44px',
        fontSize: '11.5px',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        fontWeight: primary ? 600 : 500,
        background: primary ? '#d4f53c' : 'transparent',
        color: primary ? '#0a0a0a' : '#ffffff',
        border: primary ? 'none' : '1.5px solid #ffffff',
        borderRadius: '9999px',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        boxShadow: primary
          ? '0 4px 20px rgba(212, 245, 60, 0.3)'
          : 'none',
      }}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4f53c]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#080808]"
    >
      {/* Outer Glow Layer */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-20%',
          borderRadius: '9999px',
          background: primary
            ? 'radial-gradient(circle, rgba(212,245,60,0.45) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(212,245,60,0.25) 0%, transparent 70%)',
          opacity: reducedMotion ? 0 : glowOpacity,
          filter: 'blur(12px)',
          zIndex: 0,
        }}
      />

      {/* Primary Button Shine */}
      {primary && (
        <motion.span
          variants={shineVariants}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
            scaleX: 0,
            originX: 0,
          }}
          transition={{ duration: 0.55, ease: EASE }}
        />
      )}

      {/* Secondary Button Hover Effects */}
      {!primary && (
        <>
          {/* Lime Border Glow */}
          <motion.span
            variants={secondaryBorderVariants}
            style={{
              position: 'absolute',
              inset: 0,
              border: '1.5px solid #d4f53c',
              borderRadius: '9999px',
              opacity: 0,
            }}
            transition={{ duration: 0.3 }}
          />
          {/* Subtle Background Overlay */}
          <motion.span
            variants={secondaryOverlayVariants}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(212, 245, 60, 0.08)',
              borderRadius: '9999px',
              opacity: 0,
            }}
            transition={{ duration: 0.35 }}
          />
        </>
      )}

      {/* Button Content with Lift */}
      <motion.span
        style={{ position: 'relative', zIndex: 2 }}
        whileHover={{ y: -1.5 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {children}
      </motion.span>

      {/* Arrow Icon with Rotation on Hover */}
      <motion.span
        style={{ position: 'relative', zIndex: 2, display: 'inline-block' }}
        whileHover={{ x: 4, rotate: 45 }}
        transition={{ duration: 0.3 }}
      >
        →
      </motion.span>
    </motion.a>
  );
}

// Keep your existing Word and Line components unchanged (they're solid)
function Word({ word, delay, accent = false }: { word: string; delay: number; accent?: boolean }) {
  return (
    <span style={{
      display: 'inline-block', overflow: 'hidden',
      marginRight: '0.25em',
      paddingBottom: '0.18em', marginBottom: '-0.18em',
      verticalAlign: 'bottom',
    }}>
      <motion.span
        style={{
          display: 'inline-block',
          color: accent ? '#d4f53c' : 'inherit',
          fontStyle: accent ? 'italic' : 'inherit',
        }}
        initial={{ y: '110%', opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay, duration: 1.05, ease: EASE }}
      >
        {word}
      </motion.span>
    </span>
  );
}

function Line({ text, delay, accent = false }: { text: string; delay: number; accent?: boolean }) {
  return (
    <span style={{ display: 'block' }}>
      {text.split(' ').map((w, i) => (
        <Word key={i} word={w} delay={delay + i * 0.085} accent={accent} />
      ))}
    </span>
  );
}

export default function CTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const gridY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const imgY = useTransform(scrollYProgress, [0, 1], ['-5%', '10%']);
  const headlineY = useTransform(scrollYProgress, [0, 1], ['3%', '-3%']);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: '#080808',
        borderTop: '1px solid #1e1e1e',
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)',
      }}
    >
      {/* Grid + Grain (unchanged) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.07,
          backgroundImage:
            'linear-gradient(#f5f2ea 1.5px, transparent 1.5px), linear-gradient(90deg, #d0d0d0 1.5px, transparent 1.5px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.45' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      {/* Corner brackets (unchanged) */}
      {[
        { top: 20, left: 20, borderTop: true, borderLeft: true },
        { top: 20, right: 20, borderTop: true, borderRight: true },
        { bottom: 20, left: 20, borderBottom: true, borderLeft: true },
        { bottom: 20, right: 20, borderBottom: true, borderRight: true },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            ...pos,
            width: 28, height: 28,
            borderTop: pos.borderTop ? '1px solid #2a2a2a' : undefined,
            borderBottom: pos.borderBottom ? '1px solid #2a2a2a' : undefined,
            borderLeft: pos.borderLeft ? '1px solid #2a2a2a' : undefined,
            borderRight: pos.borderRight ? '1px solid #2a2a2a' : undefined,
          }}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, duration: 0.6, ease: EASE }}
        />
      ))}

      <div
        className="relative z-10 flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-6"
        style={{ maxWidth: 1200, margin: '0 auto' }}
      >
        {/* Left Text Content (unchanged) */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
          <div className="flex flex-col items-center md:items-start mb-10">
            <motion.span
              style={{ fontSize: 30, letterSpacing: '0.36em', color: '#9e9e9a', textTransform: 'uppercase' }}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              Let's work together
            </motion.span>
          </div>

          <motion.h2
            className="font-display mb-5"
            style={{
              y: headlineY,
              fontSize: 'clamp(3rem, 7vw, 8.5rem)',
              lineHeight: 0.92,
              letterSpacing: '-0.03em',
              color: '#eeebe4',
            }}
          >
            <Line text="Ready to build" delay={0.15} />
            <Line text="something real?" delay={0.4} accent />
          </motion.h2>

          <motion.p
            className="mb-10"
            style={{
              color: '#9e9e9a',
              fontSize: 'clamp(1rem, 1.1vw, 1rem)',
              maxWidth: 360,
              lineHeight: 1.85,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.7, ease: EASE }}
          >
            From MVP to full product — we move fast, write clean code,
            and ship things that actually work.
          </motion.p>

          {/* Improved Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center md:items-start gap-5 mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.62, duration: 0.7, ease: EASE }}
          >
            <MagneticButton href="mailto:hello@builtstack.co" primary>
              Start a project
            </MagneticButton>
            <MagneticButton href="#work">
              View our work
            </MagneticButton>
          </motion.div>

          {/* Divider with shimmer (unchanged) */}
          <motion.div
            className="w-full"
            style={{ height: 1, background: '#1e1e1e', maxWidth: 400, position: 'relative', overflow: 'hidden' }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
          >
            <motion.div
              style={{
                position: 'absolute', top: 0, height: '100%', width: '25%',
                background: 'linear-gradient(90deg, transparent, #d4f53c, transparent)',
              }}
              animate={{ left: ['-25%', '125%'] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
            />
          </motion.div>

          {/* Email + socials (unchanged) */}
          <motion.div
            className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <a
              href="mailto:hello@builtstack.co"
              style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9e9e9a' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#d4f53c')}
              onMouseLeave={e => (e.currentTarget.style.color = '#9e9e9a')}
            >
              builtstack@gmail.com
            </a>
            <span style={{ color: '#2a2a2a', fontSize: 10 }}>·</span>
            {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
              <a
                key={s}
                href="#"
                style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9e9e9a' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#eeebe4')}
                onMouseLeave={e => (e.currentTarget.style.color = '#9e9e9a')}
              >
                {s}
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right Image (unchanged) */}
        <motion.div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            y: imgY,
            width: 'clamp(250px, 50vw, 500px)',
          }}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.4, duration: 1.1, ease: EASE }}
        >
          {/* ... your existing mascot code ... */}
          <div style={{ position: 'relative', width: '100%' }}>
            <div style={{
              position: 'absolute', inset: '0%',
              background: 'radial-gradient(ellipse, rgba(212,245,60,0.08) 0%, transparent 65%)',
              filter: 'blur(40px)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }} />

            <motion.div
              animate={{ y: [0, -16, 0], rotate: [0, 1, -0.7, 0] }}
              transition={{
                duration: 6, repeat: Infinity,
                ease: 'easeInOut', times: [0, 0.45, 0.75, 1],
              }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <motion.div
                style={{
                  position: 'absolute', bottom: '-4%',
                  left: '20%', right: '20%',
                  height: 24,
                  background: 'rgba(212,245,60,0.1)',
                  filter: 'blur(16px)',
                  borderRadius: '50%',
                }}
                animate={{ scaleX: [1, 0.72, 1], opacity: [0.6, 0.18, 0.6] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />

              <img
                src="/builtstack.png"
                alt="BuiltStack mascot"
                loading="eager"
                style={{
                  width: '100%', height: 'auto', display: 'block',
                  userSelect: 'none', pointerEvents: 'none',
                  filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.6)) drop-shadow(0 0 32px rgba(212,245,60,0.06))',
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Ghost watermark (unchanged) */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center overflow-hidden pointer-events-none"
        style={{ height: '40%', alignItems: 'flex-end' }}
      >
        <motion.span
          className="font-display select-none whitespace-nowrap"
          style={{
            fontSize: 'clamp(72px, 16vw, 180px)',
            lineHeight: 0.82,
            letterSpacing: '-0.04em',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.025)',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1.2 }}
        >
          BuiltStack
        </motion.span>
      </div>
    </section>
  );
}