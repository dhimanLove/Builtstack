import { Helmet } from 'react-helmet-async';
import {
  canonicalUrl,
  DEFAULT_OG_IMAGE,
  ORGANIZATION_SCHEMA,
  SITE_URL,
} from '@/lib/seo';

type SeoProps = {
  title: string;
  description: string;
  path?: string;
};

export default function Seo({ title, description, path = '/' }: SeoProps) {
  const canonical = canonicalUrl(path);
  const ogUrl = path === '/' ? SITE_URL : `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@BuiltStack" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />

      <script type="application/ld+json">
        {JSON.stringify(ORGANIZATION_SCHEMA)}
      </script>
    </Helmet>
  );
}
