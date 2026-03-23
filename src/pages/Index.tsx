import Hero from '@/components/home/Hero';
import Marquee from '@/components/home/Marquee';
import Services from '@/components/home/Services';
import WorkGrid from '@/components/home/WorkGrid';
import Philosophy from '@/components/home/Philosophy';
import HorizontalScroll from '@/components/home/HorizontalScroll';
import CTA from '@/components/home/CTA';

const Index = () => {
  return (
    <>
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
