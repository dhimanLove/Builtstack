export const SITE_URL = 'https://builtstack.co';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BuiltStack',
  url: SITE_URL,
  logo: `${SITE_URL}/builtstack.png`,
  description:
    'BuiltStack is a design and engineering studio. We build web apps, mobile apps, SaaS platforms, and brand systems for founders, startups, and businesses.',
  sameAs: [
    'https://twitter.com/BuiltStack',
    'https://www.linkedin.com/company/builtstack',
    'https://github.com/builtstack',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: 'hello@builtstack.co',
    availableLanguage: 'English',
  },
} as const;

export type PageSeoKey = 'home' | 'about' | 'contact' | 'privacy' | 'terms' | 'notFound';

export const PAGE_SEO: Record<
  PageSeoKey,
  { title: string; description: string; path: string }
> = {
  home: {
    title: 'BuiltStack - Design & Engineering Studio',
    description:
      'BuiltStack is a design and engineering studio. We build web apps, mobile apps, SaaS platforms, and brand systems for founders, startups, and businesses.',
    path: '/',
  },
  about: {
    title: 'About - BuiltStack',
    description:
      'BuiltStack is a small design and engineering studio. We work directly with founders - no account managers, no juniors - just senior craft.',
    path: '/about',
  },
  contact: {
    title: 'Contact - BuiltStack',
    description:
      'Start a project with BuiltStack. Tell us about your product, timeline, and budget - we reply within one business day.',
    path: '/contact',
  },
  privacy: {
    title: 'Privacy Policy - BuiltStack',
    description:
      'How BuiltStack collects, uses, and protects personal data when you visit our website or contact us about a project.',
    path: '/privacy',
  },
  terms: {
    title: 'Terms of Service - BuiltStack',
    description:
      'Terms governing use of the BuiltStack website and engagement with our design and engineering services.',
    path: '/terms',
  },
  notFound: {
    title: 'Page Not Found - BuiltStack',
    description: 'The page you requested does not exist on builtstack.co.',
    path: '/404',
  },
};

export function canonicalUrl(path: string): string {
  if (path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path}`;
}
