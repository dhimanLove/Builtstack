'use client';

import { useRef, lazy, Suspense } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import LazyImage from '@/components/LazyImage';

// EASING & CONSTANTS
const EASE = [0.23, 1, 0.32, 1] as const;

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

// THEME-AWARE MAGNETIC BUTTON
function MagneticButton({
  href,
  children,
  primary = false,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  icon?: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 280, damping: 24, mass: 0.8 });
  const sy = useSpring(y, { stiffness: 280, damping: 24, mass: 0.8 });
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
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: reducedMotion ? 1 : 0.96 }}
      initial="rest"
      whileHover="hover"
      style={{
        x: reducedMotion ? 0 : sx,
        y: reducedMotion ? 0 : sy,
      }}
      className={`
        relative inline-flex items-center gap-3 px-11 py-4 rounded-full
        text-[11.5px] font-medium tracking-[0.28em] uppercase no-underline select-none
        transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-[var(--lime,#d4f53c)]/70 focus-visible:ring-offset-4 
        focus-visible:ring-offset-[var(--section-bg,hsl(var(--bg)))] overflow-hidden
        ${
          primary
            ? 'bg-[var(--lime,#d4f53c)] text-[var(--on-lime,#0a0a0a)] font-semibold shadow-[0_4px_20px_var(--glow-lime,rgba(212,245,60,0.3))]'
            : 'bg-transparent text-[hsl(var(--text-primary))] border-[1.5px] border-[hsl(var(--text-primary))]'
        }
      `}
    >
      {/* Outer Glow Layer */}
      <motion.div
        style={{ opacity: reducedMotion ? 0 : glowOpacity }}
        className={`
          absolute -inset-[20%] rounded-full blur-framer z-0 pointer-events-none filter blur-[12px]
          ${
            primary
              ? 'bg-[radial-gradient(circle,var(--glow-lime,rgba(212,245,60,0.45))_0%,transparent_70%)]'
              : 'bg-[radial-gradient(circle,var(--glow-lime,rgba(212,245,60,0.25))_0%,transparent_70%)]'
          }
        `}
      />

      {/* Primary Button Shine */}
      {primary && (
        <motion.span
          variants={shineVariants}
          transition={{ duration: 0.55, ease: EASE }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent origin-left scale-x-0"
        />
      )}

      {/* Secondary Button Hover Effects */}
      {!primary && (
        <>
          <motion.span
            variants={secondaryBorderVariants}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 border-[1.5px] border-[var(--lime,#d4f53c)] rounded-full opacity-0"
          />
          <motion.span
            variants={secondaryOverlayVariants}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 bg-[var(--glow-lime,rgba(212,245,60,0.08))] rounded-full opacity-0"
          />
        </>
      )}

      {/* Button Content with Lift */}
      <motion.span
        whileHover={{ y: -1.5 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative z-10 flex items-center gap-2"
      >
        {icon && <span className="inline-flex">{icon}</span>}
        {children}
      </motion.span>

      {/* Arrow Icon with Rotation on Hover */}
      <motion.span
        whileHover={{ x: 4, rotate: 45 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 inline-block"
      >
        →
      </motion.span>
    </motion.a>
  );
}

// WORD & LINE COMPONENTS
function Word({ word, delay, accent = false }: { word: string; delay: number; accent?: boolean }) {
  return (
    <span className="inline-block overflow-hidden mr-[0.25em] pb-[0.18em] mb-[-0.18em] align-bottom">
      <motion.span
        className={`inline-block ${accent ? 'text-[var(--lime,#d4f53c)] italic' : 'text-inherit'}`}
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
    <span className="block">
      {text.split(' ').map((w, i) => (
        <Word key={i} word={w} delay={delay + i * 0.085} accent={accent} />
      ))}
    </span>
  );
}

// CTA SECTION
export default function CTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const imgY = useTransform(scrollYProgress, [0, 1], ['-5%', '10%']);
  const headlineY = useTransform(scrollYProgress, [0, 1], ['3%', '-3%']);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative overflow-hidden bg-[var(--section-bg,hsl(var(--bg)))] border-t border-[var(--card-border,hsl(var(--border)))] px-[clamp(20px,5vw,60px)] py-[clamp(60px,8vw,100px)]"
    >
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-85">
        {/* Replace with your original component if InteractiveMeshGrid handles complex logic internally */}
        <div className="w-full h-full bg-[var(--grid-color,transparent)]" />
      </div>

      {/* Noise Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[length:180px_180px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.45' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Corner accents */}
      {[
        { top: '20px', left: '20px', borderTop: true, borderLeft: true },
        { top: '20px', right: '20px', borderTop: true, borderRight: true },
        { bottom: '20px', left: '20px', borderBottom: true, borderLeft: true },
        { bottom: '20px', right: '20px', borderBottom: true, borderRight: true },
      ].map((pos, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, duration: 0.6, ease: EASE }}
          className="absolute w-7 h-7 pointer-events-none border-[var(--nav-border,hsl(var(--border)))]"
          style={{
            top: pos.top,
            bottom: pos.bottom,
            left: pos.left,
            right: pos.right,
            borderTopWidth: pos.borderTop ? '1px' : '0px',
            borderBottomWidth: pos.borderBottom ? '1px' : '0px',
            borderLeftWidth: pos.borderLeft ? '1px' : '0px',
            borderRightWidth: pos.borderRight ? '1px' : '0px',
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-6 max-w-[1200px] mx-auto">
        
        {/* Left Text Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
          
          {/* Urgency badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-[var(--glow-lime,rgba(212,245,60,0.08))] border border-[var(--lime,#d4f53c)]"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2 h-2 rounded-full bg-[var(--lime,#ffffff91)] shadow-[0_0_12px_var(--lime,#ffffff)]"
            />
            <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[hsl(var(--text-primary))]">
              Accepting 2 new projects for Q1 2026
            </span>
          </motion.div>

          <div className="flex flex-col items-center md:items-start mb-8">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-[30px] tracking-[0.36em] uppercase text-[hsl(var(--text-muted))]"
            >
              Let&apos;s build your vision
            </motion.span>
          </div>

          <motion.h2
            style={{ y: headlineY }}
            className="font-display mb-6 text-[clamp(3rem,7vw,8.5rem)] leading-[0.92] tracking-[-0.03em] text-[var(--heading-color,hsl(var(--text-primary)))]"
          >
            <Line text="Turn your idea" delay={0.15} />
            <Line text="into reality." delay={0.4} accent />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.7, ease: EASE }}
            className="mb-6 text-[clamp(1rem,1.1vw,1.1rem)] max-w-[420px] roaring-relaxed text-[hsl(var(--text-muted))] leading-[1.85]"
          >
            We&apos;ve helped startups and businesses launch products that users love.
            From concept to deployment in weeks, not months.
          </motion.p>

          {/* Social proof stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.65, duration: 0.7, ease: EASE }}
            className="flex items-center gap-8 mb-10"
          >
            {[
              { value: '50+', label: 'Projects Shipped' },
              { value: '98%', label: 'Client Satisfaction' },
              { value: '4.9★', label: 'Average Rating' },
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="text-[clamp(1.5rem,2vw,2rem)] font-bold text-[var(--lime,#d4f53c)] leading-none">
                  {stat.value}
                </div>
                <div className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--text-muted))] mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.72, duration: 0.7, ease: EASE }}
            className="flex flex-col sm:flex-row items-center md:items-start gap-5 mb-14"
          >
            <MagneticButton href="mailto:hello@builtstack.co" primary>
              Start Your Project
            </MagneticButton>
            <MagneticButton
              href="https://cal.com/builtstack/30min"
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              }
            >
              Book a Call
            </MagneticButton>
          </motion.div>

          {/* Divider with Shimmer */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="w-full h-[1px] bg-[var(--card-border,hsl(var(--border)))] max-w-[400px] relative overflow-hidden"
          >
            <motion.div
              animate={{ left: ['-25%', '125%'] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
              className="absolute top-0 h-full w-1/4 bg-gradient-to-r from-transparent via-[var(--lime,#d4f53c)] to-transparent"
            />
          </motion.div>

          {/* Email + Socials */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-8 text-[10px] tracking-[0.3em] uppercase"
          >
            <a href="mailto:builtstack@gmail.com" className="text-[hsl(var(--text-muted))] transition-colors duration-300 hover:text-[var(--lime,#d4f53c)]">
              builtstack@gmail.com
            </a>
            <span className="text-[var(--nav-border,hsl(var(--border)))] text-[10px]">·</span>
            <a href="https://www.instagram.com/builtstack/" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--text-muted))] transition-colors duration-300 hover:text-[var(--logo-text,hsl(var(--text-primary)))]">
              Instagram
            </a>
            <span className="text-[var(--nav-border,hsl(var(--border)))] text-[10px]">·</span>
            <a href="https://www.linkedin.com/company/builtstack" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--text-muted))] transition-colors duration-300 hover:text-[var(--logo-text,hsl(var(--text-primary)))]">
              LinkedIn
            </a>
          </motion.div>
        </div>

        {/* Right Image Container */}
        <motion.div
          style={{ y: imgY }}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.4, duration: 1.1, ease: EASE }}
          className="flex items-center justify-center flex-shrink-0 w-[clamp(250px,50vw,500px)]"
        >
          <div className="relative w-full">
            {/* Soft Backlight */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse,var(--glow-lime,rgba(212,245,60,0.08))_0%,transparent_65%)] filter blur-[40px] rounded-full pointer-events-none" />

            <motion.div
              animate={{ y: [0, -16, 0], rotate: [0, 1, -0.7, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', times: [0, 0.45, 0.75, 1] }}
              className="relative z-10"
            >
              {/* Dynamic Ground Shadow */}
              <motion.div
                animate={{ scaleX: [1, 0.72, 1], opacity: [0.6, 0.18, 0.6] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-[4%] left-1/5 right-1/5 h-6 bg-[var(--glow-lime,rgba(212,245,60,0.1))] filter blur-[16px] rounded-full"
              />

              {/* Mascot Image */}
              <LazyImage
                src="/builtstack.png"
                alt="BuiltStack mascot"
                width={500}
                height={500}
                className="w-full h-auto block select-none pointer-events-none object-contain drop-shadow-[0_24px_40px_var(--color-shadow-soft,rgba(0,0,0,0.6))] drop-shadow-[0_0_32px_var(--glow-subtle,rgba(212,245,60,0.06))]"
                objectFit="contain"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Ghost Watermark */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end h-2/5 overflow-hidden pointer-events-none">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1.2 }}
          className="font-display select-none whitespace-nowrap text-[clamp(72px,16vw,180px)] leading-[0.82] tracking-[-0.04em] text-transparent text-stroke"
          style={{
            WebkitTextStroke: '1px var(--text-faint-alpha, rgba(255, 255, 255, 0.025))',
          }}
        >
          BuiltStack
        </motion.span>
      </div>
    </section>
  );
}