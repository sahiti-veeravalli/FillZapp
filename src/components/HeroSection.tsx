import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate, useSpring } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const proximity = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const btnY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const btnOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const bgRotate = useTransform(scrollYProgress, [0, 1], [0, 3]);

  // Smooth spring versions
  const smoothTitleY = useSpring(titleY, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(titleScale, { stiffness: 100, damping: 30 });

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
    const areaRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseX.set((e.clientX - areaRect.left) / areaRect.width);
    mouseY.set((e.clientY - areaRect.top) / areaRect.height);
  };

  const handleAreaMouseLeave = () => {
    proximity.set(0);
  };

  // Split text for character animation
  const line1 = "Fill forms in";
  const line2 = "one click";

  return (
    <section ref={sectionRef} className="pt-40 pb-24 px-6 relative overflow-hidden min-h-screen flex items-center">
      {/* Parallax background circles */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ scale: bgScale, rotate: bgRotate }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-primary/3 blur-3xl" />
      </motion.div>

      <div className="section-container text-center relative z-10 w-full">
        <motion.div
          style={{ y: smoothTitleY, opacity: titleOpacity, scale: smoothScale }}
        >
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-extrabold font-display tracking-tighter leading-[0.9] mb-8 text-balance overflow-hidden">
            <span className="block overflow-hidden">
              {line1.split("").map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: 120, opacity: 0, rotateX: -90 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  transition={{
                    delay: 0.3 + i * 0.03,
                    type: "spring",
                    stiffness: 150,
                    damping: 12,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
            <span className="block overflow-hidden">
              {line2.split("").map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block text-primary"
                  initial={{ y: 120, opacity: 0, rotateX: -90 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  transition={{
                    delay: 0.6 + i * 0.04,
                    type: "spring",
                    stiffness: 150,
                    damping: 12,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
          </h1>
        </motion.div>

        {/* Button area with glow zone */}
        <motion.div
          style={{ y: btnY, opacity: btnOpacity }}
          className="relative flex justify-center mb-12 py-8"
          onMouseMove={handleAreaMouseMove}
          onMouseLeave={handleAreaMouseLeave}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background: radialBg,
              scale: glowScale,
              filter: useMotionTemplate`blur(${glowBlur}px)`,
            }}
          />

          <motion.div
            ref={btnRef}
            style={{ scale: btnScale, boxShadow: btnShadow }}
            className="rounded-full"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 120, damping: 14 }}
          >
            <Button
              size="lg"
              onClick={() => navigate(user ? "/dashboard" : "/login")}
              className="relative text-base px-8 py-6 rounded-full font-display font-semibold transition-none"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.p
          style={{ y: subtitleY, opacity: subtitleOpacity }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed text-balance"
        >
          FillZapp stores your info securely and auto-fills any web form instantly.
          No more retyping your name, email, address, or payment details — ever again.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 mx-auto flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
