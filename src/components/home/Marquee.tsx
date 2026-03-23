import { useRef } from 'react';
import {
    motion,
    useScroll,
    useVelocity,
    useTransform,
    useSpring,
    useAnimationFrame,
    useMotionValue,
} from 'framer-motion';

const ITEMS = [
    'Web Applications',
    'SaaS Platforms',
    'Brand Identity',
    'Mobile Apps',
    'Design Systems',
    'API Development',
    'UI/UX Design',
    'TypeScript',
    'Next.js',
    'Performance',
];

// Repeat enough times so the strip is always wider than the viewport
const REPEATED = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

function VelocityRow({ baseVelocity = -4 }: { baseVelocity?: number }) {
    const x            = useMotionValue(0);
    const { scrollY }  = useScroll();
    const scrollVel    = useVelocity(scrollY);
    const smoothVel    = useSpring(scrollVel, { damping: 50, stiffness: 400 });
    const velFactor    = useTransform(smoothVel, [-3000, 0, 3000], [-4, 0, 4], { clamp: false });
    const direction    = useRef(baseVelocity < 0 ? -1 : 1);
    const xPx          = useMotionValue(0); // absolute px counter

    useAnimationFrame((_, delta) => {
        const vel = velFactor.get();
        if (vel < 0) direction.current = -1;
        if (vel > 0) direction.current  = 1;

        // base movement per frame (px) + velocity boost
        const move = baseVelocity * (delta / 1000) * 60 + direction.current * Math.abs(baseVelocity) * vel;
        xPx.set(xPx.get() + move);

        // Get item strip width from DOM — fallback to 4000px
        const stripEl = document.getElementById(`marquee-inner-${baseVelocity}`);
        const halfW   = stripEl ? stripEl.scrollWidth / 2 : 4000;

        // Wrap: once we've moved a full half-strip, reset to 0
        if (xPx.get() <= -halfW) xPx.set(xPx.get() + halfW);
        if (xPx.get() >= 0)      xPx.set(xPx.get() - halfW);

        x.set(xPx.get());
    });

    return (
        <div className="flex overflow-hidden" style={{ height: 88 }}>
            <motion.div
                id={`marquee-inner-${baseVelocity}`}
                className="flex shrink-0 items-center"
                style={{ x, willChange: 'transform' }}
            >
                {REPEATED.map((item, i) => (
                    <span key={i} className="flex items-center shrink-0">
            <span
                className="whitespace-nowrap font-light"
                style={{
                    fontSize:      'clamp(1.3rem, 2.2vw, 2rem)',
                    color:         '#5a5a56',
                    paddingLeft:   '2.5rem',
                    paddingRight:  '2.5rem',
                    letterSpacing: '-0.01em',
                }}
            >
              {item}
            </span>
            <span
                className="rounded-full shrink-0"
                style={{ width: 6, height: 6, background: '#d4f53c' }}
            />
          </span>
                ))}
            </motion.div>
        </div>
    );
}

export default function Marquee() {
    return (
        <section
            className="overflow-hidden"
            style={{
                borderTop:    '1px solid #1e1e1e',
                borderBottom: '1px solid #1e1e1e',
            }}
        >
            <div style={{ borderBottom: '1px solid #1e1e1e' }}>
                <VelocityRow baseVelocity={-5} />
            </div>
            <VelocityRow baseVelocity={5} />
        </section>
    );
}