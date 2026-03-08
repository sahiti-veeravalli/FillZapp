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
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const AMBIENT_COUNT = 60;

    // Create ambient particles
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 3 + 0.5,
        baseOpacity: Math.random() * 0.12 + 0.03,
        opacity: 0,
        life: 0,
        maxLife: Infinity,
        type: "ambient",
      });
    }

    let trailTimer = 0;

    const spawnTrail = () => {
      const { x, y } = mouseRef.current;
      if (x < 0) return;
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          size: Math.random() * 4 + 1,
          baseOpacity: 0.4,
          opacity: 0.4,
          life: 0,
          maxLife: 60 + Math.random() * 40,
          type: "trail",
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Spawn trail particles
      trailTimer++;
      if (trailTimer % 2 === 0) spawnTrail();

      // Draw cursor glow
      if (mx > 0) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
        grad.addColorStop(0, "hsla(168, 80%, 42%, 0.07)");
        grad.addColorStop(0.5, "hsla(168, 80%, 42%, 0.02)");
        grad.addColorStop(1, "hsla(168, 80%, 42%, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(mx - 200, my - 200, 400, 400);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Update
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.type === "trail") {
          p.opacity = p.baseOpacity * (1 - p.life / p.maxLife);
          p.size *= 0.98;
          if (p.life >= p.maxLife || p.opacity <= 0.01) {
            particles.splice(i, 1);
            continue;
          }
        } else {
          // Ambient: wrap around
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Brighten near cursor
          if (mx > 0) {
            const dx = p.x - mx;
            const dy = p.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const proximity = Math.max(0, 1 - dist / 250);
            p.opacity = p.baseOpacity + proximity * 0.3;
            // Gently push away from cursor
            if (dist < 200 && dist > 0) {
              p.vx += (dx / dist) * 0.02;
              p.vy += (dy / dist) * 0.02;
            }
          } else {
            p.opacity = p.baseOpacity;
          }

          // Dampen velocity
          p.vx *= 0.999;
          p.vy *= 0.999;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(168, 80%, 50%, ${p.opacity})`;
        ctx.fill();
      }

      // Draw connecting lines between nearby ambient particles
      const ambients = particles.filter((p) => p.type === "ambient");
      for (let i = 0; i < ambients.length; i++) {
        for (let j = i + 1; j < ambients.length; j++) {
          const dx = ambients[i].x - ambients[j].x;
          const dy = ambients[i].y - ambients[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const lineOpacity =
              0.06 *
              (1 - dist / 120) *
              (1 + (ambients[i].opacity + ambients[j].opacity));
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
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default CursorParticles;
