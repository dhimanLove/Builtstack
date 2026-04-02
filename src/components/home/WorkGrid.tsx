import { motion } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PROJECTS = [
  { title: 'Vaultly', category: 'SaaS · Web App', year: '2026' },
  { title: 'Forma UI', category: 'Design System', year: '2026' },
  { title: 'Meridian', category: 'Brand Identity', year: '2023' },
  { title: 'Stackwise', category: 'Web App · API', year: '2023' },
  { title: 'Onyx Brand', category: 'Brand · Web', year: '2023' },
];

// ========== PIXELBLAST SHADER (unchanged) ==========
type PixelBlastVariant = 'square' | 'circle' | 'triangle' | 'diamond';

const SHAPE_MAP: Record<PixelBlastVariant, number> = {
  square: 0,
  circle: 1,
  triangle: 2,
  diamond: 3,
};

const VERTEX_SRC = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

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
const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND  = 3;

const int   MAX_CLICKS = 10;
uniform vec2  uClickPos  [MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES     5
#define FBM_LACUNARITY  1.25
#define FBM_GAIN        1.0

float hash11(float n){ return fract(sin(n)*43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < FBM_OCTAVES; ++i){
    sum  += amp * vnoise(p * freq);
    freq *= FBM_LACUNARITY;
    amp  *= FBM_GAIN;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov){
  float r = sqrt(cov) * .25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov){
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d  = p.y - r*(1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d/aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov){
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

void main(){
  float pixelSize = uPixelSize;
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  float aspectRatio = uResolution.x / uResolution.y;

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv, uTime * 0.05);
  base = base * 0.5 - 0.65;

  float feed = base + (uDensity - 0.5) * 0.3;

  float speed     = uRippleSpeed;
  float thickness = uRippleThickness;
  const float dampT     = 1.0;
  const float dampR     = 10.0;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      float cellPixelSizeLocal = 8.0 * pixelSize;
      vec2 cuv = (((pos - uResolution * .5 - cellPixelSizeLocal * .5) / (uResolution))) * vec2(aspectRatio, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(uv, cuv);
      float waveR = speed * t;
      float ring  = exp(-pow((r - waveR) / thickness, 2.0));
      float atten = exp(-dampT * t) * exp(-dampR * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);

  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float coverage = bw * jitterScale;
  float M;
  if      (uShapeType == SHAPE_CIRCLE)   M = maskCircle (pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND)  M = maskDiamond(pixelUV, coverage);
  else                                   M = coverage;

  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
    float fade = smoothstep(0.0, uEdgeFade, edge);
    M *= fade;
  }

  vec3 color = uColor;
  vec3 srgbColor = mix(
    color * 12.92,
    1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, color)
  );
  fragColor = vec4(srgbColor, M);
}
`;

const MAX_CLICKS = 10;

// ========== PARTICLE CARD ==========
const ParticleCard = ({
  children,
  className = '',
  glowColor = '212, 245, 60',
  particleCount = 12,
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = true,
  disableAnimations = false,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  particleCount?: number;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  disableAnimations?: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const ctxRef = useRef<gsap.Context | null>(null);
  const isHoveredRef = useRef(false);

  const createParticle = useCallback((x: number, y: number) => {
    const el = document.createElement('div');
    el.className = 'work-particle';
    el.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: rgba(${glowColor}, 1);
      box-shadow: 0 0 8px rgba(${glowColor}, 0.8);
      pointer-events: none;
      z-index: 100;
      left: ${x}px;
      top: ${y}px;
      will-change: transform, opacity;
    `;
    return el;
  }, [glowColor]);

  const clearParticles = useCallback(() => {
    particlesRef.current.forEach((p) => p.remove());
    particlesRef.current = [];
  }, []);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const el = cardRef.current;
    ctxRef.current = gsap.context(() => {
      let magnetismTween: gsap.core.Tween | null = null;

      const onMouseEnter = () => {
        isHoveredRef.current = true;

        for (let i = 0; i < particleCount; i++) {
          setTimeout(() => {
            if (!isHoveredRef.current || !el) return;

            const rect = el.getBoundingClientRect();
            const particle = createParticle(
              Math.random() * rect.width,
              Math.random() * rect.height
            );
            el.appendChild(particle);
            particlesRef.current.push(particle);

            gsap.fromTo(
              particle,
              { scale: 0, opacity: 0 },
              { scale: 1, opacity: 0.9, duration: 0.4, ease: 'back.out(1.8)' }
            );

            gsap.to(particle, {
              x: (Math.random() - 0.5) * 120,
              y: (Math.random() - 0.5) * 120,
              rotation: Math.random() * 400 - 200,
              duration: 2.5 + Math.random() * 2,
              ease: 'none',
              repeat: -1,
              yoyo: true,
            });

            gsap.to(particle, {
              opacity: 0.3,
              duration: 1.8,
              ease: 'power2.inOut',
              repeat: -1,
              yoyo: true,
            });
          }, i * 80);
        }
      };

      const onMouseLeave = () => {
        isHoveredRef.current = false;
        clearParticles();

        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          x: 0,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        });
      };

      const onMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (enableTilt) {
          const rotateX = ((y - centerY) / centerY) * -8;
          const rotateY = ((x - centerX) / centerX) * 8;
          gsap.to(el, {
            rotateX,
            rotateY,
            duration: 0.15,
            ease: 'power2.out',
            transformPerspective: 1200,
          });
        }

        if (enableMagnetism) {
          const magnetX = (x - centerX) * 0.06;
          const magnetY = (y - centerY) * 0.06;
          magnetismTween?.kill();
          magnetismTween = gsap.to(el, {
            x: magnetX,
            y: magnetY,
            duration: 0.4,
            ease: 'power2.out',
          });
        }
      };

      const onClick = (e: MouseEvent) => {
        if (!clickEffect) return;
        const rect = el.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const maxDist = Math.max(
          Math.hypot(clickX, clickY),
          Math.hypot(clickX - rect.width, clickY),
          Math.hypot(clickX, clickY - rect.height),
          Math.hypot(clickX - rect.width, clickY - rect.height)
        );

        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          width: ${maxDist * 2}px;
          height: ${maxDist * 2}px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(${glowColor}, 0.35) 10%, rgba(${glowColor}, 0.15) 40%, transparent 70%);
          left: ${clickX - maxDist}px;
          top: ${clickY - maxDist}px;
          pointer-events: none;
          z-index: 200;
        `;
        el.appendChild(ripple);

        gsap.fromTo(
          ripple,
          { scale: 0.2, opacity: 0.6 },
          {
            scale: 1.1,
            opacity: 0,
            duration: 0.9,
            ease: 'power2.out',
            onComplete: () => ripple.remove(),
          }
        );
      };

      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
      el.addEventListener('mousemove', onMouseMove);
      el.addEventListener('click', onClick);

      return () => {
        clearParticles();
        magnetismTween?.kill();
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
        el.removeEventListener('mousemove', onMouseMove);
        el.removeEventListener('click', onClick);
      };
    }, cardRef);

    return () => {
      ctxRef.current?.revert();
    };
  }, [disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, particleCount, createParticle, clearParticles]);

  return (
    <div ref={cardRef} className={`${className} relative overflow-hidden`} style={{ position: 'relative' }}>
      {children}
    </div>
  );
};

// ========== WORK CARD WITH PATTERN ==========
function WorkCardWithPattern({
  project,
  index,
  glowColor = '212, 245, 60',
}: {
  project: (typeof PROJECTS)[0];
  index: number;
  glowColor?: string;
}) {
  const isLarge = index === 0 || index === 4;
  const isFull = index === 2;

  const patterns = ['dots', 'grid', 'diagonal', 'zigzag', 'waves'];
  const pattern = patterns[index % patterns.length];
  const getPatternStyle = () => {
    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `url("https://i.pinimg.com/1200x/1a/0f/4a/1a0f4a8592a92eaf93a7c5a09715dd1e.jpg")`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'none',
        };
      case 'grid':
        return {
          backgroundImage: `url("https://i.pinimg.com/736x/d0/01/00/d00100318cf498c6363c202861fd88f9.jpg")`,
          backgroundSize: 'fit-content',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      case 'diagonal':
        return {
          backgroundImage: `url("https://i.pinimg.com/736x/15/97/21/15972177e2c07a646e0f5fa5d7591654.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      case 'zigzag':
        return {
          backgroundImage: `url("https://i.pinimg.com/736x/dc/b0/3f/dcb03ff1e3e051aa49393e0a86a1547b.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      case 'waves':
        return {
          backgroundImage: `url("https://i.pinimg.com/736x/5f/4a/a0/5f4aa0e1047ea8b941971549d3eadd2b.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={`${isFull ? 'col-span-1 md:col-span-2' : isLarge ? 'col-span-1 md:col-span-1' : 'col-span-1'}`}
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, ease: EASE, delay: index * 0.07 }}
    >
      <ParticleCard
        className="group cursor-pointer rounded-2xl"
        glowColor={glowColor}
        particleCount={10}
        enableTilt={true}
        clickEffect={true}
        enableMagnetism={true}
      >
        <div
          className={`relative overflow-hidden rounded-2xl ${isFull ? 'aspect-[2.1/1]' : 'aspect-[4/3]'}`}
          style={{ backgroundColor: '#080808', ...getPatternStyle() }}
        >
          <div
            className="absolute inset-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:rotate-[2deg]"
            style={{ ...getPatternStyle(), opacity: 0.35 }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-8 text-center">
            <h3 className="text-white text-3xl md:text-4xl font-display mb-3 translate-y-6 group-hover:translate-y-0 transition-all duration-500">
              {project.title}
            </h3>
            <p className="text-white/75 text-base tracking-wide translate-y-6 group-hover:translate-y-0 transition-all duration-500 delay-100">
              {project.category}
            </p>
            <div className="mt-4 text-xs uppercase tracking-[2px] text-white/50 translate-y-6 group-hover:translate-y-0 transition-all duration-500 delay-200">
              {project.year}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-lime-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
        </div>

        <div className="flex justify-between items-center mt-5 px-2">
          <span className="text-sm text-muted-foreground">{project.category}</span>
          <span className="text-xs text-muted-foreground tracking-widest">{project.year}</span>
        </div>
      </ParticleCard>
    </motion.div>
  );
}

