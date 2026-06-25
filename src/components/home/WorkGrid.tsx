'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

//    CONSTANTS & TYPES                                     ─

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const PROJECTS = [
  {
    title: "Admin Panel",
    image: "/projects/pannel.png",
    category: "Dashboard UI",
    year: "2026",
    url: "https://adminn-silk.vercel.app", 
  },
  {
    title: "Neeraj Dental",
    image: "/projects/neerajdental.png",
    category: "Healthcare SaaS",
    year: "2026",
    url: "https://neeraj-dental-clnc.vercel.app", 
  },
  {
    title: "Grog",
    image: "/projects/grog.png",
    category: "Product",
    year: "2026", 
    url: "https://grog-brown.vercel.app/",   
  },
  
];
const MAX_CLICKS = 10;

const VERTEX_SRC = `void main() { gl_Position = vec4(position, 1.0); }`;

const FRAGMENT_SRC = `
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int   uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;
uniform int   uShapeType;

const int MAX_CLICKS = 10;
uniform vec2  uClickPos  [MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a){a=floor(a);return fract(a.x/2.+a.y*a.y*.75);}
#define Bayer4(a) (Bayer2(.5*(a))*.25+Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*.25+Bayer2(a))

float hash11(float n){return fract(sin(n)*43758.5453);}
float vnoise(vec3 p){
  vec3 ip=floor(p),fp=fract(p);
  float n000=hash11(dot(ip+vec3(0,0,0),vec3(1,57,113)));
  float n100=hash11(dot(ip+vec3(1,0,0),vec3(1,57,113)));
  float n010=hash11(dot(ip+vec3(0,1,0),vec3(1,57,113)));
  float n110=hash11(dot(ip+vec3(1,1,0),vec3(1,57,113)));
  float n001=hash11(dot(ip+vec3(0,0,1),vec3(1,57,113)));
  float n101=hash11(dot(ip+vec3(1,0,1),vec3(1,57,113)));
  float n011=hash11(dot(ip+vec3(0,1,1),vec3(1,57,113)));
  float n111=hash11(dot(ip+vec3(1,1,1),vec3(1,57,113)));
  vec3 w=fp*fp*fp*(fp*(fp*6.-15.)+10.);
  return mix(mix(mix(n000,n100,w.x),mix(n010,n110,w.x),w.y),
             mix(mix(n001,n101,w.x),mix(n011,n111,w.x),w.y),w.z)*2.-1.;
}
float fbm2(vec2 uv,float t){
  vec3 p=vec3(uv*uScale,t);float amp=1.,freq=1.,sum=1.;
  for(int i=0;i<5;++i){sum+=amp*vnoise(p*freq);freq*=1.25;amp*=1.;}
  return sum*.5+.5;
}

float maskCircle(vec2 p,float cov){float r=sqrt(cov)*.25;float d=length(p-.5)-r;float aa=.5*fwidth(d);return cov*(1.-smoothstep(-aa,aa,d*2.));}
float maskDiamond(vec2 p,float cov){float r=sqrt(cov)*.564;return step(abs(p.x-.49)+abs(p.y-.49),r);}

void main(){
  vec2 fragCoord=gl_FragCoord.xy-uResolution*.5;
  float ar=uResolution.x/uResolution.y;
  vec2 pixelId=floor(fragCoord/uPixelSize);
  vec2 pixelUV=fract(fragCoord/uPixelSize);
  float cps=8.*uPixelSize;
  vec2 cellId=floor(fragCoord/cps);
  vec2 uv=cellId*cps/uResolution*vec2(ar,1.);
  float base=fbm2(uv,uTime*.05)*.5-.65;
  float feed=base+(uDensity-.5)*.3;

  if(uEnableRipples==1){
    for(int i=0;i<MAX_CLICKS;++i){
      vec2 pos=uClickPos[i];if(pos.x<0.)continue;
      float cpsL=8.*uPixelSize;
      vec2 cuv=((pos-uResolution*.5-cpsL*.5)/uResolution)*vec2(ar,1.);
      float t=max(uTime-uClickTimes[i],0.);float r=distance(uv,cuv);
      float ring=exp(-pow((r-uRippleSpeed*t)/uRippleThickness,2.));
      float atten=exp(-1.*t)*exp(-10.*r);
      feed=max(feed,ring*atten*uRippleIntensity);
    }
  }

  float bayer=Bayer8(fragCoord/uPixelSize)-.5;
  float bw=step(.5,feed+bayer);
  float h=fract(sin(dot(floor(fragCoord/uPixelSize),vec2(127.1,311.7)))*43758.5453);
  float coverage=bw*(1.+(h-.5)*uPixelJitter);

  float M;
  if(uShapeType==1) M=maskCircle(pixelUV,coverage);
  else if(uShapeType==3) M=maskDiamond(pixelUV,coverage);
  else M=coverage;

  if(uEdgeFade>0.){
    vec2 norm=gl_FragCoord.xy/uResolution;
    float edge=min(min(norm.x,norm.y),min(1.-norm.x,1.-norm.y));
    M*=smoothstep(0.,uEdgeFade,edge);
  }

  vec3 c=uColor;
  vec3 srgb=mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(0.0031308,c));
  fragColor=vec4(srgb,M*.45);
}
`;

