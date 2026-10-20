import React, { useEffect, useRef } from 'react';
import { LiveWallpaperConfig, LiveWallpaperColorScheme } from '../../types';

interface LiveWallpaperCanvasProps {
  config?: LiveWallpaperConfig;
  brightness?: number;
  blur?: number;
}

// Color palettes for live wallpapers
const PALETTES: Record<LiveWallpaperColorScheme, { primary: string; secondary: string; accent: string; glow: string; rgb: [number, number, number][] }> = {
  cyan: {
    primary: '#06b6d4',
    secondary: '#3b82f6',
    accent: '#38bdf8',
    glow: 'rgba(6, 182, 212, 0.35)',
    rgb: [[6, 182, 212], [59, 130, 246], [56, 189, 248]],
  },
  cyber: {
    primary: '#ec4899',
    secondary: '#06b6d4',
    accent: '#a855f7',
    glow: 'rgba(236, 72, 153, 0.35)',
    rgb: [[236, 72, 153], [6, 182, 212], [168, 85, 247]],
  },
  violet: {
    primary: '#8b5cf6',
    secondary: '#6366f1',
    accent: '#d946ef',
    glow: 'rgba(139, 92, 246, 0.35)',
    rgb: [[139, 92, 246], [99, 102, 241], [217, 70, 239]],
  },
  emerald: {
    primary: '#10b981',
    secondary: '#059669',
    accent: '#34d399',
    glow: 'rgba(16, 185, 129, 0.35)',
    rgb: [[16, 185, 129], [5, 150, 105], [52, 211, 153]],
  },
  fire: {
    primary: '#f59e0b',
    secondary: '#f97316',
    accent: '#ef4444',
    glow: 'rgba(245, 158, 11, 0.35)',
    rgb: [[245, 158, 11], [249, 115, 22], [239, 68, 68]],
  },
  monochrome: {
    primary: '#f8fafc',
    secondary: '#94a3b8',
    accent: '#cbd5e1',
    glow: 'rgba(248, 250, 252, 0.25)',
    rgb: [[248, 250, 252], [148, 163, 184], [203, 213, 225]],
  },
};

