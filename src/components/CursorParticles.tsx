import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  baseOpacity: number;
  opacity: number;
  life: number;
  maxLife: number;
  type: "ambient" | "trail";
  pulseOffset: number;
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
    const AMBIENT_COUNT = 140;
    const REPEL_RADIUS = 200;
    const REPEL_FORCE = 10;
    const RETURN_FORCE = 0.008;
    const FRICTION = 0.95;

    for (let i = 0; i < AMBIENT_COUNT; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x, y, originX: x, originY: y,
        vx: 0, vy: 0,
        size: Math.random() * 3.5 + 0.8,
        baseOpacity: Math.random() * 0.18 + 0.04,
        opacity: 0,
        life: 0, maxLife: Infinity,
        type: "ambient",
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    let frameCount = 0;

    const spawnTrail = () => {
      const { x, y, prevX, prevY } = mouseRef.current;
      if (x < 0) return;
      const speed = Math.sqrt((x - prevX) ** 2 + (y - prevY) ** 2);
      const count = Math.min(Math.floor(speed / 3) + 2, 8);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spread = Math.random() * 30;
        particles.push({
          x: x + Math.cos(angle) * spread,
          y: y + Math.sin(angle) * spread,
          originX: 0, originY: 0,
          vx: (Math.random() - 0.5) * 2.5 + (x - prevX) * 0.06,
          vy: (Math.random() - 0.5) * 2.5 + (y - prevY) * 0.06 - 0.4,
          size: Math.random() * 4 + 1.5,
          baseOpacity: 0.35 + Math.random() * 0.25,
          opacity: 0.6,
          life: 0,
          maxLife: 40 + Math.random() * 50,
          type: "trail",
          pulseOffset: 0,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      frameCount++;

      if (frameCount % 2 === 0) spawnTrail();

      // Cursor glow — larger and softer
      if (mx > 0) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 280);
        grad.addColorStop(0, "hsla(168, 80%, 50%, 0.10)");
        grad.addColorStop(0.3, "hsla(168, 80%, 48%, 0.05)");
        grad.addColorStop(0.7, "hsla(168, 80%, 45%, 0.015)");
        grad.addColorStop(1, "hsla(168, 80%, 42%, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx, my, 280, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.type === "trail") {
          const progress = p.life / p.maxLife;
          p.opacity = p.baseOpacity * (1 - progress * progress);
          p.size *= 0.984;
          p.vx *= 0.965;
          p.vy *= 0.965;
          p.x += p.vx;
          p.y += p.vy;
          if (p.life >= p.maxLife || p.opacity <= 0.005) {
            particles.splice(i, 1);
            continue;
          }
        } else {
          // Gentle ambient pulse
          const pulse = Math.sin(frameCount * 0.015 + p.pulseOffset) * 0.3 + 1;

          if (mx > 0) {
            const dx = p.x - mx;
            const dy = p.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < REPEL_RADIUS && dist > 0) {
              const force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }

            const proximity = Math.max(0, 1 - dist / 320);
            p.opacity = (p.baseOpacity + proximity * 0.4) * pulse;
          } else {
            p.opacity = p.baseOpacity * pulse;
          }

          p.vx += (p.originX - p.x) * RETURN_FORCE;
          p.vy += (p.originY - p.y) * RETURN_FORCE;
          p.vx *= FRICTION;
          p.vy *= FRICTION;
          p.x += p.vx;
          p.y += p.vy;
        }

        const drawSize = Math.max(0.5, p.size);
        ctx.beginPath();
        if (p.type === "trail" && p.opacity > 0.08) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, drawSize * 3);
          g.addColorStop(0, `hsla(168, 80%, 55%, ${p.opacity})`);
          g.addColorStop(0.5, `hsla(168, 80%, 50%, ${p.opacity * 0.3})`);
          g.addColorStop(1, `hsla(168, 80%, 50%, 0)`);
          ctx.fillStyle = g;
          ctx.arc(p.x, p.y, drawSize * 3, 0, Math.PI * 2);
        } else {
          ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(168, 80%, 50%, ${p.opacity})`;
        }
        ctx.fill();
      }

      // Connect lines
      const ambients = particles.filter((p) => p.type === "ambient");
      for (let i = 0; i < ambients.length; i++) {
        for (let j = i + 1; j < ambients.length; j++) {
          const dx = ambients[i].x - ambients[j].x;
          const dy = ambients[i].y - ambients[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const lineOpacity = 0.07 * (1 - dist / 110) * (1 + ambients[i].opacity + ambients[j].opacity);
            ctx.beginPath();
            ctx.moveTo(ambients[i].x, ambients[i].y);
            ctx.lineTo(ambients[j].x, ambients[j].y);
            ctx.strokeStyle = `hsla(168, 80%, 50%, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default CursorParticles;
