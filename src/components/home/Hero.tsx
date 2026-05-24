'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ============================================================================
// EASING & CONSTANTS
// ============================================================================
const EASE = [0.16, 1, 0.3, 1] as const;

// ============================================================================
// WORD ANIMATION COMPONENT
// ============================================================================
function Word({ word, delay, accent = false }: { word: string; delay: number; accent?: boolean }) {
  return (
    <span className="inline-block overflow-hidden mr-[0.22em] pb-[0.18em] mb-[-0.18em] align-bottom">
      <motion.span
        className={`inline-block ${accent ? 'text-[var(--lime)]' : 'text-inherit'}`}
        initial={{ y: '110%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 1.05, ease: EASE as unknown as number[], delay }}
      >
        {word}
      </motion.span>
    </span>
  );
}

// ============================================================================
// SPLIT WORDS UTILITY
// ============================================================================
function SplitWords({ text, baseDelay, accent = false }: {
  text: string; baseDelay: number; accent?: boolean;
}) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <Word key={i} word={word} delay={baseDelay + i * 0.08} accent={accent} />
      ))}
    </>
  );
}

// ============================================================================
// HERO SECTION - THEME ADAPTIVE + TAILWIND REFACTORED
// ============================================================================
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // Scroll-based transforms
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const textOp = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textSc = useTransform(scrollYProgress, [0, 0.5], [1, 0.97]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const imgOp = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        minHeight: '100svh',
        backgroundColor: 'var(--section-bg, hsl(var(--bg)))',
      }}
    >
      {/* ── Grid Background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.07,
          backgroundImage: `
            linear-gradient(hsl(var(--text-primary)) 1.5px, transparent 1.5px),
            linear-gradient(90deg, hsl(var(--border)) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '56px 56px',
        }}
      />

      {/* ── Grain Overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.45' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      {/* ── Studio Label (Top Left) ── */}
      <motion.div
        className="absolute flex items-center gap-2.5 z-30"
        style={{
          top: 'clamp(88px, 11vw, 128px)',
          left: 'clamp(24px, 5vw, 48px)',
        }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: EASE as unknown as number[] }}
      >
        <motion.span
          className="rounded-full shrink-0"
          style={{
            width: 3,
            height: 3,
            backgroundColor: 'var(--lime)',
          }}
          animate={{ scale: [1, 1.6, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
        />
        <span
          className="text-[12px] tracking-[0.32em] uppercase"
          style={{ color: 'var(--text-muted, hsl(var(--text-muted)))' }}
        >
          Design & Engineering Studio
        </span>
      </motion.div>

      {/* ── Available Badge (Top Right) ── */}
      <motion.div
        className="absolute hidden sm:flex items-center gap-2 z-30"
        style={{
          top: 'clamp(100px, 15vw, 128px)',
          right: 'clamp(24px, 5vw, 48px)',
        }}
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: EASE as unknown as number[] }}
      >
        <motion.span
          className="rounded-full shrink-0"
          style={{
            width: 4,
            height: 4,
            backgroundColor: 'var(--lime)',
          }}
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span
          className="text-[12px] tracking-[0.25em] uppercase"
          style={{ color: 'var(--text-muted, hsl(var(--text-muted)))' }}
        >
          Available for projects
        </span>
      </motion.div>

      {/* ── Floating Image ── */}
      <motion.div
        className="hero-img-float absolute z-20 pointer-events-none"
        style={{
          y: imgY,
          opacity: imgOp,
          right: 'clamp(-10px, 2vw, 40px)',
          top: 'clamp(80px, 12vw, 140px)',
          width: 'clamp(280px, 38vw, 540px)',
        }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 1.2, ease: EASE as unknown as number[] }}
      >
        {/* Mobile responsive override */}
        <style>{`
          @media (max-width: 767px) {
            .hero-img-float {
              right: 40% !important;
              transform: translateX(50%) translateY(0) !important;
              top: 130px !important;
              width: clamp(160px, 58vw, 240px) !important;
            }
          }
        `}</style>

        {/* Lime glow behind image */}
        <div
          className="absolute inset-[5%] rounded-full z-0"
          style={{
            background: 'radial-gradient(ellipse, var(--glow-lime) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Float + rock animation wrapper */}
        <motion.div
          className="relative z-10"
          animate={{ y: [0, 20, 0], rotate: [0, 1.2, -0.8, 0] }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.45, 0.75, 1],
          }}
        >
          {/* Ground shadow */}
          <motion.div
            className="absolute bottom-[-50%] left-[18%] right-[18%] h-8 rounded-full"
            style={{
              background: 'var(--glow-lime)',
              boxShadow: `
                0 0 40px var(--glow-lime),
                0 0 80px var(--glow-lime),
                0 20px 60px var(--color-shadow-soft, rgba(0,0,0,0.35))
              `,
              filter: 'blur(22px)',
            }}
            animate={{
              scaleX: [1, 0.75, 1],
              opacity: [0.7, 0.25, 0.7],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Mascot Image */}
          <img
            src="/builtstack.png"
            alt="BuiltStack mascot"
            loading="eager"
            className="w-full h-auto block select-none pointer-events-none"
            style={{
              objectFit: 'contain',
              filter: `
                drop-shadow(0 32px 48px var(--color-shadow-soft, rgba(0,0,0,0.6)))
                drop-shadow(0 0 40px var(--glow-subtle, rgba(212,245,60,0.08)))
              `,
            }}
          />
        </motion.div>
      </motion.div>

      {/* ── Text Content Block ── */}
      <div
        className="relative z-10 flex flex-col justify-end"
        style={{
          minHeight: '100svh',
          padding: '0 clamp(24px, 5vw, 48px)',
          paddingBottom: 'clamp(52px, 7vw, 88px)',
          paddingTop: 'clamp(280px, 52vw, 340px)',
        }}
      >
        <motion.div
          className="origin-bottom"
          style={{
            y: textY,
            opacity: textOp,
            scale: textSc,
            maxWidth: 'min(100%, 56vw)',
          }}
        >
          {/* Mobile maxWidth override */}
          <style>{`
            @media (max-width: 767px) {
              .hero-text-inner { max-width: 100% !important; }
            }
          `}</style>

          {/* Main Heading */}
          <h1
            className="font-display hero-text-inner"
            style={{
              fontFamily: 'var(--font-display, "Instrument Serif, serif")',
              fontSize: 'clamp(2.6rem, 5.5vw, 7.5rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              marginBottom: 'clamp(28px, 4vw, 52px)',
              color: 'var(--heading-color, hsl(var(--text-primary)))',
              maxWidth: 'min(100%, 56vw)',
            }}
          >
            <span className="block">
              <SplitWords text="We design &" baseDelay={0.28} />
            </span>
            <span className="block">
              <SplitWords text="engineer products" baseDelay={0.52} />
            </span>
            <span className="block">
              <SplitWords text="that perform" baseDelay={0.76} />
              <span className="inline-block overflow-hidden pb-[0.18em] mb-[-0.18em] ml-[0.1em] align-bottom">
                <motion.span
                  className="inline-block italic"
                  style={{ color: 'var(--lime)' }}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 1.05, ease: EASE as unknown as number[], delay: 1.08 }}
                >
                  - always.
                </motion.span>
              </span>
            </span>
          </h1>

          {/* Subtext + Indicator */}
          <div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 hero-text-inner"
            style={{ maxWidth: 'min(100%, 56vw)' }}
          >
            <motion.p
              className="max-w-[320px] leading-[1.8]"
              style={{
                color: 'var(--body-color, hsl(var(--text-muted)))',
                fontSize: 'clamp(1rem, 1vw, 1rem)',
              }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.45, duration: 0.85, ease: EASE as unknown as number[] }}
            >
              From idea to launch - we build high performance products, SaaS platforms, and brand systems for founders who refuse to blend in.
            </motion.p>

            {/* Animated vertical indicator */}
            <motion.div
              className="flex items-center gap-3 shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              <div
                className="relative w-[3px] h-[52px] shrink-0"
                style={{ backgroundColor: 'var(--nav-border, hsl(var(--border)))' }}
              >
                <motion.div
                  className="absolute left-0 w-full rounded-full"
                  style={{
                    backgroundColor: 'var(--lime-dark, #8aa900)',
                  }}
                  animate={{
                    top: ['0%', '80%', '0%'],
                    height: ['20%', '20%', '20%'],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}