export const LiveWallpaperCanvas: React.FC<LiveWallpaperCanvasProps> = ({
  config = {
    type: 'aurora',
    speed: 1,
    interactive: true,
    colorScheme: 'cyan',
  },
  brightness = 100,
  blur = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  const { type, speed = 1, interactive = true, colorScheme = 'cyan' } = config;
  const palette = PALETTES[colorScheme] || PALETTES.cyan;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initial center mouse
    mouseRef.current.x = width / 2;
    mouseRef.current.y = height / 2;
    mouseRef.current.targetX = width / 2;
    mouseRef.current.targetY = height / 2;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Visibility change handler to suspend animation loop when tab is hidden
    let isTabVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        lastTime = performance.now();
        render(lastTime);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Simulation states
    let time = 0;
    let lastTime = performance.now();

    // 1. STARFIELD STATE
    interface Star {
      x: number;
      y: number;
      z: number;
      pz: number;
      color: [number, number, number];
      size: number;
    }
    const stars: Star[] = Array.from({ length: 280 }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
      pz: Math.random() * width,
      color: palette.rgb[Math.floor(Math.random() * palette.rgb.length)],
      size: Math.random() * 1.5 + 0.5,
    }));

    // 2. PARTICLES STATE
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      colorIdx: number;
    }
    const particleCount = Math.min(90, Math.floor((width * height) / 14000));
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8 * speed,
      vy: (Math.random() - 0.5) * 0.8 * speed,
      radius: Math.random() * 2 + 1,
      colorIdx: Math.floor(Math.random() * palette.rgb.length),
    }));

    // 3. MATRIX STATE
    const fontSize = 15;
    const columns = Math.floor(width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
    const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ'.split('');

    // 4. FLUID GRADIENT MESH STATE
    interface Blob {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: [number, number, number];
    }
    const blobs: Blob[] = [
      { x: width * 0.25, y: height * 0.3, vx: 0.4, vy: 0.3, radius: Math.min(width, height) * 0.45, color: palette.rgb[0] },
      { x: width * 0.75, y: height * 0.4, vx: -0.3, vy: 0.4, radius: Math.min(width, height) * 0.5, color: palette.rgb[1] },
      { x: width * 0.5, y: height * 0.75, vx: 0.3, vy: -0.35, radius: Math.min(width, height) * 0.4, color: palette.rgb[2] },
      { x: width * 0.85, y: height * 0.8, vx: -0.35, vy: -0.25, radius: Math.min(width, height) * 0.35, color: palette.rgb[0] },
    ];

    // Main render loop
    const render = (now: number) => {
      if (!isTabVisible) return;

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      time += dt * speed;

      // Mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // Clear with dark transparent slate
      ctx.fillStyle = type === 'matrix' ? 'rgba(5, 7, 12, 0.18)' : '#07090e';
      if (type !== 'matrix') {
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillRect(0, 0, width, height);
      }

      // ==========================================
      // 1. AURORA BOREALIS
      // ==========================================
      if (type === 'aurora') {
        // Deep background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#040711');
        bgGrad.addColorStop(0.5, '#070b16');
        bgGrad.addColorStop(1, '#020409');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const mouseOffset = interactive ? ((mouseX - width / 2) / width) * 80 : 0;
        const waveLayers = 4;

        for (let l = 0; l < waveLayers; l++) {
          ctx.save();
          ctx.beginPath();

          const rgb = palette.rgb[l % palette.rgb.length];
          const baseY = height * (0.28 + l * 0.14);
          const amp = (50 + l * 20) * (1 + (interactive ? (mouseY / height) * 0.3 : 0));
          const freq = 0.002 + l * 0.0008;

          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 12) {
            const y1 = Math.sin(x * freq + time * 0.8 + l + mouseOffset * 0.02) * amp;
            const y2 = Math.cos(x * freq * 1.5 - time * 0.5 + l) * (amp * 0.4);
            const y = baseY + y1 + y2;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.closePath();

          const grad = ctx.createLinearGradient(0, baseY - amp * 2, 0, height);
          grad.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.45 - l * 0.08})`);
          grad.addColorStop(0.5, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.15 - l * 0.03})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = grad;
          ctx.globalCompositeOperation = 'screen';
          ctx.fill();
          ctx.restore();
        }

        // Add soft celestial ambient glow around mouse
        if (interactive) {
          const glow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 320);
          glow.addColorStop(0, `rgba(${palette.rgb[0][0]}, ${palette.rgb[0][1]}, ${palette.rgb[0][2]}, 0.12)`);
          glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glow;
          ctx.fillRect(0, 0, width, height);
        }
      }

      // ==========================================
      // 2. HYPERSPACE STARFIELD
      // ==========================================
      else if (type === 'starfield') {
        const cx = width / 2 + (interactive ? (mouseX - width / 2) * 0.15 : 0);
        const cy = height / 2 + (interactive ? (mouseY - height / 2) * 0.15 : 0);

        stars.forEach((star) => {
          star.pz = star.z;
          star.z -= 180 * dt * speed;

          if (star.z <= 0) {
            star.z = width;
            star.pz = width;
            star.x = (Math.random() - 0.5) * width * 2;
            star.y = (Math.random() - 0.5) * height * 2;
          }

          const k = 280 / star.z;
          const px = star.x * k + cx;
          const py = star.y * k + cy;

          const pk = 280 / star.pz;
          const prevX = star.x * pk + cx;
          const prevY = star.y * pk + cy;

          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            const alpha = Math.min(1, (1 - star.z / width) * 1.5);
            const rgb = star.color as any as [number, number, number];

            ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
            ctx.lineWidth = Math.max(1, (1 - star.z / width) * 2.5);
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(px, py);
            ctx.stroke();

            // Bright star tip
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(px, py, (1 - star.z / width) * star.size, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // ==========================================
      // 3. CONSTELLATION PARTICLES
      // ==========================================
      else if (type === 'particles') {
        // Update particles
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Interactive mouse gravity / deflection
          if (interactive) {
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              const force = (1 - dist / 150) * 1.2;
              p.x -= (dx / dist) * force;
              p.y -= (dy / dist) * force;
            }
          }
        });

        // Draw connections
        const maxDist = 140;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
              const alpha = (1 - dist / maxDist) * 0.35;
              const rgb = palette.rgb[particles[i].colorIdx];
              ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        // Connect to mouse
        if (interactive) {
          particles.forEach((p) => {
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
              const alpha = (1 - dist / 180) * 0.55;
              ctx.strokeStyle = `rgba(${palette.rgb[0][0]}, ${palette.rgb[0][1]}, ${palette.rgb[0][2]}, ${alpha})`;
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouseX, mouseY);
              ctx.stroke();
            }
          });
        }

        // Draw particle nodes
        particles.forEach((p) => {
          const rgb = palette.rgb[p.colorIdx];
          ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
          ctx.shadowColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.8)`;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // ==========================================
      // 4. MATRIX DIGITAL CODE RAIN
      // ==========================================
      else if (type === 'matrix') {
        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

        for (let i = 0; i < drops.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Leading bright character
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = palette.primary;
          ctx.shadowBlur = 8;
          ctx.fillText(char, x, y);
          ctx.shadowBlur = 0;

          // Trail character
          const rgb = palette.rgb[i % palette.rgb.length];
          ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.85)`;
          const trailChar = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(trailChar, x, y - fontSize);

          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i] += Math.max(1, Math.round(speed));
        }
      }

      // ==========================================
      // 5. SYNTHWAVE HORIZON WAVES
      // ==========================================
      else if (type === 'waves') {
        const horizonY = height * 0.55;

        // Dark sky with neon radial sun
        const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
        skyGrad.addColorStop(0, '#03050c');
        skyGrad.addColorStop(1, '#0e0b1f');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, horizonY);

        // Neon Horizon Sun
        const sunRadius = Math.min(width, height) * 0.18;
        const sunX = width / 2;
        const sunY = horizonY;

        const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
        sunGrad.addColorStop(0, palette.accent);
        sunGrad.addColorStop(0.7, palette.primary);
        sunGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, Math.PI, 0, false);
        ctx.fill();

        // Perspective Ground Grid
        const gridGrad = ctx.createLinearGradient(0, horizonY, 0, height);
        gridGrad.addColorStop(0, '#090814');
        gridGrad.addColorStop(1, '#020306');
        ctx.fillStyle = gridGrad;
        ctx.fillRect(0, horizonY, width, height - horizonY);

        // Horizontal perspective lines
        const lineCount = 14;
        ctx.strokeStyle = `rgba(${palette.rgb[0][0]}, ${palette.rgb[0][1]}, ${palette.rgb[0][2]}, 0.45)`;
        ctx.lineWidth = 1.2;

        const cycle = (time * 1.5) % 1;
        for (let i = 0; i < lineCount; i++) {
          const t = Math.pow((i + cycle) / lineCount, 2.2);
          const y = horizonY + t * (height - horizonY);

          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Vertical converging lines
        const vCols = 24;
        const mouseShift = interactive ? ((mouseX - width / 2) / width) * 60 : 0;
        for (let i = 0; i <= vCols; i++) {
          const topX = sunX + mouseShift;
          const bottomX = (i / vCols) * width * 1.6 - width * 0.3;

          ctx.strokeStyle = `rgba(${palette.rgb[1][0]}, ${palette.rgb[1][1]}, ${palette.rgb[1][2]}, 0.35)`;
          ctx.beginPath();
          ctx.moveTo(topX, horizonY);
          ctx.lineTo(bottomX, height);
          ctx.stroke();
        }
      }

      // ==========================================
      // 6. LIVING FLUID GRADIENT MESH
      // ==========================================
      else if (type === 'gradientMesh') {
        blobs.forEach((b) => {
          b.x += b.vx * speed * 60 * dt;
          b.y += b.vy * speed * 60 * dt;

          if (b.x < -b.radius * 0.5 || b.x > width + b.radius * 0.5) b.vx *= -1;
          if (b.y < -b.radius * 0.5 || b.y > height + b.radius * 0.5) b.vy *= -1;

          // Interactive push
          if (interactive) {
            const dx = mouseX - b.x;
            const dy = mouseY - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < b.radius) {
              b.x -= (dx / dist) * 1.5;
              b.y -= (dy / dist) * 1.5;
            }
          }

          const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
          grad.addColorStop(0, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, 0.38)`);
          grad.addColorStop(0.6, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, 0.12)`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = grad;
          ctx.globalCompositeOperation = 'screen';
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [type, speed, interactive, colorScheme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none transition-all duration-300"
      style={{
        filter: `brightness(${brightness}%) blur(${blur}px)`,
        transform: blur > 0 ? 'scale(1.05)' : 'none',
      }}
    />
  );
};
