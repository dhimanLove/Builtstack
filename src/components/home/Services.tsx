import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const SERVICES = [
  {
    n: '01',
    title: 'Product Design',
    desc: 'End-to-end UX/UI — wireframes, prototypes, design systems, and handoff-ready Figma files that engineers love.',
    tags: ['UX Research', 'UI Design', 'Design Systems'],
  },
  {
    n: '02',
    title: 'Web Development',
    desc: 'Next.js, React, TypeScript — production-grade web apps with obsessive attention to performance and code quality.',
    tags: ['Next.js', 'React', 'TypeScript'],
  },
  {
    n: '03',
    title: 'SaaS Engineering',
    desc: 'Full-stack product development — auth, billing, dashboards, APIs. From MVP to scalable architecture.',
    tags: ['Full Stack', 'APIs', 'Databases'],
  },
  {
    n: '04',
    title: 'Brand Identity',
    desc: 'Visual identity systems that hold up at every scale — logos, typography, color, motion, brand guidelines.',
    tags: ['Logo', 'Identity', 'Guidelines'],
  },
  {
    n: '05',
    title: 'Motion & Interaction',
    desc: 'Framer Motion, GSAP, Three.js — scroll storytelling and micro-interactions that make products feel alive.',
    tags: ['Framer Motion', 'GSAP', '3D'],
  },
];

export default function Services() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="services" className="px-6 md:px-10 py-24 md:py-40 max-w-7xl mx-auto">
      {/* Section header */}
      <motion.div
        className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE as unknown as number[] }}
      >
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            What we do
          </span>
          <h2 className="font-display text-4xl md:text-6xl mt-3 leading-[1.05]">
            Services that ship.
          </h2>
        </div>
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          All services
          <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
        </a>
      </motion.div>

      {/* Accordion list */}
      <div className="border-t border-bs-border">
        {SERVICES.map((service, i) => (
          <motion.div
            key={i}
            className="border-b border-bs-border"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.6,
              ease: EASE as unknown as number[],
              delay: i * 0.05,
            }}
          >
            <button
              className="w-full flex items-center justify-between py-6 md:py-8 text-left group cursor-pointer"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex items-center gap-6 md:gap-10">
                <span className="text-xs text-muted-foreground font-mono">
                  {service.n}
                </span>
                <span className="text-xl md:text-3xl font-display text-foreground group-hover:text-bs-accent transition-colors duration-300">
                  {service.title}
                </span>
              </div>
              <motion.span
                className="text-2xl text-muted-foreground"
                animate={{ rotate: open === i ? 45 : 0 }}
                transition={{ duration: 0.3 }}
              >
                +
              </motion.span>
            </button>

            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE as unknown as number[] }}
                  className="overflow-hidden"
                >
                  <div className="pb-8 pl-12 md:pl-20 max-w-2xl">
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
                      {service.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs border border-bs-border rounded-full text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
