'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import InteractiveMeshGrid from '@/components/ui/InteractiveMeshGrid';

//  ─ CONSTANTS         ─
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CALENDLY_URL = 'https://calendly.com/builtstack/30min';
const WHATSAPP_URL = 'https://wa.me/8398919452';

//  ─ SEO STRUCTURED DATA    ─
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

//  ─ CALENDLY HOOK       ─
function useCalendly() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const existing = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    );
    if (existing) {
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
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
    }
  };

  return { ready, openPopup };
}

//  ─ SPLIT TEXT ANIMATION    
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
            transition={{
              duration: 0.9,
              ease: EASE,
              delay: baseDelay + i * 0.06,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

//  ─ TYPEWRITER         
function TypewriterWord({
  words,
  startDelay = 0,
  typeSpeed = 70,
  eraseSpeed = 40,
  pauseAfterType = 2200,
  pauseAfterErase = 400,
}: {
  words: string[];
  startDelay?: number;
  typeSpeed?: number;
  eraseSpeed?: number;
  pauseAfterType?: number;
  pauseAfterErase?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'idle' | 'typing' | 'pausing' | 'erasing'>('idle');
  const [cursorOn, setCursorOn] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentWord = words[currentIndex];

  useEffect(() => {
    const blink = setInterval(() => setCursorOn(p => !p), 530);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    const startTimeout = setTimeout(() => setPhase('typing'), startDelay * 1000);
    return () => clearTimeout(startTimeout);
  }, [startDelay]);

  useEffect(() => {
    if (phase === 'idle') return;

    if (phase === 'typing') {
      if (displayed.length < currentWord.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(currentWord.slice(0, displayed.length + 1));
        }, typeSpeed);
      } else {
        timeoutRef.current = setTimeout(() => setPhase('pausing'), pauseAfterType);
      }
    } else if (phase === 'pausing') {
      timeoutRef.current = setTimeout(() => setPhase('erasing'), 50);
    } else if (phase === 'erasing') {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(currentWord.slice(0, displayed.length - 1));
        }, eraseSpeed);
      } else {
        timeoutRef.current = setTimeout(() => {
          setCurrentIndex(i => (i + 1) % words.length);
          setPhase('typing');
        }, pauseAfterErase);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, phase, currentWord, typeSpeed, eraseSpeed, pauseAfterType, pauseAfterErase, words.length]);

  return (
    <span className="inline-block italic" style={{ color: 'var(--lime, #8fa42e)' }}>
      {displayed}
      <span
        className="inline-block ml-[1px] font-light"
        style={{
          opacity: cursorOn ? 0.9 : 0.1,
          transition: 'opacity 0.12s',
        }}
      >
        |
      </span>
    </span>
  );
}

//  ─ BUTTON           
function Button({
  children,
  onClick,
  href,
  variant = 'primary',
  ariaLabel,
  delay = 0,
  target,
  rel,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  variant?: 'primary' | 'ghost';
  ariaLabel: string;
  delay?: number;
  target?: string;
  rel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.25);
    y.set(dy * 0.25);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isPrimary = variant === 'primary';

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 32px',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    borderRadius: '9999px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background 0.3s, color 0.3s, border-color 0.3s',
    background: isPrimary ? 'var(--lime, #8fa42e)' : 'transparent',
    color: isPrimary ? '#0a0a0a' : 'var(--text-primary, #fff)',
    border: isPrimary ? '1px solid transparent' : '1px solid var(--border, rgba(255,255,255,0.15))',
  };

  const content = (
    <>
      <span>{children}</span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: 'transform 0.3s' }}
      >
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </>
  );

  const motionProps = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.8, ease: EASE },
  };

  const sharedProps = {
    ref,
    style: { ...baseStyles, x: springX, y: springY },
    'aria-label': ariaLabel,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    onClick,
  };

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        {...sharedProps}
        {...motionProps}
        whileHover={{
          background: isPrimary ? '#a3b949' : 'transparent',
          borderColor: isPrimary ? 'transparent' : 'var(--lime, #8fa42e)',
          color: isPrimary ? '#0a0a0a' : 'var(--lime, #8fa42e)',
        }}
        whileTap={{ scale: 0.97 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      {...sharedProps}
      {...motionProps}
      whileHover={{ background: '#9ab337' }}
      whileTap={{ scale: 0.97 }}
    >
      {content}
    </motion.button>
  );
}

