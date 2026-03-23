import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, target, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v: number) => setVal(Math.floor(v)),
    });
    return ctrl.stop;
  }, [inView, target]);

  return (
    <span ref={ref} className="font-display text-5xl md:text-7xl text-foreground">
      {val}{suffix}
    </span>
  );
}

const STATS = [
  { value: 80, suffix: '+', label: 'Products shipped' },
  { value: 5, suffix: ' yrs', label: 'In the industry' },
  { value: 97, suffix: '%', label: 'Client retention' },
];

export default function Philosophy() {
  return (
    <section className="px-6 md:px-10 py-24 md:py-40 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        {/* Left - vertical label */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE as unknown as number[] }}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground lg:[writing-mode:vertical-lr] lg:rotate-180">
            Our philosophy
          </span>
        </motion.div>

        {/* Center - statement */}
        <motion.div
          className="lg:col-span-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE as unknown as number[] }}
        >
          <p className="font-display text-2xl md:text-4xl leading-[1.3] mb-8">
            We don't build websites. We build{' '}
            <em className="text-bs-accent not-italic">competitive advantages</em>{' '}
            for founders who understand that great software is the product.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
            Every pixel, every API call, every animation is in service of one thing
            - helping your users achieve their goal faster than your competitors can.
          </p>
        </motion.div>

        {/* Right - stats */}
        <div className="lg:col-span-4 flex flex-row lg:flex-col gap-8 lg:gap-12 lg:items-end">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-left lg:text-right"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                ease: EASE as unknown as number[],
                delay: i * 0.1,
              }}
            >
              <CountUp target={stat.value} suffix={stat.suffix} />
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
