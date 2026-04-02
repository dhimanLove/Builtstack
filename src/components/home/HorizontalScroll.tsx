import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const TESTIMONIALS = [
  {
    quote: "BuiltStack didn't just build a product – they built a strategy. The attention to detail and the final output exceeded every expectation.",
    name: "Sarah Chen",
    role: "CTO, Vaultly",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    companyLogo: "https://placehold.co/40x40/1a1a1a/d4f53c?text=V",
  },
  {
    quote: "The design system they created for Forma UI saved us months of development. It's pure elegance in every component.",
    name: "Marcus De Silva",
    role: "Lead Designer, Forma",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    companyLogo: "https://placehold.co/40x40/1a1a1a/d4f53c?text=F",
  },
  {
    quote: "Working with BuiltStack felt like having an in-house team that actually cares. They brought our brand to life in ways we couldn't imagine.",
    name: "Elena Voss",
    role: "Brand Director, Meridian",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    companyLogo: "https://placehold.co/40x40/1a1a1a/d4f53c?text=M",
  },
  {
    quote: "Stackwise's API architecture is rock‑solid, and the user experience is buttery smooth. BuiltStack is our go‑to for anything critical.",
    name: "James Okafor",
    role: "Founder, Stackwise",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    companyLogo: "https://placehold.co/40x40/1a1a1a/d4f53c?text=S",
  },
];

export default function HorizontalScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-55%']);

  return (
    <div ref={ref} className="relative py-24 md:py-40 overflow-hidden bg-[#080808]">
      {/* Section header */}
      <div className="px-6 md:px-10 mb-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.3em] text-lime-400 font-mono"
        >
          Trusted by creators
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-display mt-4 text-white max-w-2xl"
        >
          What our clients say
        </motion.h2>
      </div>

      {/* Horizontal scroller */}
      <motion.div
        className="flex gap-8 will-change-transform pl-6 md:pl-10"
        style={{ x }}
      >
        {TESTIMONIALS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className="relative shrink-0 w-[85vw] md:w-[35vw] bg-[#0f0f0f] rounded-2xl p-8 md:p-10 border border-white/5 shadow-2xl group"
          >
            {/* Quote icon */}
            <div className="absolute top-6 right-6 text-6xl font-serif text-lime-400/20 select-none">
              “
            </div>

            {/* Avatar + info */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-lime-400/30"
              />
              <div>
                <h3 className="text-white font-semibold text-lg">{item.name}</h3>
                <p className="text-white/50 text-sm tracking-wide">{item.role}</p>
              </div>
            </div>

            {/* Quote text */}
            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 font-light">
              {item.quote}
            </p>

            {/* Company logo / branding */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/10">
              <img src={item.companyLogo} alt="logo" className="w-8 h-8 rounded-lg" />
              <span className="text-white/40 text-xs tracking-wider">— trusted partner</span>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-lime-500/5 via-transparent to-transparent" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}