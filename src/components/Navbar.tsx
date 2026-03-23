import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const NAV_LINKS = ['Work', 'Services', 'About', 'Contact'];
const EASE = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 40));
    return unsub;
  }, [scrollY]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const bgOpacity     = useTransform(scrollY, [0, 80], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const navPaddingY   = useTransform(scrollY, [0, 80], [22, 14]);

  return (
      <>
        <motion.nav
            style={{ paddingTop: navPaddingY, paddingBottom: navPaddingY }}
            className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 flex items-center justify-between"
        >
          {/* Glass blur background */}
          <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ opacity: bgOpacity }}
          >
            {/* blur: 48px  |  saturate: 220%  |  bg: 0.60 opacity so blur shows through */}
            <div
                className="absolute inset-0"
                style={{
                  background: 'rgba(8, 8, 8, 0.60)',
                  backdropFilter: 'blur(80px) saturate(220%) brightness(1)',
                  WebkitBackdropFilter: 'blur(80px) saturate(220%) brightness(0.95)',
                }}
            />

            {/* Glass rim highlight */}
            <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(212,245,60,0.12) 30%, rgba(238,235,228,0.08) 60%, transparent 100%)',
                }}
            />

            {/* Grain: opacity 0.07  |  baseFrequency 0.72 (coarser)  |  numOctaves 3  |  tile 180px */}
            <div
                className="absolute inset-0"
                style={{
                  opacity: 0.09,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundSize: '200px 200px',
                }}
            />
          </motion.div>

          {/* Bottom border */}
          <motion.div
              className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
              style={{
                opacity: borderOpacity,
                background: 'linear-gradient(90deg, transparent 0%, #1e1e1e 20%, #1e1e1e 80%, transparent 100%)',
              }}
          />

          {/* Logo */}
          <motion.a
              href="/"
              className="relative z-10 flex items-center gap-2 group"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE as unknown as number[] }}
          >
            <motion.span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: '#d4f53c' }}
                animate={{ scale: scrolled ? 1 : [1, 1.4, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="font-display italic text-xl tracking-tight leading-none" style={{ color: '#eeebe4' }}>
            Built<span style={{ color: '#d4f53c' }}>Stack</span>
          </span>
          </motion.a>

          {/* Desktop nav */}
          <motion.div
              className="hidden md:flex items-center gap-1 relative z-10"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE as unknown as number[] }}
          >
            {NAV_LINKS.map((link, i) => (
                <motion.a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="relative px-4 py-2 text-xs tracking-widest uppercase group"
                    style={{ color: '#5a5a56' }}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: EASE as unknown as number[] }}
                    whileHover={{ color: '#eeebe4' } as never}
                >
                  {link}
                  <span
                      className="absolute bottom-0 left-4 right-4 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400"
                      style={{ background: '#d4f53c', transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
                  />
                </motion.a>
            ))}

            <motion.a
                href="#contact"
                className="relative ml-4 overflow-hidden group"
                style={{
                  padding: '12px 22px',
                  border: '1px solid #1e1e1e',
                  color: '#eeebe4',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6, ease: EASE as unknown as number[] }}
                whileHover={{ borderColor: '#d4f53c' } as never}
            >
              <motion.span
                  className="absolute inset-0 origin-left"
                  style={{ background: '#d4f53c', scaleX: 0 }}
                  whileHover={{ scaleX: 1 } as never}
                  transition={{ duration: 0.45, ease: EASE as unknown as number[] }}
              />
              <motion.span
                  className="relative z-10 flex items-center gap-2"
                  whileHover={{ color: '#000' } as never}
                  transition={{ duration: 0.2 }}
              >
                Start a project
                <motion.span whileHover={{ x: 3 } as never} transition={{ duration: 0.3 }}>→</motion.span>
              </motion.span>
            </motion.a>
          </motion.div>

          {/* Hamburger */}
          <motion.button
              className="relative z-10 flex flex-col gap-[5px] md:hidden w-6 cursor-pointer p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
          >
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="block h-px w-full origin-center"
                    style={{ background: '#eeebe4' }}
                    animate={
                      menuOpen
                          ? i === 0 ? { rotate: 45, y: 6, width: '100%' }
                              : i === 1 ? { opacity: 0, scaleX: 0 }
                                  : { rotate: -45, y: -6, width: '100%' }
                          : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }
                    }
                    transition={{ duration: 0.35, ease: EASE as unknown as number[] }}
                />
            ))}
          </motion.button>
        </motion.nav>

        {/* Mobile fullscreen menu */}
        <AnimatePresence>
          {menuOpen && (
              <motion.div
                  className="fixed inset-0 z-40 flex flex-col md:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
              >
                {/* blur: 56px  |  bg: 0.82 opacity (less black = grain more visible) */}
                <div
                    className="absolute inset-0"
                    style={{
                      background: 'rgba(8, 8, 8, 0.82)',
                      backdropFilter: 'blur(56px) saturate(200%) brightness(0.92)',
                      WebkitBackdropFilter: 'blur(56px) saturate(200%) brightness(0.92)',
                    }}
                />

                {/* Accent glow */}
                <div
                    className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at 0% 0%, rgba(212,245,60,0.08) 0%, transparent 70%)',
                    }}
                />

                {/* Grain: opacity 0.09  |  baseFrequency 0.68 (coarser)  |  tile 200px */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      opacity: 0.09,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                      backgroundSize: '200px 200px',
                    }}
                />

                {/* Links */}
                <div className="relative z-10 flex flex-col justify-center flex-1 px-8">
                  {NAV_LINKS.map((link, i) => (
                      <motion.a
                          key={link}
                          href={`#${link.toLowerCase()}`}
                          className="flex items-center justify-between py-6 border-b group"
                          style={{ borderColor: '#1e1e1e' }}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: 0.05 + i * 0.08, duration: 0.55, ease: EASE as unknown as number[] }}
                          onClick={() => setMenuOpen(false)}
                      >
                        <div className="flex items-baseline gap-5">
                          <span className="text-xs font-mono" style={{ color: '#2e2e2c' }}>0{i + 1}</span>
                          <span
                              className="font-display italic text-5xl leading-none transition-colors duration-300 group-hover:text-[#d4f53c]"
                              style={{ color: '#eeebe4' }}
                          >
                      {link}
                    </span>
                        </div>
                        <motion.span
                            className="text-2xl"
                            style={{ color: '#2e2e2c' }}
                            animate={{ x: 0 }}
                            whileHover={{ x: 4 }}
                        >
                          →
                        </motion.span>
                      </motion.a>
                  ))}

                  <motion.a
                      href="#contact"
                      className="mt-10 text-center py-4 tracking-widest uppercase"
                      style={{ background: '#d4f53c', color: '#000', fontSize: '11px', letterSpacing: '0.25em' }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.4, duration: 0.55, ease: EASE as unknown as number[] }}
                      onClick={() => setMenuOpen(false)}
                  >
                    Start a project →
                  </motion.a>
                </div>

                <motion.div
                    className="relative z-10 px-8 py-8 flex justify-between items-center border-t"
                    style={{ borderColor: '#1e1e1e' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                >
              <span className="text-xs tracking-widest uppercase" style={{ color: '#2e2e2c' }}>
                Design & Engineering Studio
              </span>
                  <span className="text-xs" style={{ color: '#2e2e2c' }}>© 2026</span>
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>
      </>
  );
}