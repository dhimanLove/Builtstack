import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const CASE_STUDIES = [
  { title: 'Vaultly', sub: 'SaaS · 2026', bg: 'hsl(0,0%,6.7%)' },
  { title: 'Forma UI', sub: 'Design System · 2026', bg: 'hsl(0,0%,5.5%)' },
  { title: 'Meridian', sub: 'Brand · 2023', bg: 'hsl(0,0%,6.7%)' },
  { title: 'Stackwise', sub: 'Web App · 2023', bg: 'hsl(0,0%,5.5%)' },
];

export default function HorizontalScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-55%']);

  return (
    <div ref={ref} className="relative py-24 md:py-40 overflow-hidden">
      <div className="px-6 md:px-10 mb-12">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Process & Case Studies
        </span>
      </div>

      <motion.div
        className="flex gap-6 will-change-transform pl-6 md:pl-10"
        style={{ x }}
      >
        {CASE_STUDIES.map((item, i) => (
          <div
            key={i}
            className="shrink-0 w-[70vw] md:w-[45vw] h-[50vh] md:h-[60vh] rounded-xl flex flex-col justify-end p-8 md:p-12 cursor-pointer group"
            style={{ background: item.bg }}
          >
            <span className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              {item.sub}
            </span>
            <span className="font-display text-4xl md:text-6xl text-foreground group-hover:text-bs-accent transition-colors duration-500">
              {item.title}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
