import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseOpacity: number;
  opacity: number;
  life: number;
  maxLife: number;
  type: "ambient" | "trail";
}

const CursorParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, prevX: -1000, prevY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const AMBIENT_COUNT = 80;

    for (let i = 0; i < AMBIENT_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 0.5,
        baseOpacity: Math.random() * 0.15 + 0.03,
        opacity: 0,
        life: 0,
        maxLife: Infinity,
        type: "ambient",
      });
    }

    let frameCount = 0;

    const spawnTrail = () => {
      const { x, y, prevX, prevY } = mouseRef.current;
      if (x < 0) return;

      const speed = Math.sqrt((x - prevX) ** 2 + (y - prevY) ** 2);
      const count = Math.min(Math.floor(speed / 3) + 1, 6);

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spread = Math.random() * 25;
        particles.push({
          x: x + Math.cos(angle) * spread,
          y: y + Math.sin(angle) * spread,
          vx: (Math.random() - 0.5) * 2 + (x - prevX) * 0.05,
          vy: (Math.random() - 0.5) * 2 + (y - prevY) * 0.05 - 0.3,
          size: Math.random() * 4 + 1.5,
          baseOpacity: 0.35 + Math.random() * 0.2,
          opacity: 0.5,
          life: 0,
          maxLife: 50 + Math.random() * 50,
          type: "trail",
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      frameCount++;

      if (frameCount % 2 === 0) spawnTrail();

      // Cursor glow
      if (mx > 0) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 220);
        grad.addColorStop(0, "hsla(168, 80%, 50%, 0.09)");
        grad.addColorStop(0.4, "hsla(168, 80%, 45%, 0.04)");
        grad.addColorStop(1, "hsla(168, 80%, 42%, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx, my, 220, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.type === "trail") {
          const progress = p.life / p.maxLife;
          p.opacity = p.baseOpacity * (1 - progress * progress);
          p.size *= 0.985;
          p.vx *= 0.97;
          p.vy *= 0.97;
          if (p.life >= p.maxLife || p.opacity <= 0.005) {
            particles.splice(i, 1);
            continue;
          }
        } else {
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          if (mx > 0) {
            const dx = p.x - mx;
            const dy = p.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const proximity = Math.max(0, 1 - dist / 280);
            p.opacity = p.baseOpacity + proximity * 0.4;
            p.size += proximity * 0.02;
            if (dist < 220 && dist > 0) {
              p.vx += (dx / dist) * 0.03;
              p.vy += (dy / dist) * 0.03;
            }
          } else {
            p.opacity = p.baseOpacity;
          }

          p.vx *= 0.998;
          p.vy *= 0.998;
          // Clamp ambient size
          if (p.size > 4) p.size = 4;
        }

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        if (p.type === "trail" && p.opacity > 0.1) {
          // Trail particles get a soft glow
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
          g.addColorStop(0, `hsla(168, 80%, 55%, ${p.opacity})`);
          g.addColorStop(1, `hsla(168, 80%, 50%, 0)`);
          ctx.fillStyle = g;
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = `hsla(168, 80%, 50%, ${p.opacity})`;
        }
        ctx.fill();
      }

      // Connect ambient particles
      const ambients = particles.filter((p) => p.type === "ambient");
      for (let i = 0; i < ambients.length; i++) {
        for (let j = i + 1; j < ambients.length; j++) {
          const dx = ambients[i].x - ambients[j].x;
          const dy = ambients[i].y - ambients[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const lineOpacity =
              0.06 * (1 - dist / 130) * (1 + ambients[i].opacity + ambients[j].opacity);
            ctx.beginPath();
            ctx.moveTo(ambients[i].x, ambients[i].y);
            ctx.lineTo(ambients[j].x, ambients[j].y);
            ctx.strokeStyle = `hsla(168, 80%, 50%, ${lineOpacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, prevX: -1000, prevY: -1000 };
    };
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
  );
};

export default CursorParticles;
