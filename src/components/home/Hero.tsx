'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

function Word({ word, delay, accent = false }: { word: string; delay: number; accent?: boolean }) {
    return (
        <span style={{
            display: 'inline-block', overflow: 'hidden',
            marginRight: '0.22em', paddingBottom: '0.18em',
            marginBottom: '-0.18em', verticalAlign: 'bottom',
        }}>
      <motion.span
          style={{ display: 'inline-block', color: accent ? '#d4f53c' : 'inherit' }}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{ duration: 1.05, ease: EASE as unknown as number[], delay }}
      >
        {word}
      </motion.span>
    </span>
    );
}

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

export default function Hero() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

    const textY  = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
    const textOp = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const textSc = useTransform(scrollYProgress, [0, 0.5], [1, 0.97]);
    const imgY   = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
    const imgOp  = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

    return (
        <section
            ref={ref}
            className="relative overflow-hidden"
            style={{ minHeight: '100svh', background: '#080808' }}
        >
            {/* Grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
                opacity: 0.028,
                backgroundImage: 'linear-gradient(#eeebe4 1px,transparent 1px),linear-gradient(90deg,#eeebe4 1px,transparent 1px)',
                backgroundSize: '64px 64px',
            }} />

            {/* Grain */}
            <div className="absolute inset-0 pointer-events-none" style={{
                opacity: 0.04,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.70' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '180px 180px',
            }} />

            {/* ── Studio label — top left ─────────────────────── */}
            <motion.div
                className="absolute flex items-center gap-2.5 z-30"
                style={{ top: 'clamp(88px, 11vw, 128px)', left: 'clamp(24px, 5vw, 48px)' }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: EASE as unknown as number[] }}
            >
                <motion.span
                    className="rounded-full shrink-0"
                    style={{ width: 6, height: 6, background: '#d4f53c' }}
                    animate={{ scale: [1, 1.6, 1] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
                />
                <span style={{ fontSize: 10, letterSpacing: '0.32em', color: '#5a5a56', textTransform: 'uppercase' }}>
          Design & Engineering Studio
        </span>
            </motion.div>

            {/* ── Available — top right ───────────────────────── */}
            <motion.div
                className="absolute hidden sm:flex items-center gap-2 z-30"
                style={{ top: 'clamp(100px, 15vw, 128px)', right: 'clamp(24px, 5vw, 48px)' }}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: EASE as unknown as number[] }}
            >
                <motion.span
                    className="rounded-full shrink-0"
                    style={{ width: 6, height: 6, background: '#4ade80' }}
                    animate={{ opacity: [1, 0.25, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span style={{ fontSize: 10, letterSpacing: '0.25em', color: '#5a5a56', textTransform: 'uppercase' }}>
          Available for projects
        </span>
            </motion.div>

            {/* ────────────────────────────────────────────────────
          FLOATING IMAGE — absolute z-20
          Desktop : right side, vertically centered
          Mobile  : top-center, above text
      ─────────────────────────────────────────────────── */}
            <motion.div
                className="absolute z-20 pointer-events-none"
                style={{
                    y: imgY,
                    opacity: imgOp,
                    // ── Desktop ──
                    right: 'clamp(-20px, 2vw, 40px)',
                    top: '30%',
                    transform: 'translateY(-52%)',
                    width: 'clamp(280px, 38vw, 540px)',
                }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 1.2, ease: EASE as unknown as number[] }}
            >
                {/* Responsive override: on mobile center the image at the top */}
                <style>{`
          @media (max-width: 767px) {
            .hero-img-float {
              right: 50% !important;
              transform: translateX(50%) translateY(0) !important;
              top: 90px !important;
              width: clamp(200px, 72vw, 320px) !important;
            }
          }
        `}</style>
                <div className="hero-img-float" style={{
                    position: 'absolute',
                    right: 'clamp(-20px, 2vw, 40px)',
                    top: '10',
                    width: '100%',
                    height: '100%',
                }} />

                {/* Lime glow behind */}
                <div style={{
                    position: 'absolute', inset: '5%',
                    background: 'radial-gradient(ellipse, rgba(212,245,60,0.10) 0%, transparent 65%)',
                    filter: 'blur(40px)',
                    borderRadius: '50%',
                    zIndex: 0,
                }} />

                {/* Float + rock animation */}
                <motion.div
                    style={{ position: 'relative', zIndex: 1 }}
                    animate={{ y: [0,20, 0], rotate: [0, 1.2, -0.8, 0] }}
                    transition={{
                        duration: 5.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        times: [0, 0.45, 0.75, 1],
                    }}
                >
                    {/* Ground shadow */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            bottom: '-50%', left: '18%', right: '18%',
                            height: 28,
                            background: 'rgba(212,245,60,0.12)',
                            filter: 'blur(18px)',
                            borderRadius: '50%',
                        }}
                        animate={{ scaleX: [1, 0.7, 1], opacity: [0.65, 0.2, 0.65] }}
                        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <img
                        src="/builtstack.png"
                        alt="BuiltStack mascot"
                        loading="eager"
                        style={{
                            width: '100%', height: 'auto',
                            objectFit: 'contain', display: 'block',
                            userSelect: 'none', pointerEvents: 'none',
                            // Subtle drop shadow so it pops off the dark bg
                            filter: 'drop-shadow(0 32px 48px rgba(0,0,0,0.6)) drop-shadow(0 0 40px rgba(212,245,60,0.08))',
                        }}
                    />
                </motion.div>
            </motion.div>

            {/* ────────────────────────────────────────────────────
          TEXT BLOCK — full section height, bottom anchored
          Mobile: paddingTop pushes text below the image
          Desktop: text stays left, image floats right freely
      ─────────────────────────────────────────────────── */}
            <div
                className="relative z-10 flex flex-col justify-end"
                style={{
                    minHeight: '100svh',
                    padding: '0 clamp(24px, 5vw, 48px)',
                    paddingBottom: 'clamp(52px, 7vw, 88px)',
                    // Mobile: top padding clears the floating image
                    paddingTop: 'clamp(280px, 52vw, 340px)',
                }}
            >
                {/* On desktop: limit text width to ~55vw so it never slides under the image */}
                <motion.div
                    style={{ y: textY, opacity: textOp, scale: textSc, maxWidth: 'min(100%, 56vw)' }}
                    className="origin-bottom"
                >
                    {/* Remove maxWidth constraint on mobile */}
                    <style>{`
            @media (max-width: 767px) {
              .hero-text-inner { max-width: 100% !important; }
            }
          `}</style>

                    <h1
                        className="font-display hero-text-inner"
                        style={{
                            fontSize: 'clamp(2.6rem, 5.5vw, 7.5rem)',
                            lineHeight: 1.08,
                            letterSpacing: '-0.025em',
                            marginBottom: 'clamp(28px, 4vw, 52px)',
                            color: '#eeebe4',
                            maxWidth: 'min(100%, 56vw)',
                        }}
                    >
            <span style={{ display: 'block' }}>
              <SplitWords text="We design &" baseDelay={0.28} />
            </span>
                        <span style={{ display: 'block' }}>
              <SplitWords text="engineer products" baseDelay={0.52} />
            </span>
                        <span style={{ display: 'block' }}>
              <SplitWords text="that perform" baseDelay={0.76} />
              <span style={{
                  display: 'inline-block', overflow: 'hidden',
                  paddingBottom: '0.18em', marginBottom: '-0.18em',
                  marginLeft: '0.1em', verticalAlign: 'bottom',
              }}>
                <motion.span
                    style={{ display: 'inline-block', color: '#d4f53c', fontStyle: 'italic' }}
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{ duration: 1.05, ease: EASE as unknown as number[], delay: 1.08 }}
                >
                  — always.
                </motion.span>
              </span>
            </span>
                    </h1>

                    <div
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 hero-text-inner"
                        style={{ maxWidth: 'min(100%, 56vw)' }}
                    >
                        <motion.p
                            style={{ color: '#5a5a56', fontSize: 'clamp(0.78rem, 1vw, 0.88rem)', maxWidth: 320, lineHeight: 1.8 }}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.45, duration: 0.85, ease: EASE as unknown as number[] }}
                        >
                            From idea to launch — we build digital products, SaaS platforms,
                            and brand systems for founders who refuse to ship mediocrity.
                        </motion.p>

                        <motion.div
                            className="flex items-center gap-3 shrink-0"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ delay: 2, duration: 0.8 }}
                        >
                            <div style={{ position: 'relative', width: 1, height: 52, background: '#1e1e1e', flexShrink: 0 }}>
                                <motion.div
                                    style={{ position: 'absolute', left: 0, width: '100%', background: '#d4f53c', borderRadius: 1 }}
                                    animate={{ top: ['0%', '80%', '0%'], height: ['20%', '20%', '20%'], opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            </div>
                            <span style={{ fontSize: 10, letterSpacing: '0.3em', color: '#5a5a56', textTransform: 'uppercase' }}>
                Scroll
              </span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

        </section>
    );
}