//  ─ HERO            
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const textOp = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const imgOp = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const { openPopup } = useCalendly();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />

      <section
        ref={ref}
        aria-label="BuiltStack — Design & Engineering Studio"
        className="relative overflow-hidden"
        style={{
          minHeight: '100svh',
          backgroundColor: 'var(--section-bg, hsl(var(--bg)))',
        }}
      >
        {/* Background grid - very subtle */}
        <InteractiveMeshGrid
          className="absolute inset-0 z-0 pointer-events-none opacity-[1]"
          aria-hidden="true"
        />

        {/* Top bar — minimal info */}
        <motion.div
          className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-12"
          style={{ paddingTop: 'clamp(88px, 11vw, 128px)' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="w-[5px] h-[5px] rounded-full"
              style={{ backgroundColor: 'var(--lime, #8fa42e)' }}
            />
            <span
              className="text-[11px] tracking-[0.28em] uppercase"
              style={{ color: 'var(--text-muted, hsl(var(--text-muted)))' }}
            >
              Design · Engineering · Brand
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span
              className="w-[5px] h-[5px] rounded-full"
              style={{ backgroundColor: 'var(--lime, #8fa42e)' }}
            />
            <span
              className="text-[11px] tracking-[0.28em] uppercase"
              style={{ color: 'var(--text-muted, hsl(var(--text-muted)))' }}
            >
              Available Q1 2026
            </span>
          </div>
        </motion.div>

        {/* Mascot — clean, no glow */}
        <motion.div
          className="absolute z-20 pointer-events-none"
          style={{
            y: imgY,
            opacity: imgOp,
            right: 'clamp(0px, 4vw, 60px)',
            top: 'clamp(140px, 18vw, 200px)',
            width: 'clamp(220px, 32vw, 460px)',
          }}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 1.1, ease: EASE }}
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          >
            <img
              src="/builtstack.png"
              alt=""
              loading="eager"
              fetchPriority="high"
              width={600}
              height={600}
              className="w-full h-auto block select-none pointer-events-none"
              style={{ objectFit: 'contain' }}
            />
          </motion.div>
        </motion.div>

        {/* Main content */}
        <div
          className="relative z-10 flex flex-col justify-end"
          style={{
            minHeight: '100svh',
            padding: '0 clamp(24px, 5vw, 48px)',
            paddingBottom: 'clamp(60px, 8vw, 100px)',
            paddingTop: 'clamp(260px, 45vw, 320px)',
          }}
        >
          <motion.div
            style={{
              y: textY,
              opacity: textOp,
              maxWidth: 'min(100%, 60vw)',
            }}
          >
            {/* Eyebrow */}
            <motion.div
              className="mb-6 md:mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: EASE }}
            >

            </motion.div>

            {/* H1 */}
            <h1
              className="font-display"
              style={{
                fontFamily: 'var(--font-display, "Instrument Serif")',
                fontSize: 'clamp(2rem, 5vw, 7rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                marginBottom: 'clamp(24px, 3.5vw, 48px)',
                color: 'var(--heading-color, hsl(var(--text-primary)))',
              }}
            >
              <span className="sr-only">
                BuiltStack — We design and engineer digital products that perform.
                Web apps, SaaS platforms, mobile apps, and brand systems for founders.
              </span>

              <span aria-hidden="true" className="block">
                <SplitWords text="We design &" baseDelay={0.25} />
              </span>
              <span aria-hidden="true" className="block">
                <SplitWords text="engineer products" baseDelay={0.48} />
              </span>
              <span aria-hidden="true" className="block">
                <SplitWords text="that perform" baseDelay={0.72} />
                <span className="inline-block ml-[0.15em]">
                  <TypewriterWord
                    words={['always.', 'flawlessly.', 'at scale.']}
                    startDelay={1.1}
                  />
                </span>
              </span>
            </h1>

            {/* Subtext
            <motion.p
              className="mb-8 md:mb-10"
              style={{
                fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)',
                lineHeight: 1.7,
                color: 'var(--text-muted, hsl(var(--text-muted)))',
                maxWidth: '460px',
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
            >
              We build web apps, SaaS platforms, and brand systems for founders
              who care about craft. Fast execution, clean code, direct communication.
            </motion.p> */}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                ariaLabel="Book a free call"
                delay={1}
                onClick={(e) => {
                  e.preventDefault();
                  openPopup();
                }}
              >
                Book a Free Call
              </Button>

              <Button
                variant="ghost"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel="Chat with BuiltStack on WhatsApp"
                delay={1.52}
              >
                Chat on WhatsApp
              </Button>
            </div>

            {/* Bottom meta line */}
            <motion.div
              className="mt-12 md:mt-16 flex items-center gap-6 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
            >
              <div className="flex items-center gap-4">
                <span
                  className="text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: 'var(--text-faint, hsl(var(--text-faint)))' }}
                >
                  Trusted by
                </span>
                <div className="flex items-center gap-3">
                  {['Neeraj Dental', 'Sahara', 'Admin Panel'].map((name, i) => (
                    <span
                      key={i}
                      className="text-[11px] tracking-wide"
                      style={{ color: 'var(--text-muted, hsl(var(--text-muted)))' }}
                    >
                      {name}
                      {i < 2 && (
                        <span
                          className="ml-3"
                          style={{ color: 'var(--border, rgba(255,255,255,0.1))' }}
                        >
                          ·
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}