import { lazy, Suspense } from 'react';
import Seo from '@/components/Seo';
import ContactForm from '@/components/ContactForm';
import { PAGE_SEO } from '@/lib/seo';

const InteractiveMeshGrid = lazy(() => import('@/components/ui/InteractiveMeshGrid'));

const meta = PAGE_SEO.contact;

export default function ContactPage() {
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={meta.path} />
      <main
        className="relative min-h-screen pt-32 pb-24 px-6 md:px-10 overflow-hidden"
        style={{ background: 'var(--section-bg, hsl(var(--bg)))' }}
      >
        {/* Highly Optimized Interactive Canvas Background Mesh */}
        <Suspense fallback={<div className="absolute inset-0 z-0 bg-[var(--section-bg)]" />}>
          <InteractiveMeshGrid className="absolute inset-0 z-0 pointer-events-none opacity-[0.85]" />
        </Suspense>

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Start a project
          </p>
          <h1 className="font-display italic text-4xl md:text-6xl text-foreground mb-6" style={{ color: 'var(--heading-color)' }}>
            Let&apos;s build something
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-12 max-w-xl" style={{ color: 'var(--body-color)' }}>
            Tell us about your product, timeline, and budget. We typically reply within one
            business day.
          </p>
          <ContactForm />
        </div>
      </main>
    </>
  );
}
