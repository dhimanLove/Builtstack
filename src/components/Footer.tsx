import { motion } from 'framer-motion';

const LINKS: Record<string, string[]> = {
  Pages: ['Work', 'Services', 'About', 'Contact'],
  Services: ['Product Design', 'Web Development', 'SaaS Engineering', 'Brand Identity'],
  Connect: ['Twitter', 'LinkedIn', 'GitHub', 'Dribbble'],
};

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Footer() {
  return (
    <footer className="border-t border-bs-border bg-background px-6 md:px-10 py-16 md:py-24">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE as unknown as number[] }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="font-display italic text-2xl text-foreground">
              BuiltStack
            </span>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Design and engineering studio for founders who ship. Based globally, working remotely.
            </p>
          </div>

          {/* Nav columns */}
          {Object.entries(LINKS).map(([col, items]) => (
            <div key={col}>
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
                {col}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative group inline-block"
                    >
                      {item}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-bs-border flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BuiltStack. All rights reserved.
          </span>
          <span className="text-xs text-muted-foreground">
            Designed & built by BuiltStack.
          </span>
        </div>
      </motion.div>
    </footer>
  );
}
