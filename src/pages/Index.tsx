import Seo from '@/components/Seo';
import Hero from '@/components/home/Hero';
import Marquee from '@/components/home/Marquee';
import Services from '@/components/home/Services';
import WorkGrid from '@/components/home/WorkGrid';
import Philosophy from '@/components/home/Philosophy';
import HorizontalScroll from '@/components/home/HorizontalScroll';
import CTA from '@/components/home/CTA';
import { PAGE_SEO } from '@/lib/seo';

const meta = PAGE_SEO.home;

const Index = () => {
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={meta.path} />
      <Hero />
      <Marquee />
      <Services />
      <WorkGrid />
      <Philosophy />
      <HorizontalScroll />
      <CTA />
    </>
  );
};

export default Index;
