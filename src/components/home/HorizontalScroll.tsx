'use client';

import { motion } from 'framer-motion';
import { GithubLogo, LinkedinLogo } from '@phosphor-icons/react';

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const FOUNDERS = [
  {
    name: 'Loveraj',
    image: '/assets/Loveraj.jpg',
    quote: 'Get Set Fly',
    role: 'Founder',
    github: 'https://github.com/dhimanLove',
    linkedin: 'https://www.linkedin.com/in/love-raj-dhiman-a08142274/',
  },
  {
    name: 'Rudra',
    image: '/assets/Rudra.jpg',
    quote: "Let's Go",
    role: 'Founder',
    github: 'https://github.com/rudra',
    linkedin: 'https://www.linkedin.com/in/rudra-pratap-singh-b99188330/',
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="about-section"
      style={{ backgroundColor: 'var(--section-bg)' }}
    >
      <div className="about-inner">

        {/* ── Header ── */}
        <motion.div
          className="about-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className="about-eyebrow">The Team</span>
          <h2 className="about-title">Meet the Founders</h2>
        </motion.div>

        {/* ── Founders Grid ── */}
        <div className="founders-grid">

          {/* Left — Loveraj */}
          <FounderCard founder={FOUNDERS[0]} delay={0.1} />

          {/* Middle — Quotes (desktop only) */}
          <motion.div
            className="quotes-col"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE, delay: 0.25 }}
          >
            <blockquote className="quote quote--left">
              &ldquo;{FOUNDERS[0].quote}&rdquo;
            </blockquote>
            <div className="quote-divider" />
            <blockquote className="quote quote--right">
              &ldquo;{FOUNDERS[1].quote}&rdquo;
            </blockquote>
          </motion.div>

          {/* Right — Rudra */}
          <FounderCard founder={FOUNDERS[1]} delay={0.4} />
        </div>

        {/* ── Mobile Quotes ── */}
        <motion.div
          className="quotes-mobile"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
        >
          {FOUNDERS.map((f) => (
            <blockquote key={f.name} className="quote-mobile-item">
              &ldquo;{f.quote}&rdquo;
            </blockquote>
          ))}
        </motion.div>

        {/* ── Footer Rule ── */}
        <motion.div
          className="about-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
        >
          <p className="about-footer-text">
            2 founders · built with intent · shipped with pride
          </p>
        </motion.div>
      </div>

      {/* ── Scoped Styles ── */}
      <style>{`
        /* ─── Layout ─────────────────────────────── */
        .about-section {
          position: relative;
          padding: 96px 0 112px;          /* 8dp rhythm: 96 / 112 */
          overflow: hidden;
        }

        .about-inner {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;               /* mobile gutter */
        }

        /* ─── Header ─────────────────────────────── */
        .about-header {
          text-align: center;
          margin-bottom: 80px;           /* 8dp × 10 */
        }

        .about-eyebrow {
          display: inline-block;
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 20px;
        }

        .about-title {
          font-family: var(--font-display, "Instrument Serif", serif);
          font-weight: 400;
          font-size: clamp(2.5rem, 7vw, 5rem);  /* fluid: 40px → 80px */
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: var(--heading-color);
          margin: 0;
        }

        /* ─── Founders 3-col grid ─────────────────── */
        .founders-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: start;
          max-width: 1100px;
          margin: 0 auto;
        }

        @media (min-width: 1024px) {
          .founders-grid {
            grid-template-columns: 1fr 180px 1fr;
            gap: 40px;
            align-items: center;
          }
        }

        /* ─── Founder Card ────────────────────────── */
        .founder-card {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .founder-image-wrap {
          width: 100%;
          max-width: 320px;
          aspect-ratio: 4 / 5;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 32px;           /* 8dp × 4 */
          border: 1.5px solid var(--border);
          background: var(--surface);
        }

        .founder-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .founder-image-wrap:hover img {
          transform: scale(1.04);
        }

        .founder-name {
          font-family: var(--font-display, "Instrument Serif", serif);
          font-weight: 400;
          font-size: clamp(1.75rem, 3vw, 2.25rem);
          letter-spacing: -0.02em;
          color: var(--heading-color);
          margin: 0 0 8px 0;             /* 8dp */
          text-align: center;
        }

        .founder-role {
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin: 0 0 32px 0;            /* 8dp × 4 */
          text-align: center;
        }

        /* ─── Social Buttons ──────────────────────── */
        .social-row {
          display: flex;
          align-items: center;
          gap: 12px;                     /* 8dp + 4 */
        }

        .social-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;                      /* 8dp */
          padding: 12px 20px;            /* 44px tall touch target */
          border-radius: 9999px;
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          background: var(--surface);
          color: var(--text-primary);
          border: 1px solid var(--border);
          transition:
            border-color 0.25s ease,
            color 0.25s ease,
            background 0.25s ease;
          min-height: 44px;              /* WCAG touch target */
          cursor: pointer;
        }

        .social-btn:hover,
        .social-btn:focus-visible {
          border-color: var(--lime);
          color: var(--lime);
          outline: none;
        }

        .social-btn:focus-visible {
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--lime) 30%, transparent);
        }

        /* ─── Middle Quotes Column (desktop) ─────── */
        .quotes-col {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 32px;
          height: 100%;
          min-height: 400px;
          padding: 24px 0;
        }

        @media (min-width: 1024px) {
          .quotes-col {
            display: flex;
          }
        }

        .quote {
          font-family: var(--font-display, "Instrument Serif", serif);
          font-style: italic;
          font-weight: 400;
          font-size: 1.375rem;
          line-height: 1.4;
          letter-spacing: -0.01em;
          color: var(--lime, #b0c940);
          margin: 0;
          padding: 0;
        }

        .quote--left {
          text-align: left;
          align-self: flex-start;
        }

        .quote--right {
          text-align: right;
          align-self: flex-end;
        }

        .quote-divider {
          width: 1px;
          height: 64px;
          background: var(--border);
          flex-shrink: 0;
        }

        /* ─── Mobile Quotes ───────────────────────── */
        .quotes-mobile {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          margin-top: 56px;
          padding-top: 48px;
          border-top: 1px solid var(--border);
        }

        @media (min-width: 1024px) {
          .quotes-mobile {
            display: none;
          }
        }

        .quote-mobile-item {
          font-family: var(--font-display, "Instrument Serif", serif);
          font-style: italic;
          font-weight: 400;
          font-size: 1.25rem;
          line-height: 1.45;
          letter-spacing: -0.01em;
          color: var(--lime, #b0c940);
          text-align: center;
          margin: 0;
          padding: 0;
        }

        /* ─── Footer ──────────────────────────────── */
        .about-footer {
          margin-top: 80px;              /* 8dp × 10 */
          padding-top: 32px;             /* 8dp × 4 */
          border-top: 1px solid var(--border);
          text-align: center;
        }

        .about-footer-text {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--text-faint);
          margin: 0;
        }

        /* ─── Tablet adjustments ──────────────────── */
        @media (min-width: 640px) {
          .about-inner {
            padding: 0 40px;
          }

          .about-section {
            padding: 112px 0 128px;
          }

          .about-header {
            margin-bottom: 96px;
          }

          .founders-grid {
            gap: 56px;
          }
        }

        /* ─── Desktop ─────────────────────────────── */
        @media (min-width: 1024px) {
          .about-inner {
            padding: 0 48px;
          }

          .about-section {
            padding: 128px 0 144px;
          }

          .about-header {
            margin-bottom: 104px;
          }
        }

        /* ─── Reduced motion ──────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .founder-image-wrap img {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}

/* ── Reusable Founder Card ── */
function FounderCard({
  founder,
  delay,
}: {
  founder: (typeof FOUNDERS)[0];
  delay: number;
}) {
  const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

  return (
    <motion.div
      className="founder-card"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {/* Photo */}
      <div className="founder-image-wrap">
        <img
          src={founder.image}
          alt={`${founder.name}, ${founder.role} at BuiltStack`}
          width={320}
          height={400}
          loading="lazy"
        />
      </div>

      {/* Name */}
      <h3 className="founder-name">{founder.name}</h3>

      {/* Role */}
      <p className="founder-role">{founder.role}</p>

      {/* Social */}
      <div className="social-row">
        <a
          href={founder.github}
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn"
          aria-label={`${founder.name}'s GitHub profile`}
        >
          <GithubLogo size={14} weight="regular" aria-hidden="true" />
          GitHub
        </a>
        <a
          href={founder.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn"
          aria-label={`${founder.name}'s LinkedIn profile`}
        >
          <LinkedinLogo size={14} weight="regular" aria-hidden="true" />
          LinkedIn
        </a>
      </div>
    </motion.div>
  );
}