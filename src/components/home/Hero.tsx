'use client';

import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { ArrowUpRight, WhatsappLogo, CalendarBlank } from '@phosphor-icons/react';
import LazyImage from '@/components/LazyImage';

const InteractiveMeshGrid = lazy(() => import('@/components/ui/InteractiveMeshGrid'));

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CALENDLY_URL = 'https://calendly.com/builtstack/30min';
const WHATSAPP_URL = 'https://wa.me/8398919452';
const CLIENTS = ['Neeraj Dental', 'Sahara', 'Admin Panel'];

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BuiltStack',
  url: 'https://builtstack-eight.vercel.app/',
  description:
    'BuiltStack is a design and engineering studio specializing in web apps, SaaS platforms, mobile apps, and brand systems for founders and startups.',
  founder: [
    { '@type': 'Person', name: 'Loveraj', jobTitle: 'Co-Founder & Developer' },
    { '@type': 'Person', name: 'Rudra', jobTitle: 'Co-Founder' },
  ],
  sameAs: [
    'https://linkedin.com/company/builtstack',
    'https://www.instagram.com/builtstack/',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    url: CALENDLY_URL,
    availableLanguage: ['English', 'Hindi'],
  },
};

// ── Calendly hook ─────────────────────────────────────────
function useCalendly() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      setReady(true);
      return;
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
    const w = window as Window & {
      Calendly?: { initPopupWidget: (opts: { url: string }) => void };
    };
    if (w.Calendly) {
      w.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
    }
  };
  return { ready, openPopup };
}

