import { ArrowRight, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";
import { useRef } from "react";

const HeroSection = () => {
  const btnRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const proximity = useMotionValue(0);

  const glowOpacity = useTransform(proximity, [0, 1], [0, 0.6]);
  const glowScale = useTransform(proximity, [0, 1], [0.8, 1]);
  const glowBlur = useTransform(proximity, [0, 1], [40, 80]);
  const btnShadow = useTransform(
    proximity,
    [0, 1],
    [
      "0 4px 20px -4px hsla(168,80%,42%,0.25)",
      "0 8px 60px -4px hsla(168,80%,42%,0.7), 0 0px 30px 0px hsla(168,80%,42%,0.3)",
    ]
  );
  const btnScale = useTransform(proximity, [0, 1], [1, 1.05]);

  const radialBg = useMotionTemplate`radial-gradient(
    300px circle at ${useTransform(mouseX, (v) => `${v * 100}%`)} ${useTransform(mouseY, (v) => `${v * 100}%`)},
    hsla(168, 80%, 50%, ${glowOpacity}),
    transparent 70%
  )`;

  const handleAreaMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
    const maxDist = 250;
    const p = Math.max(0, 1 - dist / maxDist);
    proximity.set(p);
    // Normalized position within the area
    const areaRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseX.set((e.clientX - areaRect.left) / areaRect.width);
    mouseY.set((e.clientY - areaRect.top) / areaRect.height);
  };

  const handleAreaMouseLeave = () => {
    proximity.set(0);
  };

  return (
    <section className="pt-40 pb-24 px-6">
      <div className="section-container text-center">
        {/* Chrome Extension Banner */}
        <motion.a
          href="#"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2.5 px-6 py-3 mb-10 rounded-full bg-primary text-primary-foreground font-display font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-shadow"
        >
          <Puzzle className="w-5 h-5" />
          Get Chrome Extension
        </motion.a>

        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-extrabold font-display tracking-tighter leading-[0.9] mb-8 text-balance">
          Fill forms in
          <br />
          <span className="text-primary">one click</span>
        </h1>

        {/* Button area with glow zone */}
        <div
          className="relative flex justify-center mb-12 py-8"
          onMouseMove={handleAreaMouseMove}
          onMouseLeave={handleAreaMouseLeave}
        >
          {/* Radial glow behind button */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background: radialBg,
              scale: glowScale,
              filter: useMotionTemplate`blur(${glowBlur}px)`,
            }}
          />

          <motion.div ref={btnRef} style={{ scale: btnScale, boxShadow: btnShadow }} className="rounded-full">
            <Button
              size="lg"
              className="relative text-base px-8 py-6 rounded-full font-display font-semibold transition-none"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>

        <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed text-balance">
          FillZapp stores your info securely and auto-fills any web form instantly.
          No more retyping your name, email, address, or payment details — ever again.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
