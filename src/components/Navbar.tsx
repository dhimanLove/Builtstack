import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import gsap from 'gsap';

const NAV_LINKS = ['Work', 'Services', 'About', 'Contact'];
const EASE = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const navbarRef = useRef<HTMLElement>(null);

    // Refs for pill animation (nav links)
    const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const tlRefs = useRef<(gsap.core.Timeline | null)[]>([]);
    const activeTweenRefs = useRef<(gsap.core.Tween | null)[]>([]);
    const navItemRefs = useRef<(HTMLElement | null)[]>([]);

    // Refs for the CTA button pill animation
    const ctaCircleRef = useRef<HTMLSpanElement | null>(null);
    const ctaTlRef = useRef<gsap.core.Timeline | null>(null);
    const ctaActiveTweenRef = useRef<gsap.core.Tween | null>(null);
    const ctaItemRef = useRef<HTMLDivElement | null>(null);

    // Remove default body margin once on mount
    useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
    }, []);

    // Scroll state
    useEffect(() => {
        const unsub = scrollY.on('change', (v) => setScrolled(v > 40));
        return unsub;
    }, [scrollY]);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    // Smooth scroll with offset
    const scrollToSection = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        const navbarHeight = navbarRef.current?.offsetHeight || 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navbarHeight;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    };

    const handleNavClick = (e, link) => {
        e.preventDefault();

        if (link === "About") {
            navigate("/about");   // 👉 NEW PAGE
        } else {
            scrollToSection(link.toLowerCase()); // 👉 OLD SCROLL
        }

        setMenuOpen(false);
    };

    // Handle hash on load
    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (hash && NAV_LINKS.map(l => l.toLowerCase()).includes(hash)) {
            setTimeout(() => scrollToSection(hash), 100);
        }
    }, []);

    // ---------- PILL ANIMATION SETUP (for nav links) ----------
    const setupPillAnimations = () => {
        circleRefs.current.forEach((circle, i) => {
            const pill = navItemRefs.current[i];
            if (!circle || !pill) return;

            const rect = pill.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            const R = ((w * w) / 4 + h * h) / (2 * h);
            const D = Math.ceil(2 * R) + 2;
            const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
            const originY = D - delta;

            circle.style.width = `${D}px`;
            circle.style.height = `${D}px`;
            circle.style.bottom = `-${delta}px`;

            gsap.set(circle, {
                xPercent: -50,
                scale: 0,
                transformOrigin: `50% ${originY}px`
            });

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

    // ---------- CTA BUTTON PILL ANIMATION SETUP ----------
    const setupCtaAnimation = () => {
        const pill = ctaItemRef.current;
        const circle = ctaCircleRef.current;
        if (!pill || !circle) return;

        const rect = pill.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
            xPercent: -50,
            scale: 0,
            transformOrigin: `50% ${originY}px`
        });

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

    // Re-run setups on mount and resize
    useEffect(() => {
        setupPillAnimations();
        setupCtaAnimation();
        window.addEventListener('resize', () => {
            setupPillAnimations();
            setupCtaAnimation();
        });
        return () => window.removeEventListener('resize', () => { });
    }, []);

    const handlePillEnter = (i: number) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        if (activeTweenRefs.current[i]) activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
            duration: 0.3,
            ease: 'power3.easeOut',
            overwrite: 'auto'
        });
    };

    const handlePillLeave = (i: number) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        if (activeTweenRefs.current[i]) activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(0, {
            duration: 0.2,
            ease: 'power3.easeOut',
            overwrite: 'auto'
        });
    };

    const handleCtaEnter = () => {
        const tl = ctaTlRef.current;
        if (!tl) return;
        if (ctaActiveTweenRef.current) ctaActiveTweenRef.current.kill();
        ctaActiveTweenRef.current = tl.tweenTo(tl.duration(), {
            duration: 0.3,
            ease: 'power3.easeOut',
            overwrite: 'auto'
        });
    };

    const handleCtaLeave = () => {
        const tl = ctaTlRef.current;
        if (!tl) return;
        if (ctaActiveTweenRef.current) ctaActiveTweenRef.current.kill();
        ctaActiveTweenRef.current = tl.tweenTo(0, {
            duration: 0.2,
            ease: 'power3.easeOut',
            overwrite: 'auto'
        });
    };

    const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
    const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);
    const navPaddingY = useTransform(scrollY, [0, 80], [22, 14]);

    return (
        <>
            <motion.nav
                ref={navbarRef}
                style={{ paddingTop: navPaddingY, paddingBottom: navPaddingY }}
                className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 flex items-center justify-between"
            >
                {/* Glass blur background (unchanged) */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ opacity: bgOpacity }}
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'rgba(8, 8, 8, 0.60)',
                            backdropFilter: 'blur(80px) saturate(220%) brightness(1)',
                            WebkitBackdropFilter: 'blur(80px) saturate(220%) brightness(0.95)',
                        }}
                    />
                    <div
                        className="absolute inset-x-0 top-0 h-px"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(212,245,60,0.12) 30%, rgba(238,235,228,0.08) 60%, transparent 100%)',
                        }}
                    />
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
                    <span className="font-display italic text-2xl tracking-tight leading-none" style={{ color: '#eeebe4' }}>
                        Built<span style={{ color: '#d4f53c' }}>Stack</span>
                    </span>
                </motion.a>

                {/* Desktop navigation with PILL ANIMATION for both links and CTA */}
                <motion.div
                    className="hidden md:flex items-center relative z-10"
                    style={{ gap: '0.25rem' }}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: EASE as unknown as number[] }}
                >
                    {NAV_LINKS.map((link, i) => (
                        <div
                            key={link}
                            ref={el => { navItemRefs.current[i] = el; }}
                            className="relative overflow-hidden rounded-full cursor-pointer"
                            style={{
                                padding: '8px 18px',
                                background: '#1a1a1a',
                                color: '#9e9e9a',
                                fontSize: '12px',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                fontWeight: 500,
                            }}
                            onMouseEnter={() => handlePillEnter(i)}
                            onMouseLeave={() => handlePillLeave(i)}
                            onClick={(e) => handleNavClick(e as React.MouseEvent<HTMLDivElement>, link)}
                        >
                            <span
                                className="absolute left-1/2 bottom-0 rounded-full pointer-events-none"
                                style={{ background: '#d4f53c', willChange: 'transform' }}
                                ref={el => { circleRefs.current[i] = el; }}
                            />
                            <span className="label-stack relative inline-block leading-none z-[2]">
                                <span className="pill-label relative inline-block leading-none" style={{ willChange: 'transform' }}>
                                    {link}
                                </span>
                                <span
                                    className="pill-label-hover absolute left-0 top-0 inline-block"
                                    style={{ color: '#000', willChange: 'transform, opacity' }}
                                    aria-hidden="true"
                                >
                                    {link}
                                </span>
                            </span>
                        </div>
                    ))}

                    {/* CTA Button with Pill Animation */}
                    <div
                        ref={ctaItemRef}
                        className="relative overflow-hidden rounded-full cursor-pointer ml-4"
                        style={{
                            padding: '8px 20px',
                            background: '#d4f53c', // base background (lime)
                            color: '#000',
                            fontSize: '11px',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            fontWeight: 500,
                            border: '1px solid rgba(0,0,0,0.1)',
                        }}
                        onMouseEnter={handleCtaEnter}
                        onMouseLeave={handleCtaLeave}
                        onClick={(e) => handleNavClick(e as React.MouseEvent<HTMLDivElement>, 'Contact')}
                    >
                        <span
                            className="absolute left-1/2 bottom-0 rounded-full pointer-events-none"
                            style={{ background: '#000', willChange: 'transform' }}
                            ref={ctaCircleRef}
                        />
                        <span className="label-stack relative inline-block leading-none z-[2]">
                            <span className="pill-label relative inline-block leading-none" style={{ willChange: 'transform' }}>
                                Start a project
                            </span>
                            <span
                                className="pill-label-hover absolute left-0 top-0 inline-block whitespace-nowrap"
                                style={{ color: '#d4f53c', willChange: 'transform, opacity' }}
                                aria-hidden="true"
                            >
                                Start a project
                            </span>
                        </span>
                    </div>
                </motion.div>

                {/* Hamburger button */}
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

            {/* Mobile menu (unchanged) */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 flex flex-col md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'rgba(8, 8, 8, 0.82)',
                                backdropFilter: 'blur(56px) saturate(200%) brightness(0.92)',
                                WebkitBackdropFilter: 'blur(56px) saturate(200%) brightness(0.92)',
                            }}
                        />
                        <div
                            className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
                            style={{
                                background: 'radial-gradient(ellipse at 0% 0%, rgba(211, 245, 60, 0.35) 0%, transparent 70%)',
                            }}
                        />
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                opacity: 0.09,
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                                backgroundSize: '200px 200px',
                            }}
                        />
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
                                    onClick={(e) => handleNavClick(e as React.MouseEvent<HTMLAnchorElement>, link)}
                                >
                                    <div className="flex items-baseline gap-5">
                                        <span className="text-xs font-mono" style={{ color: '#2e2e2c' }}>0{i + 1}</span>
                                        <span className="font-display italic text-5xl leading-none transition-colors duration-300 group-hover:text-[#d4f53c]" style={{ color: '#eeebe4' }}>
                                            {link}
                                        </span>
                                    </div>
                                    <motion.span className="text-2xl" style={{ color: '#2e2e2c' }} animate={{ x: 0 }} whileHover={{ x: 4 }}>→</motion.span>
                                </motion.a>
                            ))}
                            <motion.a
                                href="#contact"
                                className="mt-10 text-center py-4 tracking-widest uppercase"
                                style={{ background: '#8aa900', color: '#000', fontSize: '11px', letterSpacing: '0.25em' }}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.4, duration: 0.55, ease: EASE as unknown as number[] }}
                                onClick={(e) => handleNavClick(e as React.MouseEvent<HTMLAnchorElement>, 'Contact')}
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
                            <span className="text-xs tracking-widest uppercase" style={{ color: '#2e2e2c' }}>Design & Engineering Studio</span>
                            <span className="text-xs" style={{ color: '#2e2e2c' }}>© 2026</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}