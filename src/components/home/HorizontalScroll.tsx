'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const FOUNDERS = [
  {
    name: 'Loveraj',
    image: 'public/assets/Loveraj.png',
    quote: 'Get Set Fly',
    role: 'Founder',
    github: 'https://github.com/dhimanLove',
    linkedin: 'https://www.linkedin.com/in/love-raj-dhiman-a08142274/',
  },
  {
    name: 'Rudra',
    image: 'public/assets/Rudra.jpg',
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
      className="relative py-20 md:py-30 overflow-hidden"
      style={{ backgroundColor: 'var(--section-bg)' }}
    >
      <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-32 md:mb-40"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <h2
            className="text-4xl md:text-6xl lg:text-7xl"
            style={{
              fontFamily: 'var(--font-display, "Instrument Serif", serif)',
              fontWeight: 400,

              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Meet the Founders
          </h2>
        </motion.div>

        {/* Main Layout - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start max-w-6xl mx-auto mb-32">

          {/* Left Column - Loveraj */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            {/* Image */}
            <div
              className="w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden mb-8"
              style={{ border: '2px solid var(--border)' }}
            >
              <img
                src={FOUNDERS[0].image}
                alt={FOUNDERS[0].name}
                className="w-full h-full object-cover"
                style={{ fontFamily: 'var(--font-display, "Instrument Serif", serif)' }}
              />
            </div>

            {/* Name */}
            <h3
              className="text-3xl md:text-4xl mb-2"
              style={{
                fontFamily: 'var(--font-display, "Instrument Serif", serif)',
                fontWeight: 400,
                color: 'var(--heading-color)',
                letterSpacing: '-0.02em',
              }}
            >
              {FOUNDERS[0].name}
            </h3>

            {/* Role */}
            <p
              className="text-xs tracking-[0.25em] uppercase mb-8"
              style={{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {FOUNDERS[0].role}
            </p>

            {/* Social Buttons */}
            <div className="flex items-center gap-3">
              <a
                href={FOUNDERS[0].github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300"
                style={{
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--lime)';
                  e.currentTarget.style.color = 'var(--lime)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <Github size={14} />
                Github
              </a>
              <a
                href={FOUNDERS[0].linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300"
                style={{
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--lime)';
                  e.currentTarget.style.color = 'var(--lime)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <Linkedin size={14} />
                linkedin
              </a>
            </div>
          </motion.div>

          {/* Middle Column - Quotes */}
          <motion.div
            className="hidden lg:flex justify-between items-start w-full py-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
          >
            <p
              className="italic"
              style={{
                fontFamily: 'var(--font-display, "Instrument Serif", serif)',
                fontWeight: 400,
                fontSize: '1.5rem',
                color: 'var(--lime, #d4f53c)',
                letterSpacing: '-0.01em',
                lineHeight: 1.4,
              }}
            >
              "{FOUNDERS[0].quote}"
            </p>

            <p
              className="italic text-right mt-11"
              style={{
                fontFamily: 'var(--font-display, "Instrument Serif", serif)',
                fontWeight: 400,
                fontSize: '1.5rem',
                color: 'var(--lime, #d4f53c)',
                letterSpacing: '-0.01em',
                lineHeight: 1.4,
              }}
            >
              "{FOUNDERS[1].quote}"
            </p>
          </motion.div>

          {/* Right Column - Rudra */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
          >
            {/* Image */}
            <div
              className="w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden mb-8"
              style={{ border: '2px solid var(--border)' }}
            >
              <img
                src={FOUNDERS[1].image}
                alt={FOUNDERS[1].name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name */}
            <h3
              className="text-3xl md:text-4xl mb-2"
              style={{
                fontFamily: 'var(--font-display, "Instrument Serif", serif)',
                fontWeight: 400,
                color: 'var(--heading-color)',
                letterSpacing: '-0.02em',
              }}
            >
              {FOUNDERS[1].name}
            </h3>

            {/* Role */}
            <p
              className="text-xs tracking-[0.25em] uppercase mb-8"
              style={{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {FOUNDERS[1].role}
            </p>

            {/* Social Buttons */}
            <div className="flex items-center gap-3">
              <a
                href={FOUNDERS[1].github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300"
                style={{
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--lime)';
                  e.currentTarget.style.color = 'var(--lime)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <Github size={14} />
                Github
              </a>
              <a
                href={FOUNDERS[1].linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300"
                style={{
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--lime)';
                  e.currentTarget.style.color = 'var(--lime)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <Linkedin size={14} />
                linkedin
              </a>
            </div>
          </motion.div>
        </div>

        {/* Mobile Quotes */}
        <motion.div
          className="lg:hidden flex flex-col items-center gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
        >
          <p
            className="text-center italic"
            style={{
              fontFamily: 'var(--font-display, "Instrument Serif", serif)',
              fontWeight: 400,
              fontSize: '1.25rem',
              color: 'var(--lime, #d4f53c)',
              letterSpacing: '-0.01em',
              lineHeight: 1.4,
            }}
          >
            "{FOUNDERS[0].quote}"
          </p>

          <p
            className="text-center italic"
            style={{
              fontFamily: 'var(--font-display, "Instrument Serif", serif)',
              fontWeight: 400,
              fontSize: '1.25rem',
              color: 'var(--lime, #d4f53c)',
              letterSpacing: '-0.01em',
              lineHeight: 1.4,
            }}
          >
            "{FOUNDERS[1].quote}"
          </p>
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          className="text-center pt-12"
          style={{ borderTop: '1px solid var(--border)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
        >
          <p
            className="text-sm tracking-[0.25em] uppercase"
            style={{
              color: 'var(--text-faint)',
              fontFamily: 'var(--font-body)',
            }}
          >
            2 founders · rating · experience
          </p>
        </motion.div>
      </div>
    </section>
  );
}