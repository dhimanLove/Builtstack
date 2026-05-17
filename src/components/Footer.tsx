import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PAGE_LINKS = [
  { label: 'Work', href: '/#work' },
  { label: 'Services', href: '/#services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const SERVICE_LINKS = ['Product Design', 'Web Development', 'SaaS Engineering', 'Brand Identity'];

const SOCIAL_LINKS = [
  { label: 'Twitter', href: 'https://twitter.com/BuiltStack' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/builtstack' },
  { label: 'GitHub', href: 'https://github.com/builtstack' },
];

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
          <div className="lg:col-span-1">
            <span className="font-display italic text-2xl text-foreground">
              BuiltStack
            </span>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Design and engineering studio for founders who ship. Based globally, working remotely.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Pages</h4>
            <ul className="space-y-3">
              {PAGE_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative group inline-block"
                  >
                    {label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Services</h4>
            <ul className="space-y-3">
              {SERVICE_LINKS.map((item) => (
                <li key={item}>
                  <Link
                    to="/#services"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative group inline-block"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Connect</h4>
            <ul className="space-y-3">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative group inline-block"
                  >
                    {label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-bs-border flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BuiltStack. All rights reserved.
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
