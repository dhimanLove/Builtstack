'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';


// TESTIMONIALS DATA

const TESTIMONIALS = [
  {
    quote:
      "BuiltStack helped us go from a rough MVP to a production-ready platform in weeks. The clarity in their process and speed of execution is rare.",
    name: "Ananya Sharma",
    role: "Founder, FinEdge (Fintech Startup)",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    companyLogo: "https://placehold.co/40x40/1a1a1a/d4f53c?text=F",
  },
  {
    quote:
      "Their design system completely transformed how our product feels. Clean, scalable, and actually developer-friendly.",
    name: "Rohit Mehta",
    role: "Product Lead, ScaleX",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    companyLogo: "https://placehold.co/40x40/1a1a1a/d4f53c?text=S",
  },
  {
    quote:
      "We've worked with multiple agencies, but BuiltStack stands out. They think like product builders, not just designers.",
    name: "Priya Nair",
    role: "Co-founder, HealthBridge",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    companyLogo: "https://placehold.co/40x40/1a1a1a/d4f53c?text=H",
  },
  {
    quote:
      "From UI to backend architecture, everything was handled with precision. Our platform feels fast, stable, and premium.",
    name: "Arjun Verma",
    role: "CTO, EduStack",
    avatar: "https://randomuser.me/api/portraits/men/28.jpg",
    companyLogo: "https://placehold.co/40x40/1a1a1a/d4f53c?text=E",
  },
  {
    quote:
      "They don't just deliver screens - they deliver thinking. Every decision felt intentional and aligned with our business goals.",
    name: "Kavya Reddy",
    role: "Head of Product, GrowthLoop",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
    companyLogo: "https://placehold.co/40x40/1a1a1a/d4f53c?text=G",
  },
];


// HORIZONTAL SCROLL TESTIMONIALS - THEME ADAPTIVE + TAILWIND REFACTORED

export default function HorizontalScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-55%']);

  // Theme-aware color tokens from your CSS variables
  const sectionBg = 'var(--section-bg, hsl(var(--bg)))';
  const cardBg = 'var(--card-bg, hsl(var(--surface)))';
  const cardBorder = 'var(--card-border, hsl(var(--border)))';
  const headingColor = 'var(--heading-color, hsl(var(--text-primary)))';
  const bodyColor = 'var(--body-color, hsl(var(--text-muted)))';
  const faintColor = 'var(--text-faint, hsl(var(--text-faint)))';
  const accentColor = 'var(--lime, #d4f53c)';
  const glowColor = 'var(--glow-lime, rgba(211, 245, 60, 0.35))';
  const tagBg = 'var(--tag-bg, hsl(var(--surface)))';
  const tagText = 'var(--tag-text, hsl(var(--text-faint)))';

  return (
    <div
      ref={ref}
      className="relative py-24 md:py-40 overflow-hidden"
      style={{ backgroundColor: sectionBg }}
    >
      {/* ── Section Header ── */}
      <div className="px-6 md:px-10 mb-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.3em] font-mono"
          style={{ color: accentColor }}
        >
          Trusted by creators
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-display mt-4 max-w-2xl"
          style={{ color: headingColor }}
        >
          What our clients say
        </motion.h2>
      </div>

      {/* ── Horizontal Scroller ── */}
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
            className="relative shrink-0 w-[85vw] md:w-[35vw] rounded-2xl p-8 md:p-10 shadow-2xl group"
            style={{
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
            }}
          >
            {/* Quote icon - theme-aware lime with opacity */}
            <div
              className="absolute top-6 right-6 text-6xl font-serif select-none"
              style={{ color: `${accentColor}33` }} // 20% opacity hex approximation
            >
              "
            </div>

            {/* Avatar + Info */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-14 h-14 rounded-full object-cover"
                style={{
                  ring: `2px solid ${accentColor}`,
                  boxShadow: `0 0 0 2px ${accentColor}4D` // 30% opacity
                }}
              />
              <div>
                <h3 className="font-semibold text-lg" style={{ color: headingColor }}>
                  {item.name}
                </h3>
                <p className="text-sm tracking-wide" style={{ color: bodyColor }}>
                  {item.role}
                </p>
              </div>
            </div>

            {/* Quote text */}
            <p
              className="text-lg md:text-xl leading-relaxed mb-8 font-light"
              style={{ color: `${headingColor}CC` }} // ~80% opacity
            >
              {item.quote}
            </p>

            {/* Company logo / branding */}
            <div
              className="flex items-center gap-2 pt-4"
              style={{ borderTop: `1px solid ${cardBorder}` }}
            >
              {/* Company logo with theme-aware background */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: tagBg,
                  color: accentColor,
                }}
              >
                {item.companyLogo ? (
                  <img src={item.companyLogo} alt="logo" className="w-full h-full rounded-lg object-cover" />
                ) : item.name.charAt(0)}
              </div>
              <span className="text-xs tracking-wider" style={{ color: tagText }}>
                - trusted partner
              </span>
            </div>

            {/* Hover glow effect - theme-aware gradient */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${glowColor}0D 0%, transparent 50%, transparent 100%)`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}