'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';


// TYPES & PHYSICS INTERFACES

interface GridPoint {
  x0: number; // Resting base X
  y0: number; // Resting base Y
  x: number;  // Current interactive X
  y: number;  // Current interactive Y
  vx: number; // Velocity X
  vy: number; // Velocity Y
  ambientOffset: number; // Offset for organic wave phase
}

interface InteractiveMeshGridProps {
  className?: string;
  style?: React.CSSProperties;
}


// HEX TO RGB UTILITY

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

export default function InteractiveMeshGrid({ className, style }: InteractiveMeshGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  // Mutable values kept in refs to avoid React rendering overhead
  const pointsRef = useRef<GridPoint[]>([]);
  const gridSizeRef = useRef({ cols: 0, rows: 0, spacing: 56 });
  const isPlayingRef = useRef(false);
  const frameRef = useRef<number>(0);

  // Interactive coordinates and events
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const rippleRef = useRef({
    x: 0,
    y: 0,
    radius: 0,
    maxRadius: 400,
    strength: 0,
    active: false,
  });


  // UNIFIED LIFECYCLE & PHYSICS LOOP EFFECT

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── 1. The Physics and Drawing Frame Tick ──
    const tick = (time: number) => {
      if (!isPlayingRef.current || reducedMotion) {
        frameRef.current = 0;
        return;
      }

      const { cols, rows } = gridSizeRef.current;
      const points = pointsRef.current;
      if (points.length === 0) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      // Read theme colors dynamically from index.css tokens
      const computed = getComputedStyle(document.documentElement);
      const limeHex = computed.getPropertyValue('--lime').trim() || '#d4f53c';
      const rgb = hexToRgb(limeHex) || { r: 212, g: 245, b: 60 };
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      const baseLineColor = isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)';
      const mouse = mouseRef.current;
      const ripple = rippleRef.current;

      // Clear previous canvas drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Physics Dynamics calculation
      const speed = time * 0.8;
      const stiffness = 0.07;
      const damping = 0.82;
      const hoverRadius = 220;

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const idx = j * cols + i;
          const p = points[idx];
          if (!p) continue;

          // Ambient fluid wave (organic float)
          const waveX = Math.sin(speed * 0.0016 + i * 0.4 + p.ambientOffset) * 4.5;
          const waveY = Math.cos(speed * 0.0014 + j * 0.4 + p.ambientOffset) * 4.5;

          let targetX = p.x0 + waveX;
          let targetY = p.y0 + waveY;

          // Mouse push displacement
          if (mouse.active) {
            const dx = p.x0 - mouse.x;
            const dy = p.y0 - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < hoverRadius) {
              const force = Math.pow(1 - dist / hoverRadius, 2) * 32;
              const angle = Math.atan2(dy, dx);
              targetX += Math.cos(angle) * force;
              targetY += Math.sin(angle) * force;
            }
          }

          // Click ripple wave displacement
          if (ripple.active) {
            const dx = p.x0 - ripple.x;
            const dy = p.y0 - ripple.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const diff = Math.abs(dist - ripple.radius);
            const waveWidth = 80;
            if (diff < waveWidth) {
              const force = Math.pow(1 - diff / waveWidth, 2) * ripple.strength;
              const angle = Math.atan2(dy, dx);
              targetX += Math.cos(angle) * force;
              targetY += Math.sin(angle) * force;
            }
          }

          // Spring physics integration
          const ax = (targetX - p.x) * stiffness;
          const ay = (targetY - p.y) * stiffness;

          p.vx = (p.vx + ax) * damping;
          p.vy = (p.vy + ay) * damping;

          p.x += p.vx;
          p.y += p.vy;
        }
      }

      // Update click ripple state
      if (ripple.active) {
        ripple.radius += 8;
        ripple.strength *= 0.96;
        if (ripple.radius > ripple.maxRadius || ripple.strength < 0.5) {
          ripple.active = false;
        }
      }

      // Draw Base Mesh Grid (Single-stroke composite path for hardware optimization)
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = baseLineColor;

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const p = points[j * cols + i];
          if (!p) continue;
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const p = points[j * cols + i];
          if (!p) continue;
          if (j === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();

      // Draw Glowing Mouse Accent Highlight Layer
      if (mouse.active) {
        ctx.beginPath();
        ctx.lineWidth = 1.25;

        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, hoverRadius);
        grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`);
        grad.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;

        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const p = points[j * cols + i];
            if (!p) continue;
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
        }

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const p = points[j * cols + i];
            if (!p) continue;
            if (j === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();

        // Draw Glowing Micro Nodes (dots) on intersection points
        for (let k = 0; k < points.length; k++) {
          const p = points[k];
          if (!p) continue;
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < hoverRadius) {
            const opacity = Math.pow(1 - dist / hoverRadius, 1.5) * 0.7;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.8 * opacity, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            ctx.fill();
          }
        }
      }

      // Draw Click Ripple Overlay Ring
      if (ripple.active) {
        ctx.beginPath();
        ctx.lineWidth = 1.75;

        const rippleGrad = ctx.createRadialGradient(
          ripple.x, ripple.y, Math.max(0, ripple.radius - 40),
          ripple.x, ripple.y, ripple.radius + 40
        );
        const intensity = (ripple.strength / 50) * 0.35;
        rippleGrad.addColorStop(0, 'transparent');
        rippleGrad.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${intensity})`);
        rippleGrad.addColorStop(1, 'transparent');
        ctx.strokeStyle = rippleGrad;

        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const p = points[j * cols + i];
            if (!p) continue;
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
        }
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const p = points[j * cols + i];
            if (!p) continue;
            if (j === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    // ── 2. Resize and Grid Generation Logic ──
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // Spacing optimization: fewer nodes on mobile viewports
      const spacing = rect.width < 768 ? 72 : 56;
      const cols = Math.ceil(rect.width / spacing) + 2;
      const rows = Math.ceil(rect.height / spacing) + 2;

      const newPoints: GridPoint[] = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x0 = i * spacing - spacing;
          const y0 = j * spacing - spacing;
          newPoints.push({
            x0,
            y0,
            x: x0,
            y: y0,
            vx: 0,
            vy: 0,
            ambientOffset: Math.random() * Math.PI * 2,
          });
        }
      }

      pointsRef.current = newPoints;
      gridSizeRef.current = { cols, rows, spacing };

      // Render flat baseline grid if motion is disabled or loading
      if (reducedMotion) {
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.beginPath();
        ctx.lineWidth = 1;
        const computedColors = getComputedStyle(document.documentElement);
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
        ctx.strokeStyle = isLightMode ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)';

        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const p = newPoints[j * cols + i];
            if (!p) continue;
            if (i === 0) ctx.moveTo(p.x0, p.y0);
            else ctx.lineTo(p.x0, p.y0);
          }
        }
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const p = newPoints[j * cols + i];
            if (!p) continue;
            if (j === 0) ctx.moveTo(p.x0, p.y0);
            else ctx.lineTo(p.x0, p.y0);
          }
        }
        ctx.stroke();
      }
    };

    resize();

    // ── 3. Observers Registration ──
    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Viewport Intersector: Pauses calculations when element scrolls away
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isPlayingRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !reducedMotion) {
          if (!frameRef.current) {
            frameRef.current = requestAnimationFrame(tick);
          }
        } else {
          if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = 0;
          }
        }
      },
      { threshold: 0.02 } // Triggers if 2% of element is in view
    );
    intersectionObserver.observe(canvas);

    // ── 4. Interaction Events Registration ──
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (!touch) return;
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = touch.clientX - rect.left;
        mouseRef.current.y = touch.clientY - rect.top;
        mouseRef.current.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxRadius = Math.max(rect.width, rect.height) * 0.85;

      rippleRef.current = {
        x,
        y,
        radius: 0,
        maxRadius,
        strength: 45, // Distort intensity
        active: true,
      };
    };

    // ── 4. Interaction Events Registration ──
    const parent = canvas.parentElement;
    if (!reducedMotion && parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
      parent.addEventListener('touchstart', handleTouchMove, { passive: true });
      parent.addEventListener('touchmove', handleTouchMove, { passive: true });
      parent.addEventListener('touchend', handleTouchEnd);
      parent.addEventListener('click', handleClick);
    }

    // ── 5. Cleanup on Unmount ──
    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (!reducedMotion && parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
        parent.removeEventListener('touchstart', handleTouchMove);
        parent.removeEventListener('touchmove', handleTouchMove);
        parent.removeEventListener('touchend', handleTouchEnd);
        parent.removeEventListener('click', handleClick);
      }
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  );
}
