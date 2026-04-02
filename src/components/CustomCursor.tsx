import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

type CursorState = 'default' | 'hover' | 'click' | 'text';

export default function CustomCursor() {
    const cursorX = useMotionValue(-200);
    const cursorY = useMotionValue(-200);
    const [state, setState] = useState<CursorState>('default');
    const [label, setLabel] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const isTouchDevice = useRef(false);

    // Outer ring - slow, springy
    const ringX = useSpring(cursorX, { damping: 20, stiffness: 180, mass: 0.4 });
    const ringY = useSpring(cursorY, { damping: 20, stiffness: 180, mass: 0.4 });

    // Inner dot - fast, snappy
    const dotX = useSpring(cursorX, { damping: 28, stiffness: 400, mass: 0.2 });
    const dotY = useSpring(cursorY, { damping: 28, stiffness: 400, mass: 0.2 });

    useEffect(() => {
        isTouchDevice.current = window.matchMedia('(pointer: coarse)').matches;
        if (isTouchDevice.current) return;

        const onMove = (e: MouseEvent) => {
            // Offset so center of cursor = mouse point
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const onMouseDown = () => setState('click');
        const onMouseUp   = () => setState(s => s === 'click' ? 'default' : s);

        const onEnter = (e: Event) => {
            const el = e.currentTarget as HTMLElement;
            const tag = el.tagName.toLowerCase();
            const cursorType = el.dataset.cursor;
            const cursorLabel = el.dataset.cursorLabel || '';

            setLabel(cursorLabel);

            if (cursorType === 'view')  return setState('hover');
            if (tag === 'input' || tag === 'textarea') return setState('text');
            setState('hover');
        };

        const onLeave = () => {
            setState('default');
            setLabel('');
        };

        const onLeaveWindow = () => setIsVisible(false);
        const onEnterWindow = () => setIsVisible(true);

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        document.documentElement.addEventListener('mouseleave', onLeaveWindow);
        document.documentElement.addEventListener('mouseenter', onEnterWindow);

        const attach = () => {
            document.querySelectorAll('a, button, input, textarea, [data-cursor]').forEach(el => {
                el.addEventListener('mouseenter', onEnter);
                el.addEventListener('mouseleave', onLeave);
            });
        };

        attach();

        const observer = new MutationObserver(attach);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
            document.documentElement.removeEventListener('mouseenter', onEnterWindow);
            observer.disconnect();
        };
    }, [cursorX, cursorY, isVisible]);

    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    // ── Size / style per state ──────────────────────────────────
    const ringSize = {
        default: 36,
        hover:   64,
        click:   24,
        text:    4,
    }[state];

    const ringOpacity = {
        default: 0.5,
        hover:   0.9,
        click:   0.3,
        text:    0,
    }[state];

    const dotSize = {
        default: 5,
        hover:   5,
        click:   3,
        text:    24,
    }[state];

    const dotBg = {
        default: '#d4f53c',
        hover:   'transparent',
        click:   '#d4f53c',
        text:    '#d4f53c',
    }[state];

    return (
        <>
            {/* ── Outer ring ─────────────────────────────────────── */}
            <motion.div
                className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:flex items-center justify-center"
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 1 : 0,
                }}
                animate={{
                    width:  ringSize,
                    height: ringSize,
                    opacity: isVisible ? ringOpacity : 0,
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
                <motion.div
                    className="w-full h-full rounded-full"
                    animate={{
                        borderColor: state === 'hover' ? '#d4f53c' : 'rgba(238,235,228,0.5)',
                        borderWidth: state === 'hover' ? 1.5 : 1,
                        rotate: state === 'hover' ? 90 : 0,
                    }}
                    style={{
                        border: '1px solid rgba(238,235,228,0.5)',
                        borderRadius: '50%',
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Label inside ring on hover state */}
                <AnimatePresence>
                    {label && state === 'hover' && (
                        <motion.span
                            className="absolute text-[9px] tracking-widest uppercase font-medium"
                            style={{ color: '#d4f53c', letterSpacing: '0.15em' }}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.25 }}
                        >
                            {label}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ── Inner dot ──────────────────────────────────────── */}
            <motion.div
                className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block rounded-full"
                style={{
                    x: dotX,
                    y: dotY,
                    translateX: '-50%',
                    translateY: '-50%',
                    background: dotBg,
                    opacity: isVisible ? 1 : 0,
                }}
                animate={{
                    width:        dotSize,
                    height:       dotSize,
                    borderRadius: state === 'text' ? '2px' : '50%',
                    background:   dotBg,
                    opacity:      isVisible ? 1 : 0,
                }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* ── Click ripple ───────────────────────────────────── */}
            <AnimatePresence>
                {state === 'click' && (
                    <motion.div
                        className="pointer-events-none fixed top-0 left-0 z-[9998] hidden md:block rounded-full"
                        style={{
                            x: dotX,
                            y: dotY,
                            translateX: '-50%',
                            translateY: '-50%',
                            border: '1px solid rgba(212,245,60,0.4)',
                        }}
                        initial={{ width: 8, height: 8, opacity: 0.8 }}
                        animate={{ width: 80, height: 80, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                )}
            </AnimatePresence>
        </>
    );
}