// ========== PIXELBLAST BACKGROUND ==========
function PixelBlastBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    material: THREE.ShaderMaterial;
    clock: THREE.Clock;
    clickIx: number;
    uniforms: Record<string, THREE.IUniform>;
    raf: number | null;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x080808, 0); // transparent, so HTML background shows
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    const uniforms = {
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#d4f53c') },
      uClickPos: { value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)) },
      uClickTimes: { value: new Float32Array(MAX_CLICKS) },
      uShapeType: { value: SHAPE_MAP.circle },
      uPixelSize: { value: 4.5 },
      uScale: { value: 1.65 },
      uDensity: { value: 0.68 },
      uPixelJitter: { value: 0.12 },
      uEnableRipples: { value: 1 },
      uRippleSpeed: { value: 0.38 },
      uRippleThickness: { value: 0.11 },
      uRippleIntensity: { value: 0.55 },
      uEdgeFade: { value: 0.18 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SRC,
      fragmentShader: FRAGMENT_SRC,
      uniforms,
      transparent: true,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };

    const handleClick = (e: MouseEvent) => {
      if (!renderer.domElement) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (renderer.domElement.width / rect.width);
      const y = renderer.domElement.height - (e.clientY - rect.top) * (renderer.domElement.height / rect.height);

      const ix = threeRef.current?.clickIx ?? 0;
      uniforms.uClickPos.value[ix].set(x, y);
      uniforms.uClickTimes.value[ix] = uniforms.uTime.value;
      if (threeRef.current) threeRef.current.clickIx = (ix + 1) % MAX_CLICKS;
    };

    const animate = () => {
      if (!threeRef.current) return;
      uniforms.uTime.value = clock.getElapsedTime() * 0.32;
      renderer.render(scene, camera);
      threeRef.current.raf = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('click', handleClick);
    animate();

    threeRef.current = { renderer, scene, camera, material, clock, clickIx: 0, uniforms, raf: null };

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      if (threeRef.current?.raf) cancelAnimationFrame(threeRef.current.raf);

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

// ========== MAIN WORKGRID COMPONENT ==========
export default function WorkGrid() {
  return (
    <section id="work" className="relative px-6 md:px-10 py-24 md:py-40 max-w-7xl mx-auto overflow-hidden bg-[#080808]">
      {/* Background Shader */}
      <PixelBlastBackground />

      {/* Content Layer */}
      <div className="relative z-10">
        <motion.div
          className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <div>
            <span className="text-xs uppercase tracking-[3px] text-muted-foreground">Selected work</span>
            <h2 className="font-display text-4xl md:text-6xl mt-3 leading-none">What we've shipped.</h2>
          </div>
          <a href="#" className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center group">
            View all work
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </a>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {PROJECTS.map((project, i) => (
            <WorkCardWithPattern key={project.title} project={project} index={i} glowColor="212, 245, 60" />
          ))}
        </div>
      </div>
    </section>
  );
}