'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import InteractiveMeshGrid from '@/components/ui/InteractiveMeshGrid';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CALENDLY_URL = 'https://calendly.com/builtstack/30min';
const WHATSAPP_URL = 'https://wa.me/8398919452';
const CLIENTS = ['Neeraj Dental', 'Sahara', 'Admin Panel'];

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BuiltStack',
  url: 'https://builtstack-eight.vercel.app/',
  description: 'BuiltStack is a design and engineering studio specializing in web apps, SaaS platforms, mobile apps, and brand systems for founders and startups.',
  founder: [
    { '@type': 'Person', name: 'Loveraj', jobTitle: 'Co-Founder & Developer' },
    { '@type': 'Person', name: 'Rudra', jobTitle: 'Co-Founder' },
  ],
  sameAs: ['https://linkedin.com/company/builtstack', 'https://www.instagram.com/builtstack/'],
  contactPoint: { '@type': 'ContactPoint', contactType: 'sales', url: CALENDLY_URL, availableLanguage: ['English', 'Hindi'] },
};

function useCalendly() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      setReady(true); return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);
  const openPopup = () => {
    const w = window as Window & { Calendly?: { initPopupWidget: (opts: { url: string }) => void } };
    if (typeof window !== 'undefined' && w.Calendly) {
      w.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
    }
  };
  return { ready, openPopup };
}

function SplitWords({ text, baseDelay }: { text: string; baseDelay: number }) {
  return (
    <span className="inline-block">
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.22em] pb-[0.12em] mb-[-0.12em] align-bottom">
          <motion.span className="inline-block" initial={{ y: '100%' }} animate={{ y: '0%' }}
            transition={{ duration: 0.9, ease: EASE, delay: baseDelay + i * 0.06 }}>
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function TypewriterWord({ words, startDelay = 0 }: { words: string[]; startDelay?: number }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'idle' | 'typing' | 'pausing' | 'erasing'>('idle');
  const [cursorOn, setCursorOn] = useState(true);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const word = words[idx];

  useEffect(() => { const b = setInterval(() => setCursorOn(p => !p), 530); return () => clearInterval(b); }, []);
  useEffect(() => { const s = setTimeout(() => setPhase('typing'), startDelay * 1000); return () => clearTimeout(s); }, [startDelay]);
  useEffect(() => {
    if (phase === 'idle') return;
    const clear = () => { if (t.current) clearTimeout(t.current); };
    if (phase === 'typing') {
      if (displayed.length < word.length) t.current = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 70);
      else t.current = setTimeout(() => setPhase('pausing'), 2200);
    } else if (phase === 'pausing') {
      t.current = setTimeout(() => setPhase('erasing'), 50);
    } else if (phase === 'erasing') {
      if (displayed.length > 0) t.current = setTimeout(() => setDisplayed(word.slice(0, displayed.length - 1)), 40);
      else t.current = setTimeout(() => { setIdx(i => (i + 1) % words.length); setPhase('typing'); }, 400);
    }
    return clear;
  }, [displayed, phase, word, words.length]);

  return (
    <span className="inline-block italic" style={{ color: 'var(--lime, #8fa42e)' }}>
      {displayed}
      <span className="inline-block ml-[1px] font-light" style={{ opacity: cursorOn ? 0.9 : 0.1, transition: 'opacity 0.12s' }}>|</span>
    </span>
  );
}

