'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from "react-router-dom";
import gsap from 'gsap';

const NAV_LINKS = ['Work', 'Services', 'About', 'Contact'];
const EASE = [0.16, 1, 0.3, 1] as const;

function useTheme() {
    const [theme, setTheme] = useState<'dark' | 'light'>(() =>
        typeof window !== 'undefined'
            ? (localStorage.getItem('theme') as 'dark' | 'light') || 'dark'
            : 'dark'
    );
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);
    return { theme, toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark') };
}

function ThemeToggle({ theme, toggle }: { theme: string; toggle: () => void }) {
    const isLight = theme === 'light';
    const trackBg = isLight ? 'var(--nav-pill-bg, #e8e2d8)' : 'var(--nav-pill-bg, #1a1a1a)';
    const trackBorder = isLight ? 'rgba(0,0,0,0.12)' : 'var(--nav-border, #2a2a2a)';
    const sunStroke = isLight ? '#a08c00' : 'var(--text-faint, #3a3a3a)';
    const moonStroke = isLight ? 'var(--text-muted, #b0a898)' : 'var(--lime, #d4f53c)';
    const thumbShadow = isLight
        ? '0 1px 4px rgba(0,0,0,0.18)'
        : '0 0 8px var(--glow-lime, rgba(212,245,60,0.45)), 0 1px 3px rgba(0,0,0,0.5)';

    return (
        <motion.button
            onClick={toggle}
            aria-label="Toggle theme"
            className="relative shrink-0 overflow-hidden rounded-full"
            style={{ width: 52, height: 28, border: `1px solid ${trackBorder}`, background: trackBg, cursor: 'pointer', padding: 0, transition: 'background 0.4s ease, border-color 0.4s ease' }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.2 }}
        >
            <div className="absolute inset-0 flex items-center justify-between px-[7px] pointer-events-none">
                <motion.svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={sunStroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" animate={{ opacity: isLight ? 1 : 0.3 }} transition={{ duration: 0.35 }}>
                    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </motion.svg>
                <motion.svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={moonStroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" animate={{ opacity: isLight ? 0.3 : 1 }} transition={{ duration: 0.35 }}>
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </motion.svg>
            </div>
            <motion.div
                className="absolute top-[3px] w-5 h-5 rounded-full"
                style={{ background: 'var(--lime, #d4f53c)', boxShadow: thumbShadow }}
                animate={{ left: isLight ? 27 : 3 }}
                transition={{ type: 'spring', stiffness: 500, damping: 34 }}
            />
        </motion.button>
    );
}

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { scrollY } = useScroll();
    const navbarRef = useRef<HTMLElement>(null);
    const { theme, toggle } = useTheme();

    const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const tlRefs = useRef<(gsap.core.Timeline | null)[]>([]);
    const activeTweenRefs = useRef<(gsap.core.Tween | null)[]>([]);
    const navItemRefs = useRef<(HTMLElement | null)[]>([]);
    const ctaCircleRef = useRef<HTMLSpanElement | null>(null);
    const ctaTlRef = useRef<gsap.core.Timeline | null>(null);
    const ctaActiveTweenRef = useRef<gsap.core.Tween | null>(null);
    const ctaItemRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
    }, []);

    useEffect(() => {
        const unsub = scrollY.on('change', (v) => setScrolled(v > 40));
        return unsub;
    }, [scrollY]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const scrollToSection = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        const navbarHeight = navbarRef.current?.offsetHeight || 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: elementPosition - navbarHeight, behavior: 'smooth' });
    };

    const handleNavClick = (e: React.MouseEvent, link: string) => {
        e.preventDefault();
        if (link === "About") navigate("/about");
        else if (link === "Contact") navigate("/contact");
        else if (location.pathname !== "/") navigate(`/#${link.toLowerCase()}`);
        else scrollToSection(link.toLowerCase());
        setMenuOpen(false);
    };

    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (hash && NAV_LINKS.map(l => l.toLowerCase()).includes(hash))
            setTimeout(() => scrollToSection(hash), 100);
    }, []);

    const setupPillAnimations = () => {
        circleRefs.current.forEach((circle, i) => {
            const pill = navItemRefs.current[i];
            if (!circle || !pill) return;
            const { width: w, height: h } = pill.getBoundingClientRect();
            const R = ((w * w) / 4 + h * h) / (2 * h);
            const D = Math.ceil(2 * R) + 2;
            const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
            circle.style.width = `${D}px`;
            circle.style.height = `${D}px`;
            circle.style.bottom = `-${delta}px`;
            gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${D - delta}px` });
            const label = pill.querySelector<HTMLElement>('.pill-label');
            const hoverLabel = pill.querySelector<HTMLElement>('.pill-label-hover');
            if (label) gsap.set(label, { y: 0 });
            if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });
            if (tlRefs.current[i]) tlRefs.current[i]?.kill();
            const tl = gsap.timeline({ paused: true });
            tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: 'power3.easeOut' }, 0);
            if (label) tl.to(label, { y: -(h + 8), duration: 2, ease: 'power3.easeOut' }, 0);
            if (hoverLabel) {
                gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 });
                tl.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease: 'power3.easeOut' }, 0);
            }
            tlRefs.current[i] = tl;
        });
    };

    const setupCtaAnimation = () => {
        const pill = ctaItemRef.current;
        const circle = ctaCircleRef.current;
        if (!pill || !circle) return;
        const { width: w, height: h } = pill.getBoundingClientRect();
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;
        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${D - delta}px` });
        const label = pill.querySelector<HTMLElement>('.pill-label');
        const hoverLabel = pill.querySelector<HTMLElement>('.pill-label-hover');
        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });
        if (ctaTlRef.current) ctaTlRef.current.kill();
        const tl = gsap.timeline({ paused: true });
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: 'power3.easeOut' }, 0);
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease: 'power3.easeOut' }, 0);
        if (hoverLabel) {
            gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 });
            tl.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease: 'power3.easeOut' }, 0);
        }
        ctaTlRef.current = tl;
    };

    useEffect(() => {
        setupPillAnimations();
        setupCtaAnimation();
        const onResize = () => { setupPillAnimations(); setupCtaAnimation(); };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const handlePillEnter = (i: number) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease: 'power3.easeOut', overwrite: 'auto' });
    };
    const handlePillLeave = (i: number) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease: 'power3.easeOut', overwrite: 'auto' });
    };
    const handleCtaEnter = () => {
        const tl = ctaTlRef.current;
        if (!tl) return;
        ctaActiveTweenRef.current?.kill();
        ctaActiveTweenRef.current = tl.tweenTo(tl.duration(), { duration: 0.3, ease: 'power3.easeOut', overwrite: 'auto' });
    };
    const handleCtaLeave = () => {
        const tl = ctaTlRef.current;
        if (!tl) return;
        ctaActiveTweenRef.current?.kill();
        ctaActiveTweenRef.current = tl.tweenTo(0, { duration: 0.2, ease: 'power3.easeOut', overwrite: 'auto' });
    };

    const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
    const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);
    const navPaddingY = useTransform(scrollY, [0, 80], [22, 14]);

    const navBackdrop = theme === 'light'
        ? 'var(--nav-backdrop, rgba(237, 232, 223, 0.72))'
        : 'var(--nav-backdrop, rgba(8, 8, 8, 0.60))';
    const navBackdropMobile = theme === 'light'
        ? 'var(--nav-backdrop-mobile, rgba(237, 232, 223, 0.96))'
        : 'var(--nav-backdrop-mobile, rgba(10, 10, 10, 0.92))';
    const navBorderGradient = theme === 'light'
        ? 'linear-gradient(90deg, transparent 0%, var(--nav-border, #d4cdc2) 20%, var(--nav-border, #d4cdc2) 80%, transparent 100%)'
        : 'linear-gradient(90deg, transparent 0%, var(--nav-border, #1e1e1e) 20%, var(--nav-border, #1e1e1e) 80%, transparent 100%)';
    const topBorderGlow = theme === 'light'
        ? 'linear-gradient(90deg, transparent 0%, rgba(74, 106, 0, 0.12) 30%, rgba(26, 23, 20, 0.08) 60%, transparent 100%)'
        : 'linear-gradient(90deg, transparent 0%, rgba(212,245,60,0.12) 30%, rgba(238,235,228,0.08) 60%, transparent 100%)';

    return (
        <>
            <motion.nav
                ref={navbarRef}
                style={{ paddingTop: navPaddingY, paddingBottom: navPaddingY }}
                className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 flex items-center justify-between"
            >
                <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: bgOpacity }}>
                    <div className="absolute inset-0" style={{ background: navBackdrop, backdropFilter: 'blur(80px) saturate(220%) brightness(1)', WebkitBackdropFilter: 'blur(80px) saturate(220%) brightness(0.95)' }} />
                    <div className="absolute inset-x-0 top-0 h-px" style={{ background: topBorderGlow }} />
                    <div className="absolute inset-0" style={{ opacity: 0.09, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />
                </motion.div>

                <motion.div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none" style={{ opacity: borderOpacity, background: navBorderGradient }} />

                <motion.a href="/" className="relative z-10 flex items-center gap-2 group"
                    initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE as unknown as number[] }}
                >
                    <motion.span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: 'var(--lime, #d4f53c)' }}
                        animate={{ scale: scrolled ? 1 : [1, 1.4, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <span className="font-display italic text-2xl tracking-tight leading-none" style={{ color: 'var(--logo-text, hsl(var(--text-primary)))' }}>
                        Built<span style={{ color: 'var(--lime, #d4f53c)' }}>Stack</span>
                    </span>
                </motion.a>

                <motion.div className="hidden md:flex items-center relative z-10" style={{ gap: '0.25rem' }}
                    initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: EASE as unknown as number[] }}
                >
                    {NAV_LINKS.map((link, i) => (
                        <div key={link}
                            ref={el => { navItemRefs.current[i] = el; }}
                            className="relative overflow-hidden rounded-full cursor-pointer"
                            style={{ padding: '8px 18px', background: 'var(--nav-pill-bg, hsl(var(--surface)))', color: 'var(--nav-pill-text, hsl(var(--text-muted)))', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500 }}
                            onMouseEnter={() => handlePillEnter(i)}
                            onMouseLeave={() => handlePillLeave(i)}
                            onClick={(e) => handleNavClick(e as React.MouseEvent<HTMLDivElement>, link)}
                        >
                            <span className="absolute left-1/2 bottom-0 rounded-full pointer-events-none" style={{ background: 'var(--lime, #d4f53c)', willChange: 'transform' }} ref={el => { circleRefs.current[i] = el; }} />
                            <span className="label-stack relative inline-block leading-none z-[2]">
                                <span className="pill-label relative inline-block leading-none" style={{ willChange: 'transform' }}>{link}</span>
                                <span className="pill-label-hover absolute left-0 top-0 inline-block" style={{ color: 'var(--on-lime, #000)', willChange: 'transform, opacity' }} aria-hidden="true">{link}</span>
                            </span>
                        </div>
                    ))}
                    <div style={{ margin: '0 6px' }}>
                        <ThemeToggle theme={theme} toggle={toggle} />
                    </div>
                    <div ref={ctaItemRef}
                        className="relative overflow-hidden rounded-full cursor-pointer"
                        style={{ padding: '8px 20px', background: 'var(--lime, #d4f53c)', color: 'var(--on-lime, #000)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, border: '1px solid rgba(0,0,0,0.1)' }}
                        onMouseEnter={handleCtaEnter}
                        onMouseLeave={handleCtaLeave}
                        onClick={(e) => handleNavClick(e as React.MouseEvent<HTMLDivElement>, 'Contact')}
                    >
                        <span className="absolute left-1/2 bottom-0 rounded-full pointer-events-none" style={{ background: 'var(--on-lime, #000)', willChange: 'transform' }} ref={ctaCircleRef} />
                        <span className="label-stack relative inline-block leading-none z-[2]">
                            <span className="pill-label relative inline-block leading-none" style={{ willChange: 'transform' }}>Start a project</span>
                            <span className="pill-label-hover absolute left-0 top-0 inline-block whitespace-nowrap" style={{ color: 'var(--on-lime-hover, var(--lime, #d4f53c))', willChange: 'transform, opacity' }} aria-hidden="true">Start a project</span>
                        </span>
                    </div>
                </motion.div>

                <div className="flex items-center gap-3 md:hidden relative z-10">
                    <ThemeToggle theme={theme} toggle={toggle} />
                    <motion.button
                        className="flex flex-col gap-[5px] w-6 cursor-pointer p-1"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                className="block h-px w-full origin-center"
                                style={{ background: 'var(--hamburger, hsl(var(--text-primary)))' }}
                                animate={
                                    menuOpen
                                        ? i === 0 ? { rotate: 45, y: 6 } : i === 1 ? { opacity: 0, scaleX: 0 } : { rotate: -45, y: -6 }
                                        : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }
                                }
                                transition={{ duration: 0.35, ease: EASE as unknown as number[] }}
                            />
                        ))}
                    </motion.button>
                </div>
            </motion.nav>

            {/* ── Mobile Menu Overlay ── */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 flex flex-col md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                            background: navBackdropMobile,
                            backdropFilter: 'blur(64px) saturate(200%)',
                            WebkitBackdropFilter: 'blur(64px) saturate(200%)',
                        }} />

                        {/* ── Lime radial glow — top-right corner only, properly blurred ── */}
                        <div className="absolute pointer-events-none" style={{
                            top: -80,
                            right: -80,
                            width: 320,
                            height: 320,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(212,245,60,0.18) 0%, transparent 70%)',
                            filter: 'blur(24px)',
                        }} />

                        {/* Grain */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                            opacity: 0.055,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                            backgroundSize: '200px 200px',
                        }} />

                        {/* Menu Content */}
                        <div className="relative z-10 flex flex-col justify-center flex-1 px-8">
                            {NAV_LINKS.map((link, i) => (
                                <motion.a
                                    key={link}
                                    href={`#${link.toLowerCase()}`}
                                    className="flex items-center justify-between py-5 border-b group"
                                    style={{ borderColor: 'var(--nav-border, rgba(255,255,255,0.07))' }}
                                    initial={{ opacity: 0, x: -24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -16 }}
                                    transition={{ delay: 0.04 + i * 0.07, duration: 0.5, ease: EASE as unknown as number[] }}
                                    onClick={(e) => handleNavClick(e as React.MouseEvent<HTMLAnchorElement>, link)}
                                >
                                    <div className="flex items-baseline gap-5">
                                        <span className="text-[10px] font-mono tabular-nums" style={{ color: 'var(--text-faint, rgba(255,255,255,0.25))' }}>0{i + 1}</span>
                                        <span
                                            className="font-display italic leading-none transition-colors duration-300 group-hover:text-[var(--lime)]"
                                            style={{ fontSize: 'clamp(2.6rem, 11vw, 3.2rem)', color: 'var(--logo-text, hsl(var(--text-primary)))' }}
                                        >
                                            {link}
                                        </span>
                                    </div>
                                    <motion.span
                                        className="text-xl opacity-30 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ color: 'var(--lime, #d4f53c)' }}
                                        initial={{ x: 0 }}
                                        whileHover={{ x: 4 }}
                                    >
                                        →
                                    </motion.span>
                                </motion.a>
                            ))}

                            {/* CTA */}
                            <motion.a
                                href="#contact"
                                className="mt-8 text-center py-[14px] tracking-[0.22em] uppercase rounded-full"
                                style={{ background: 'var(--lime, #d4f53c)', color: 'var(--on-lime, #000)', fontSize: '11px', fontWeight: 600 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.38, duration: 0.5, ease: EASE as unknown as number[] }}
                                onClick={(e) => handleNavClick(e as React.MouseEvent<HTMLAnchorElement>, 'Contact')}
                            >
                                Start a project →
                            </motion.a>
                        </div>

                        {/* Footer */}
                        <motion.div
                            className="relative z-10 px-8 py-7 flex justify-between items-center border-t"
                            style={{ borderColor: 'var(--nav-border, rgba(255,255,255,0.07))' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.42, duration: 0.5 }}
                        >
                            <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'var(--text-faint, rgba(255,255,255,0.25))' }}>Design & Engineering Studio</span>
                            <span className="text-[10px]" style={{ color: 'var(--text-faint, rgba(255,255,255,0.25))' }}>© 2026</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}