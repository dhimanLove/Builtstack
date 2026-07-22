'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import gsap from 'gsap';
import LazyImage from '@/components/LazyImage';

const PixelBlastBackground = lazy(() => import('@/components/home/WorkGridBackground'));

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const PROJECTS = [
  {
    title: "Admin Panel",
    image: "/projects/pannel.png",
    category: "Dashboard UI",
    year: "2026",
    url: "https://adminn-silk.vercel.app", 
  },
  {
    title: "Neeraj Dental",
    image: "/projects/neerajdental.png",
    category: "Healthcare SaaS",
    year: "2026",
    url: "https://neeraj-dental-clnc.vercel.app", 
  },
  {
    title: "Grog",
    image: "/projects/grog.png",
    category: "Product",
    year: "2026", 
    url: "https://grog-brown.vercel.app/",   
  },
  
];

const ParticleCard = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const isHoveredRef = useRef(false);
  const glowRgb = '212, 245, 60';

  const clearParticles = useCallback(() => {
    particlesRef.current.forEach(p => p.remove());
    particlesRef.current = [];
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let magnetTween: gsap.core.Tween | null = null;

    const onEnter = () => {
      isHoveredRef.current = true;
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          if (!isHoveredRef.current || !el) return;
          const rect = el.getBoundingClientRect();
          const p = document.createElement('div');
          p.style.cssText = `
            position:absolute;width:3px;height:3px;border-radius:50%;pointer-events:none;z-index:50;
            background:rgba(${glowRgb},1);box-shadow:0 0 6px rgba(${glowRgb},.9);
            left:${Math.random() * rect.width}px;top:${Math.random() * rect.height}px;
            will-change:transform,opacity;
          `;
          el.appendChild(p);
          particlesRef.current.push(p);
          gsap.fromTo(p, { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.85, duration: 0.35, ease: 'back.out(2)' });
          gsap.to(p, { x: (Math.random() - .5) * 100, y: (Math.random() - .5) * 100, rotation: Math.random() * 360, duration: 3 + Math.random() * 2, ease: 'none', repeat: -1, yoyo: true });
          gsap.to(p, { opacity: 0.25, duration: 1.6, ease: 'power2.inOut', repeat: -1, yoyo: true });
        }, i * 70);
      }
    };

    const onLeave = () => {
      isHoveredRef.current = false;
      clearParticles();
      gsap.to(el, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.width / 2, cy = rect.height / 2;
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      gsap.to(el, { rotateX: ((y - cy) / cy) * -7, rotateY: ((x - cx) / cx) * 7, duration: 0.15, ease: 'power2.out', transformPerspective: 1200 });
      magnetTween?.kill();
      magnetTween = gsap.to(el, { x: (x - cx) * 0.05, y: (y - cy) * 0.05, duration: 0.4, ease: 'power2.out' });
    };

    const onClick = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      const maxD = Math.max(Math.hypot(cx, cy), Math.hypot(cx - rect.width, cy), Math.hypot(cx, cy - rect.height), Math.hypot(cx - rect.width, cy - rect.height));
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;z-index:200;
        width:${maxD * 2}px;height:${maxD * 2}px;
        left:${cx - maxD}px;top:${cy - maxD}px;
        background:radial-gradient(circle,rgba(${glowRgb},.3) 10%,rgba(${glowRgb},.1) 45%,transparent 70%);
      `;
      el.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0.15, opacity: 0.7 }, { scale: 1.1, opacity: 0, duration: 0.85, ease: 'power2.out', onComplete: () => ripple.remove() });
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('click', onClick);

    return () => {
      clearParticles();
      magnetTween?.kill();
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('click', onClick);
    };
  }, [clearParticles]);

  return (
    <div ref={cardRef} className={`${className} relative overflow-hidden`}>
      {children}
    </div>
  );
};

//    WORK CARD                                           ─
//    WORK CARD                                           ─
function WorkCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const isFull = project.title === "Admin Panel";

  return (
    <motion.div
      className={isFull ? 'col-span-1 md:col-span-2' : 'col-span-1'}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE, delay: index * 0.08 }}
    >
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <ParticleCard className="group cursor-pointer rounded-2xl">
          {/* Image container */}
          <div
            className={`relative overflow-hidden rounded-2xl ${isFull ? 'aspect-[2.2/1]' : 'aspect-[4/3]'}`}
            style={{ backgroundColor: '#0d0d0d' }}
          >
            {/* Project image — fills the card, shows on hover via scale */}
            <LazyImage
              src={project.image}
              alt={`${project.title} — ${project.category} project by BuiltStack`}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
              wrapperClassName="absolute inset-0"
              objectFit="cover"
            />

            {/* Persistent dark vignette so text is always legible */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.35) 45%, rgba(5,5,5,0.05) 100%)',
              }}
            />

            {/* Hover overlay — slightly deeper so details pop */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(to top, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.55) 55%, rgba(5,5,5,0.1) 100%)',
              }}
            />

            {/* Project name always-visible at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
              <h3
                className="font-display leading-tight mb-1 transition-all duration-500"
                style={{
                  fontFamily: 'var(--font-display, "Instrument Serif", serif)',
                  fontSize: isFull ? 'clamp(1.5rem, 3vw, 2.5rem)' : 'clamp(1.25rem, 2.5vw, 2rem)',
                  color: '#f0ece4',
                  textShadow: '0 2px 20px rgba(0,0,0,0.8)',
                }}
              >
                {project.title}
              </h3>
              <p
                className="text-sm tracking-wide transition-all duration-500 translate-y-1 group-hover:translate-y-0"
                style={{ color: '#a0a0a0' }}
              >
                {project.category}
              </p>
            </div>

            {/* Year tag — top right */}
            <div
              className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full text-[11px] tracking-[2px] uppercase"
              style={{
                background: 'rgba(5,5,5,0.7)',
                border: '1px solid rgba(212,245,60,0.18)',
                color: '#d4f53c',
                backdropFilter: 'blur(8px)',
              }}
            >
              {project.year}
            </div>

            {/* Lime accent line — slides in on hover */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[1.5px] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"
              style={{ background: 'linear-gradient(90deg, transparent, #d4f53c, transparent)' }}
            />

            {/* Corner glow on hover */}
            <div
              className="absolute bottom-0 left-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at bottom left, rgba(212,245,60,0.12) 0%, transparent 65%)',
              }}
            />
          </div>
        </ParticleCard>
      </a>
    </motion.div>
  );
}

//    PIXEL BLAST BACKGROUND                                 ──

// Extracted to src/components/home/WorkGridBackground.tsx and lazy-loaded above

//    MAIN EXPORT   ─

export default function WorkGrid() {
  return (
    <section
      id="work"
      className="relative px-6 md:px-10 py-24 md:py-40 max-w-7xl mx-auto overflow-hidden"
      style={{
        backgroundColor: 'transparent',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* PixelBlast Background (code-split) */}
      <Suspense fallback={<div className="absolute inset-0 z-0 bg-transparent" />}>
        <PixelBlastBackground />
      </Suspense>

      {/* Subtle radial glow in top-center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[40vw] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse, rgba(212,245,60,0.04) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">

        {/* Section header */}
        <motion.div
          className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <div>
            <span
              className="text-[11px] uppercase tracking-[3.5px]"
              style={{ color: '#d4f53c', opacity: 0.7 }}
            >
              Selected work
            </span>
            <h2
              className="mt-3 leading-none"
              style={{
                fontFamily: 'var(--font-display, "Instrument Serif", serif)',
                fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
                color: '#f0ece4',
                letterSpacing: '-0.02em',
              }}
            >
              What we&apos;ve shipped.
            </h2>
          </div>

          <a
            href="#"
            className="flex items-center gap-2 text-sm transition-colors duration-300 group"
            style={{ color: '#4a4a4a' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f0ece4')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4a4a4a')}
          >
            View all work
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {PROJECTS.map((project, i) => (
            <WorkCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {/* Bottom rule */}
        <motion.div
          className="mt-20 flex items-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #1a1a1a, transparent)' }} />
          <span className="text-[11px] uppercase tracking-[3px]" style={{ color: '#2a2a2a' }}>
            {PROJECTS.length} projects
          </span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(270deg, #1a1a1a, transparent)' }} />
        </motion.div>

      </div>
    </section>
  );
}