//    THEME UTILS                                         ─

function parseHslToRgb(hslStr: string): [number, number, number] {
  const match = hslStr.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
  if (!match) return [212, 245, 60];
  const [, h, s, l] = match.map(Number);
  const sDec = s / 100, lDec = l / 100;
  const c = (1 - Math.abs(2 * lDec - 1)) * sDec;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = lDec - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else[r, g, b] = [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function getThemeColor(cssVar: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || fallback;
}

//    PARTICLE CARD                                         

const ParticleCard = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const isHoveredRef = useRef(false);
  const glowRgb = '212, 245, 60'; // lime — static for OLED theme

  const clearParticles = useCallback(() => {
    particlesRef.current.forEach(p => p.remove());
    particlesRef.current = [];
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let magnetTween: gsap.core.Tween | null = null;

    const onEnter = () => {
      isHoveredRef.current = true;
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          if (!isHoveredRef.current || !el) return;
          const rect = el.getBoundingClientRect();
          const p = document.createElement('div');
          p.style.cssText = `
            position:absolute;width:3px;height:3px;border-radius:50%;pointer-events:none;z-index:50;
            background:rgba(${glowRgb},1);box-shadow:0 0 6px rgba(${glowRgb},.9);
            left:${Math.random() * rect.width}px;top:${Math.random() * rect.height}px;
            will-change:transform,opacity;
          `;
          el.appendChild(p);
          particlesRef.current.push(p);
          gsap.fromTo(p, { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.85, duration: 0.35, ease: 'back.out(2)' });
          gsap.to(p, { x: (Math.random() - .5) * 100, y: (Math.random() - .5) * 100, rotation: Math.random() * 360, duration: 3 + Math.random() * 2, ease: 'none', repeat: -1, yoyo: true });
          gsap.to(p, { opacity: 0.25, duration: 1.6, ease: 'power2.inOut', repeat: -1, yoyo: true });
        }, i * 70);
      }
    };

    const onLeave = () => {
      isHoveredRef.current = false;
      clearParticles();
      gsap.to(el, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.width / 2, cy = rect.height / 2;
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      gsap.to(el, { rotateX: ((y - cy) / cy) * -7, rotateY: ((x - cx) / cx) * 7, duration: 0.15, ease: 'power2.out', transformPerspective: 1200 });
      magnetTween?.kill();
      magnetTween = gsap.to(el, { x: (x - cx) * 0.05, y: (y - cy) * 0.05, duration: 0.4, ease: 'power2.out' });
    };

    const onClick = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      const maxD = Math.max(Math.hypot(cx, cy), Math.hypot(cx - rect.width, cy), Math.hypot(cx, cy - rect.height), Math.hypot(cx - rect.width, cy - rect.height));
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;z-index:200;
        width:${maxD * 2}px;height:${maxD * 2}px;
        left:${cx - maxD}px;top:${cy - maxD}px;
        background:radial-gradient(circle,rgba(${glowRgb},.3) 10%,rgba(${glowRgb},.1) 45%,transparent 70%);
      `;
      el.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0.15, opacity: 0.7 }, { scale: 1.1, opacity: 0, duration: 0.85, ease: 'power2.out', onComplete: () => ripple.remove() });
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('click', onClick);

    return () => {
      clearParticles();
      magnetTween?.kill();
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('click', onClick);
    };
  }, [clearParticles]);

  return (
    <div ref={cardRef} className={`${className} relative overflow-hidden`}>
      {children}
    </div>
  );
};

//    WORK CARD                                           ─
//    WORK CARD                                           ─
function WorkCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const isFull = project.title === "Admin Panel";

  return (
    <motion.div
      className={isFull ? 'col-span-1 md:col-span-2' : 'col-span-1'}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE, delay: index * 0.08 }}
    >
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <ParticleCard className="group cursor-pointer rounded-2xl">
          {/* Image container */}
          <div
            className={`relative overflow-hidden rounded-2xl ${isFull ? 'aspect-[2.2/1]' : 'aspect-[4/3]'}`}
            style={{ backgroundColor: '#0d0d0d' }}
          >
            {/* Project image — fills the card, shows on hover via scale */}
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ willChange: 'transform' }}
            />

            {/* Persistent dark vignette so text is always legible */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.35) 45%, rgba(5,5,5,0.05) 100%)',
              }}
            />

            {/* Hover overlay — slightly deeper so details pop */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(to top, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.55) 55%, rgba(5,5,5,0.1) 100%)',
              }}
            />

            {/* Project name always-visible at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
              <h3
                className="font-display leading-tight mb-1 transition-all duration-500"
                style={{
                  fontFamily: 'var(--font-display, "Instrument Serif", serif)',
                  fontSize: isFull ? 'clamp(1.5rem, 3vw, 2.5rem)' : 'clamp(1.25rem, 2.5vw, 2rem)',
                  color: '#f0ece4',
                  textShadow: '0 2px 20px rgba(0,0,0,0.8)',
                }}
              >
                {project.title}
              </h3>
              <p
                className="text-sm tracking-wide transition-all duration-500 translate-y-1 group-hover:translate-y-0"
                style={{ color: '#a0a0a0' }}
              >
                {project.category}
              </p>
            </div>

            {/* Year tag — top right */}
            <div
              className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full text-[11px] tracking-[2px] uppercase"
              style={{
                background: 'rgba(5,5,5,0.7)',
                border: '1px solid rgba(212,245,60,0.18)',
                color: '#d4f53c',
                backdropFilter: 'blur(8px)',
              }}
            >
              {project.year}
            </div>

            {/* Lime accent line — slides in on hover */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[1.5px] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"
              style={{ background: 'linear-gradient(90deg, transparent, #d4f53c, transparent)' }}
            />

            {/* Corner glow on hover */}
            <div
              className="absolute bottom-0 left-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at bottom left, rgba(212,245,60,0.12) 0%, transparent 65%)',
              }}
            />
          </div>
        </ParticleCard>
      </a>
    </motion.div>
  );
}

//    PIXEL BLAST BACKGROUND                                 ──

function PixelBlastBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    uniforms: Record<string, THREE.IUniform>;
    clock: THREE.Clock;
    clickIx: number;
    raf: number | null;
  } | null>(null);

  const getShaderColor = useCallback((): THREE.Color => {
    const v = getThemeColor('--lime', '#d4f53c');
    if (v.startsWith('#')) return new THREE.Color(v);
    if (v.startsWith('hsl')) { const [r, g, b] = parseHslToRgb(v); return new THREE.Color(r / 255, g / 255, b / 255); }
    return new THREE.Color('#d4f53c');
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    Object.assign(renderer.domElement.style, { position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', pointerEvents: 'none' });
    container.appendChild(renderer.domElement);

    const uniforms: Record<string, THREE.IUniform> = {
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uTime: { value: 0 },
      uColor: { value: getShaderColor() },
      uClickPos: { value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)) },
      uClickTimes: { value: new Float32Array(MAX_CLICKS) },
      uShapeType: { value: 1 },   // circle
      uPixelSize: { value: 4.0 },
      uScale: { value: 1.5 },
      uDensity: { value: 0.62 },
      uPixelJitter: { value: 0.1 },
      uEnableRipples: { value: 1 },
      uRippleSpeed: { value: 0.36 },
      uRippleThickness: { value: 0.1 },
      uRippleIntensity: { value: 0.5 },
      uEdgeFade: { value: 0.14 },
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({ vertexShader: VERTEX_SRC, fragmentShader: FRAGMENT_SRC, uniforms, transparent: true });
    scene.add(new THREE.Mesh(geo, mat));

    const clock = new THREE.Clock();
    let clickIx = 0;
    let raf: number | null = null;

    const handleResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (renderer.domElement.width / rect.width);
      const y = renderer.domElement.height - (e.clientY - rect.top) * (renderer.domElement.height / rect.height);
      uniforms.uClickPos.value[clickIx].set(x, y);
      uniforms.uClickTimes.value[clickIx] = uniforms.uTime.value;
      clickIx = (clickIx + 1) % MAX_CLICKS;
    };

    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime() * 0.3;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // make parent section clickable for ripples
    container.parentElement?.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    const colorObserver = new MutationObserver(() => { uniforms.uColor.value = getShaderColor(); });
    colorObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    threeRef.current = { renderer, uniforms, clock, clickIx, raf };

    return () => {
      colorObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      container.parentElement?.removeEventListener('click', handleClick);
      if (raf) cancelAnimationFrame(raf);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [getShaderColor]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

//    MAIN EXPORT   ─

export default function WorkGrid() {
  return (
    <section
      id="work"
      className="relative px-6 md:px-10 py-24 md:py-40 max-w-7xl mx-auto overflow-hidden"
      style={{
        backgroundColor: 'transparent',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Subtle radial glow in top-center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[40vw] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse, rgba(212,245,60,0.04) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">

        {/* Section header */}
        <motion.div
          className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <div>
            <span
              className="text-[11px] uppercase tracking-[3.5px]"
              style={{ color: '#d4f53c', opacity: 0.7 }}
            >
              Selected work
            </span>
            <h2
              className="mt-3 leading-none"
              style={{
                fontFamily: 'var(--font-display, "Instrument Serif", serif)',
                fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
                color: '#f0ece4',
                letterSpacing: '-0.02em',
              }}
            >
              What we&apos;ve shipped.
            </h2>
          </div>

          <a
            href="#"
            className="flex items-center gap-2 text-sm transition-colors duration-300 group"
            style={{ color: '#4a4a4a' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f0ece4')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4a4a4a')}
          >
            View all work
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {PROJECTS.map((project, i) => (
            <WorkCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {/* Bottom rule */}
        <motion.div
          className="mt-20 flex items-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #1a1a1a, transparent)' }} />
          <span className="text-[11px] uppercase tracking-[3px]" style={{ color: '#2a2a2a' }}>
            {PROJECTS.length} projects
          </span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(270deg, #1a1a1a, transparent)' }} />
        </motion.div>

      </div>
    </section>
  );
}