function Button({ children, onClick, href, variant = 'primary', ariaLabel, delay = 0, target, rel }: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  variant?: 'primary' | 'ghost';
  ariaLabel: string;
  delay?: number;
  target?: string;
  rel?: string;
}) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });
  const isPrimary = variant === 'primary';

  const handleMove = (e: React.MouseEvent) => {
    const el = (anchorRef.current ?? buttonRef.current); if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: isPrimary ? '8px 16px' : '8px 12px',
    fontSize: '9px',
    letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none',
    borderRadius: '9999px', userSelect: 'none',
    transition: 'background 0.3s, color 0.3s, border-color 0.3s, opacity 0.3s',
    background: isPrimary ? 'var(--lime, #8fa42e)' : 'transparent',
    color: isPrimary ? '#0a0a0a' : 'var(--text-muted, rgba(255,255,255,0.55))',
    border: isPrimary ? '1px solid transparent' : 'none',
  };

  const icon = (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
    </svg>
  );

  const motionProps = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.8, ease: EASE } };
  const shared = { style: { ...baseStyle, x: sx, y: sy }, 'aria-label': ariaLabel, onMouseMove: handleMove, onMouseLeave: () => { x.set(0); y.set(0); }, onClick };

  if (href) return (
    <motion.a ref={anchorRef} href={href} target={target} rel={rel} {...shared} {...motionProps}
      whileHover={{ background: isPrimary ? '#a3b949' : 'transparent', color: isPrimary ? '#0a0a0a' : 'var(--lime, #8fa42e)', opacity: 1 }}
      whileTap={{ scale: 0.97 }}>
      <span>{children}</span>{icon}
    </motion.a>
  );

  return (
    <motion.button ref={buttonRef} type="button" {...shared} {...motionProps} whileHover={{ background: '#9ab337' }} whileTap={{ scale: 0.97 }}>
      <span>{children}</span>{icon}
    </motion.button>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const textOp = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const imgOp = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const { openPopup } = useCalendly();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }} />

      <section ref={ref} aria-label="BuiltStack — Design & Engineering Studio"
        className="relative overflow-hidden" style={{ minHeight: '100svh', backgroundColor: 'var(--section-bg, hsl(var(--bg)))' }}>

        <InteractiveMeshGrid className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />

        {/* Top bar — desktop only */}
        <motion.div className="absolute top-0 left-0 right-0 z-30 hidden md:flex items-center justify-between px-12"
          style={{ paddingTop: 'clamp(88px, 11vw, 128px)' }}
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: EASE }}>
          <div className="flex items-center gap-2.5">
            <span className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: 'var(--lime, #8fa42e)' }} />
            <span className="text-[11px] tracking-[0.28em] uppercase" style={{ color: 'var(--text-muted, hsl(var(--text-muted)))' }}>
              Design · Engineering · Brand
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: 'var(--lime, #8fa42e)' }} />
            <span className="text-[11px] tracking-[0.28em] uppercase" style={{ color: 'var(--text-muted, hsl(var(--text-muted)))' }}>
              Available Q1 2026
            </span>
          </div>
        </motion.div>

        {/* Desktop: side-by-side */}
        <div className="relative z-10 hidden md:flex items-end min-h-[100svh] px-12 lg:px-16 xl:px-20"
          style={{ paddingBottom: 'clamp(60px, 8vw, 100px)' }}>

          <motion.div className="flex-1 min-w-0 pr-8 lg:pr-12" style={{ y: textY, opacity: textOp }}>
            <h1 className="font-display" style={{
              fontFamily: 'var(--font-display, "Instrument Serif")',
              fontSize: 'clamp(2.8rem, 4.5vw, 7rem)',
              lineHeight: 1.05, letterSpacing: '-0.03em',
              marginBottom: 'clamp(24px, 3.5vw, 40px)',
              color: 'var(--heading-color, hsl(var(--text-primary)))',
            }}>
              <span className="sr-only">BuiltStack — We design and engineer digital products that perform.</span>
              <span aria-hidden="true" className="block"><SplitWords text="We design &" baseDelay={0.25} /></span>
              <span aria-hidden="true" className="block"><SplitWords text="engineer products" baseDelay={0.48} /></span>
              <span aria-hidden="true" className="block">
                <SplitWords text="that perform" baseDelay={0.72} />
                <span className="inline-block ml-[0.15em]">
                  <TypewriterWord words={['always.', 'flawlessly.', 'at scale.']} startDelay={1.1} />
                </span>
              </span>
            </h1>

            <div className="flex flex-row items-center gap-3 mb-10">
              <Button variant="primary" ariaLabel="Book a free call" delay={1}
                onClick={(e) => { e.preventDefault(); openPopup(); }}>
                Book a Free Call
              </Button>
              <Button variant="ghost" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                ariaLabel="Chat with BuiltStack on WhatsApp" delay={1.4}>
                Chat on WhatsApp
              </Button>
            </div>

            <motion.div className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.8 }}>
              <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-faint, hsl(var(--text-faint)))' }}>Trusted by</span>
              <div className="flex items-center gap-3">
                {CLIENTS.map((name, i) => (
                  <span key={i} className="text-[11px] tracking-wide" style={{ color: 'var(--text-muted, hsl(var(--text-muted)))' }}>
                    {name}{i < CLIENTS.length - 1 && <span className="ml-3" style={{ color: 'var(--border, rgba(255,255,255,0.1))' }}>·</span>}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex-shrink-0 w-[42vw] lg:w-[46vw] xl:w-[50vw] max-w-[760px] pointer-events-none"
            style={{ y: imgY, opacity: imgOp }}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1.1, ease: EASE }} aria-hidden="true">
            <motion.div animate={{ y: [0, 14, 0] }} transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}>
              <img src="/builtstack.png" alt="" loading="eager" fetchPriority="high" width={800} height={800}
                className="w-full h-auto block select-none pointer-events-none" style={{ objectFit: 'contain' }} />
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile: stacked, image on top flush to text */}
        <div className="relative z-10 flex md:hidden flex-col justify-end min-h-[100svh]">

          <motion.div className="w-full pointer-events-none" style={{ y: imgY, opacity: imgOp }}
            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.0, ease: EASE }} aria-hidden="true">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}>
              <img src="/builtstack.png" alt="" loading="eager" fetchPriority="high" width={600} height={600}
                className="w-full h-auto block select-none pointer-events-none"
                style={{ objectFit: 'contain', maxHeight: '38svh' }} />
            </motion.div>
          </motion.div>

          <motion.div className="px-6 pb-12" style={{ y: textY, opacity: textOp }}>
            <h1 className="font-display" style={{
              fontFamily: 'var(--font-display, "Instrument Serif")',
              fontSize: 'clamp(2.8rem, 11vw, 3.8rem)',
              lineHeight: 1.05, letterSpacing: '-0.03em',
              marginBottom: 'clamp(20px, 5vw, 28px)',
              color: 'var(--heading-color, hsl(var(--text-primary)))',
            }}>
              <span className="sr-only">BuiltStack — We design and engineer digital products that perform.</span>
              <span aria-hidden="true" className="block"><SplitWords text="We design &" baseDelay={0.25} /></span>
              <span aria-hidden="true" className="block"><SplitWords text="engineer products" baseDelay={0.48} /></span>
              <span aria-hidden="true" className="block">
                <SplitWords text="that perform" baseDelay={0.72} />
                <span className="inline-block ml-[0.15em]">
                  <TypewriterWord words={['always.', 'flawlessly.', 'at scale.']} startDelay={1.1} />
                </span>
              </span>
            </h1>

            <div className="flex flex-row items-center gap-1 mb-8">
              <Button variant="primary" ariaLabel="Book a free call" delay={1}
                onClick={(e) => { e.preventDefault(); openPopup(); }}>
                Book a Free Call
              </Button>
              <Button variant="ghost" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                ariaLabel="Chat with BuiltStack on WhatsApp" delay={1.4}>
                Chat on WhatsApp
              </Button>
            </div>

            <motion.div className="flex items-center gap-4 flex-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.8 }}>
              <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-faint, hsl(var(--text-faint)))' }}>Trusted by</span>
              <div className="flex items-center gap-3 flex-wrap">
                {CLIENTS.map((name, i) => (
                  <span key={i} className="text-[11px] tracking-wide" style={{ color: 'var(--text-muted, hsl(var(--text-muted)))' }}>
                    {name}{i < CLIENTS.length - 1 && <span className="ml-3" style={{ color: 'var(--border, rgba(255,255,255,0.1))' }}>·</span>}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

      </section>
    </>
  );
}