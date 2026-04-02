'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

// ── Magnetic button ───────────────────────────────────────────
function MagneticButton({ href, children, primary = false }: {
    href: string; children: React.ReactNode; primary?: boolean;
}) {
    const ref = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { damping: 20, stiffness: 300 });
    const sy = useSpring(y, { damping: 20, stiffness: 300 });

    const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
    };
    const onLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.a
            ref={ref}
            href={href}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            whileTap={{ scale: 0.96 }}
            style={{
                x: sx, y: sy,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px 40px',
                fontSize: '11px',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                fontWeight: primary ? 600 : 400,
                background: primary ? '#d4f53c' : 'transparent',
                color: primary ? '#000' : '#ffffff',
                border: primary ? 'none' : '1px solid #ffffff',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'none',
                userSelect: 'none',
            }}
        >
            {primary && (
                <motion.span
                    style={{ position: 'absolute', inset: 0, background: '#fff', scaleX: 0, originX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.42, ease: EASE as unknown as number[] }}
                />
            )}
            {!primary && (
                <>
                    <motion.span
                        style={{ position: 'absolute', inset: 0, border: '1px solid #d4f53c', opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.28 }}
                    />
                    <motion.span
                        style={{ position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.99)', opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.28 }}
                    />
                </>
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
        </motion.a>
    );
}

// ── Word reveal - descender safe ─────────────────────────────
function Word({ word, delay, accent = false }: { word: string; delay: number; accent?: boolean }) {
    return (
        <span style={{
            display: 'inline-block', overflow: 'hidden',
            marginRight: '0.2em',
            paddingBottom: '0.15em', marginBottom: '-0.15em',
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
                transition={{ delay, duration: 1, ease: EASE as unknown as number[] }}
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
                <Word key={i} word={w} delay={delay + i * 0.09} accent={accent} />
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
                // Responsive padding - more room on desktop
                padding: 'clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)',
            }}
        >
            {/* Grid */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    opacity: 0.07,
                    backgroundImage:
                        'linear-gradient(#f5f2ea 1.5px, transparent 1.5px), linear-gradient(90deg, #f5f2ea 1.5px, transparent 1.5px)',
                    backgroundSize: '56px 56px',
                }}
            />

            {/* Grain */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    opacity: 0.06,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.45' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: '160px 160px',
                }}
            />
            {/*  Corner brackets */}
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
                    transition={{ delay: i * 0.06, duration: 0.6, ease: EASE as unknown as number[] }}
                />
            ))}

            {/*LAYOUT: stacked on mobile, side-by-side on desktop
          Left: text content
          Right: floating mascot image */}
            <div
                className="relative z-10 flex flex-col md:flex-row items-center md:items-stretch gap-12 md:gap-0"
                style={{ maxWidth: 1200, margin: '0 auto' }}
            >

                {/*LEFT - Text content*/}
                <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">

                    {/* Vertical lime line + label */}
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

                    {/* Headline */}
                    <motion.h2
                        className="font-display mb-8"
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

                    {/* Sub-copy */}
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
                        transition={{ delay: 0.55, duration: 0.7, ease: EASE as unknown as number[] }}
                    >
                        From MVP to full product - we move fast, write clean code,
                        and ship things that actually work.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-center md:items-start gap-4 mb-14"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.62, duration: 0.7, ease: EASE as unknown as number[] }}
                    >
                        <MagneticButton href="mailto:hello@builtstack.co" primary>
                            Start a project →
                        </MagneticButton>
                        <MagneticButton href="#work">
                            View our work
                        </MagneticButton>
                    </motion.div>

                    {/* Divider with shimmer */}
                    <motion.div
                        className="w-full"
                        style={{ height: 1, background: '#1e1e1e', maxWidth: 400, position: 'relative', overflow: 'hidden' }}
                        initial={{ scaleX: 0, originX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: EASE as unknown as number[] }}
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

                    {/* Email + socials */}
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
                            hello@builtstack.co
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

                {/*RIGHT - Floating mascot image*/}
                <motion.div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                        y: imgY,
                        // Desktop: right column fixed width
                        // Mobile: full width with max cap
                        width: 'clamp(250px, 50vw, 500px)',
                    }}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: 0.4, duration: 1.1, ease: EASE as unknown as number[] }}
                >
                    <div style={{ position: 'relative', width: '100%' }}>
                        {/* Lime glow behind - subtle, not green blob */}
                        <div style={{
                            position: 'absolute', inset: '0%',
                            background: 'radial-gradient(ellipse, rgba(212,245,60,0.08) 0%, transparent 65%)',
                            filter: 'blur(40px)',
                            borderRadius: '50%',
                            pointerEvents: 'none',
                        }} />

                        {/* Float + gentle rock */}
                        <motion.div
                            animate={{ y: [0, -16, 0], rotate: [0, 1, -0.7, 0] }}
                            transition={{
                                duration: 6, repeat: Infinity,
                                ease: 'easeInOut', times: [0, 0.45, 0.75, 1],
                            }}
                            style={{ position: 'relative', zIndex: 1 }}
                        >
                            {/* Ground shadow */}
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

            {/*Ghost watermark*/}
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