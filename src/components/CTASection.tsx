import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.4], [0.6, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const rotate = useTransform(scrollYProgress, [0, 0.4], [-5, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [100, -50]);

  return (
    <section ref={sectionRef} className="py-28 px-6 overflow-hidden relative">
      {/* Parallax glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-3xl" />
      </motion.div>

      <div className="section-container text-center relative z-10">
        <motion.div
          style={{ scale, opacity, rotate }}
        >
          <motion.h2
            className="text-4xl sm:text-6xl font-extrabold font-display tracking-tighter mb-5"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
          >
            Start Filling Forms in<br />Seconds
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-muted-foreground text-lg mb-10"
          >
            Free to use. No extensions needed. No credit card required.
          </motion.p>
          <motion.a
            href="/login?mode=register"
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, type: "spring", stiffness: 120, damping: 14 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-display font-bold text-lg shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
