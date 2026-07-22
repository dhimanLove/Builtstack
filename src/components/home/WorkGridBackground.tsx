import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

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

export default function PixelBlastBackground() {
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
      uShapeType: { value: 1 },
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
