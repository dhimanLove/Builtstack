import Seo from '@/components/Seo';
import AboutSection from '@/components/home/about';
import { PAGE_SEO } from '@/lib/seo';

const meta = PAGE_SEO.about;

export default function AboutPage() {
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={meta.path} />
      <AboutSection />
    </>
  );
}
