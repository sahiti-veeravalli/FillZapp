import { Database, ScanSearch, CheckCircle2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import GlowCard from "@/components/GlowCard";

const steps = [
  {
    icon: Database,
    title: "Store your data",
    description:
      "Add your personal info, addresses, payment details to your secure FillZapp dashboard. Update anytime.",
  },
  {
    icon: ScanSearch,
    title: "Drag the bookmarklet",
    description:
      'Go to your dashboard\'s Auto-Fill Tool tab and drag the "⚡ FillZapp" button to your bookmarks bar. One-time setup, takes 5 seconds.',
  },
  {
    icon: CheckCircle2,
    title: "One-click fill",
    description:
      "Visit any form on the web and click the FillZapp bookmark. Fields are instantly filled and highlighted — no extensions needed.",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const headingScale = useTransform(scrollYProgress, [0, 0.25], [0.7, 1]);
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.7], ["0%", "100%"]);

  return (
    <section ref={sectionRef} id="how" className="py-28 px-6 overflow-hidden relative">
      <div className="section-container">
        <motion.h2
          style={{ y: headingY, opacity: headingOpacity, scale: headingScale }}
          className="text-4xl sm:text-6xl font-extrabold font-display tracking-tighter text-center mb-4"
        >
          How it <span className="text-primary">works</span>
        </motion.h2>
        <motion.p
          style={{ opacity: headingOpacity }}
          className="text-muted-foreground text-center mb-20 max-w-xl mx-auto text-lg"
        >
          Three simple steps to never fill a form manually again.
        </motion.p>

        <div className="relative">
          {/* Animated vertical timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-border hidden md:block">
            <motion.div
              className="w-full bg-primary origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-24 md:space-y-32">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={step.title}
                  initial={{
                    opacity: 0,
                    x: isLeft ? -120 : 120,
                    rotateY: isLeft ? 15 : -15,
                    scale: 0.85,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    rotateY: 0,
                    scale: 1,
                  }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    type: "spring",
                    stiffness: 60,
                    damping: 16,
                    delay: 0.1,
                  }}
                  className={`md:grid md:grid-cols-2 md:gap-16 items-center ${
                    isLeft ? "" : "md:direction-rtl"
                  }`}
                >
                  <div className={`${isLeft ? "md:text-right" : "md:text-left md:col-start-2"}`}>
                    <GlowCard className="rounded-2xl border border-border bg-background p-8 inline-block w-full">
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 }}
                        className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6"
                      >
                        <step.icon className="w-7 h-7 text-primary" />
                      </motion.div>
                      <div className="text-xs font-bold text-primary mb-2 font-display uppercase tracking-widest">
                        Step {i + 1}
                      </div>
                      <h3 className="text-2xl font-bold font-display tracking-tight mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </GlowCard>
                  </div>

                  {/* Timeline dot */}
                  <motion.div
                    className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary border-4 border-background shadow-lg shadow-primary/30"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