// ── Split word reveal ─────────────────────────────────────
function SplitWords({ text, baseDelay }: { text: string; baseDelay: number }) {
  return (
    <span className="inline-block">
      {text.split(' ').map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden mr-[0.22em] pb-[0.12em] mb-[-0.12em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.7, ease: EASE, delay: baseDelay + i * 0.04 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ── Typewriter ────────────────────────────────────────────
function TypewriterWord({ words, startDelay = 0 }: { words: string[]; startDelay?: number }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'idle' | 'typing' | 'pausing' | 'erasing'>('idle');
  const [cursorOn, setCursorOn] = useState(true);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const word = words[idx];

  useEffect(() => {
    const b = setInterval(() => setCursorOn((p) => !p), 530);
    return () => clearInterval(b);
  }, []);

  useEffect(() => {
    const s = setTimeout(() => setPhase('typing'), startDelay * 1000);
    return () => clearTimeout(s);
  }, [startDelay]);

  useEffect(() => {
    if (phase === 'idle') return;
    const clear = () => { if (t.current) clearTimeout(t.current); };
    if (phase === 'typing') {
      if (displayed.length < word.length)
        t.current = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 70);
      else t.current = setTimeout(() => setPhase('pausing'), 2200);
    } else if (phase === 'pausing') {
      t.current = setTimeout(() => setPhase('erasing'), 50);
    } else if (phase === 'erasing') {
      if (displayed.length > 0)
        t.current = setTimeout(() => setDisplayed(word.slice(0, displayed.length - 1)), 40);
      else
        t.current = setTimeout(() => {
          setIdx((i) => (i + 1) % words.length);
          setPhase('typing');
        }, 400);
    }
    return clear;
  }, [displayed, phase, word, words.length]);

  return (
    <span className="inline-block italic text-[var(--lime)]">
      {displayed}
      <span
        className="inline-block ml-px font-light"
        style={{ opacity: cursorOn ? 0.9 : 0.1, transition: 'opacity 0.12s' }}
      >
        |
      </span>
    </span>
  );
}

// ── Button ────────────────────────────────────────────────
function Button({
  children,
  onClick,
  href,
  variant = 'primary',
  ariaLabel,
  delay = 0,
  target,
  rel,
  icon,
  fullWidth = false,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  variant?: 'primary' | 'ghost';
  ariaLabel: string;
  delay?: number;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });
  const isPrimary = variant === 'primary';

  const handleMove = (e: React.MouseEvent) => {
    if (reducedMotion) return;
    const el = anchorRef.current ?? buttonRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };

  const baseClass = [
    'inline-flex items-center justify-center gap-1.5 sm:gap-2',
    // touch target: min 44px height, comfortable padding
    'min-h-[44px] px-3 sm:px-6',
    fullWidth ? 'flex-1 w-full' : '',
    'text-[11px] sm:text-[11px] font-medium tracking-[0.12em] sm:tracking-[0.18em] uppercase',
    'whitespace-nowrap',
    'rounded-full select-none no-underline border',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lime)]/60 focus-visible:ring-offset-2',
    isPrimary
      ? 'bg-[var(--lime)] text-[#0a0a0a] hover:bg-[var(--lime)]/90 border-transparent'
      : 'bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--lime)] hover:text-[var(--lime)]',
  ].join(' ');

  const motionProps = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.8, ease: EASE },
    whileTap: { scale: reducedMotion ? 1 : 0.97 },
    style: { x: reducedMotion ? 0 : sx, y: reducedMotion ? 0 : sy },
    'aria-label': ariaLabel,
    onMouseMove: handleMove,
    onMouseLeave: () => { x.set(0); y.set(0); },
    onClick,
  };

  const content = (
    <>
      {icon && <span className="inline-flex" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
      <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
    </>
  );

  if (href) {
    return (
      <motion.a ref={anchorRef} href={href} target={target} rel={rel} className={baseClass} {...motionProps}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button ref={buttonRef} type="button" className={baseClass} {...motionProps}>
      {content}
    </motion.button>
  );
}

// ── Hero ──────────────────────────────────────────────────
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const textOp = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const imgOp = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const { openPopup } = useCalendly();

  const headline = (
    <h1
      className="font-display text-[var(--heading-color)]"
      style={{
        fontFamily: 'var(--font-display, "Instrument Serif")',
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
      }}
    >
      <span className="sr-only">
        BuiltStack — We design and engineer digital products that perform.
      </span>
      <span aria-hidden="true" className="block">
        <SplitWords text="We design &" baseDelay={0.2} />
      </span>
      <span aria-hidden="true" className="block">
        <SplitWords text="engineer products" baseDelay={0.35} />
      </span>
      <span aria-hidden="true" className="block">
        <SplitWords text="that perform" baseDelay={0.5} />
        <span className="inline-block ml-[0.15em]">
          <TypewriterWord words={['always.', 'flawlessly.', 'at scale.']} startDelay={0.9} />
        </span>
      </span>
    </h1>
  );

  // Buttons: side-by-side (row, equal width) on mobile per wireframe;
  // natural row layout on desktop.
  const buttons = (mobile: boolean) => (
    <div className={mobile
      ? 'flex flex-row gap-2 w-full'
      : 'flex flex-row items-center gap-3'
    }>
      <Button
        variant="primary"
        ariaLabel="Book a free call"
        delay={0.7}
        icon={<CalendarBlank size={13} weight="regular" />}
        onClick={(e) => { e.preventDefault(); openPopup(); }}
        fullWidth={mobile}
      >
        {mobile ? 'Free Call' : 'Book a Free Call'}
      </Button>
      <Button
        variant="ghost"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        ariaLabel="Chat with BuiltStack on WhatsApp"
        delay={0.85}
        icon={<WhatsappLogo size={13} weight="regular" />}
        fullWidth={mobile}
      >
        {mobile ? 'Chat' : 'Chat on WhatsApp'}
      </Button>
    </div>
  );

  const trustedBy = (
    <motion.div
      className="flex items-center gap-2 sm:gap-3 flex-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.1, duration: 0.6 }}
    >
      <span className="text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[var(--text-faint)] whitespace-nowrap">
        Trusted by
      </span>
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {CLIENTS.map((name, i) => (
          <span key={i} className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-[var(--text-muted)] whitespace-nowrap">
            {name}
            {i < CLIENTS.length - 1 && (
              <span className="text-[var(--border)]" aria-hidden="true">·</span>
            )}
          </span>
        ))}
      </div>
    </motion.div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />

      <section
        ref={ref}
        aria-label="BuiltStack — Design & Engineering Studio"
        className="relative overflow-hidden bg-[var(--section-bg)]"
        style={{ minHeight: '100svh' }}
      >
        <Suspense fallback={<div className="absolute inset-0 z-0 bg-[var(--section-bg)]" />}>
          <InteractiveMeshGrid
            className="absolute inset-0 z-0 pointer-events-none opacity-2 grayscale"
            aria-hidden="true"
          />
        </Suspense>

        {/* ── Top bar — desktop only ── */}
        <motion.div
          className="absolute top-6 left-0 right-0 z-30 hidden md:flex items-center justify-between px-12"
          style={{ paddingTop: 'clamp(88px, 11vw, 128px)' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
        >
          <div className="flex items-center gap-2.5">
            {/* <span className="w-[5px] h-[5px] rounded-full bg-[var(--lime)]" />
            <span className="text-[11px] tracking-[0.28em] uppercase text-[var(--text-muted)]">
              Design · Engineering · Brand
            </span> */}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--lime)]" />
            <span className="text-[11px] tracking-[0.28em] uppercase text-[var(--text-muted)]">
              Available Q1 2026
            </span>
          </div>
        </motion.div>

        {/* ── Desktop layout ── */}
        <div className="relative z-10 hidden md:flex items-center min-h-[100svh] px-12 lg:px-16 xl:px-20 pt-28 pb-16">
          <motion.div
            className="flex-1 min-w-0 pr-8 lg:pr-16 pt-48 lg:pt-64"
            style={{ y: reducedMotion ? 0 : textY, opacity: textOp }}
          >
            <div
              style={{
                fontSize: 'clamp(2.8rem, 4.2vw, 6rem)',
                marginBottom: 'clamp(24px, 3vw, 40px)',
              }}
            >
              {headline}
            </div>

            <div className="mb-10">
              {buttons(false)}
            </div>

            {trustedBy}
          </motion.div>

          <motion.div
            className="flex-shrink-0 w-[36vw] lg:w-[38vw] xl:w-[40vw] max-w-[560px] pointer-events-none"
            style={{ y: reducedMotion ? 0 : imgY, opacity: imgOp }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1.1, ease: EASE }}
            aria-hidden="true"
          >
            <motion.div
              animate={reducedMotion ? {} : { y: [0, 6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <LazyImage
                src="/builtstack.png"
                alt="BuiltStack — Design & Engineering Studio"
                width={800}
                height={800}
                priority
                className="w-full h-auto block select-none pointer-events-none"
                objectFit="contain"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* ── Mobile layout ── */}
        <div className="relative z-10 flex md:hidden flex-col min-h-[100svh]">

          {/* Mascot — no border, takes more vertical space */}
          <motion.div
            className="flex-[1.4] flex items-center justify-center pointer-events-none px-10 pt-20 pb-2"
            style={{ y: reducedMotion ? 0 : imgY, opacity: imgOp }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1.0, ease: EASE }}
            aria-hidden="true"
          >
            <motion.div
              animate={reducedMotion ? {} : { y: [0, 6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full max-w-[320px]"
            >
              <LazyImage
                src="/builtstack.png"
                alt="BuiltStack — Design & Engineering Studio"
                width={600}
                height={600}
                priority
                className="w-full h-auto block select-none pointer-events-none select-none"
                objectFit="contain"
              />
            </motion.div>
          </motion.div>

          {/* Text + buttons — bottom, condensed for less clutter */}
          <motion.div
            className="px-6 pb-8 pt-4 flex flex-col gap-4"
            style={{ y: reducedMotion ? 0 : textY, opacity: textOp }}
          >
            <div style={{ fontSize: 'clamp(2.2rem, 9vw, 3.2rem)' }}>
              {headline}
            </div>

            {buttons(true)}

            {trustedBy}
          </motion.div>
        </div>
      </section>
    </>
  );
}