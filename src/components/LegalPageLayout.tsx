import { Link } from 'react-router-dom';

type LegalPageLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export default function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <main
      className="min-h-screen pt-32 pb-24 px-6 md:px-10"
      style={{ background: '#080808' }}
    >
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-12 inline-block"
        >
          ← Back to home
        </Link>
        <h1 className="font-display italic text-4xl md:text-5xl text-foreground mb-4">{title}</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: May 17, 2026</p>
        <div className="prose prose-invert prose-sm max-w-none text-muted-foreground space-y-6 [&_h2]:text-foreground [&_h2]:font-display [&_h2]:italic [&_h2]:text-xl [&_h2]:mt-10 [&_h2]:mb-3 [&_a]:text-[#d4f53c] [&_a]:underline">
          {children}
        </div>
      </div>
    </main>
  );
}
