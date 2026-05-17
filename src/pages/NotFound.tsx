import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Seo from '@/components/Seo';
import { PAGE_SEO } from '@/lib/seo';

const meta = PAGE_SEO.notFound;

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={meta.path} />
      <main
        className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
        style={{ background: '#080808' }}
      >
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">404</p>
        <h1 className="font-display italic text-5xl md:text-7xl text-foreground mb-6">
          Page not found
        </h1>
        <p className="text-muted-foreground max-w-md mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 text-xs uppercase tracking-widest font-medium transition-opacity hover:opacity-90"
          style={{ background: '#d4f53c', color: '#000' }}
        >
          Back to home
        </Link>
      </main>
    </>
  );
};

export default NotFound;
