import { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  wrapperClassName?: string;
  priority?: boolean;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  wrapperClassName = '',
  priority = false,
  aspectRatio,
  objectFit = 'cover',
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(priority);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fullSrc = src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;

  const aspectRatioStyle = aspectRatio
    ? { aspectRatio }
    : width && height
      ? { aspectRatio: `${width}/${height}` }
      : {};

  useEffect(() => {
    if (priority) return;
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden ${wrapperClassName}`}
      style={{
        ...aspectRatioStyle,
        width: width ? undefined : '100%',
        background: 'var(--surface, #111)',
      }}
    >
      {(priority || inView) && (
        <img
          src={fullSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={`transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={{
            width: '100%',
            height: aspectRatio || (width && height) ? '100%' : 'auto',
            objectFit,
            position: aspectRatio || (width && height) ? 'absolute' : 'relative',
            inset: 0,
          }}
        />
      )}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background: 'var(--surface, #111)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
