import { Shield, RefreshCw, Layout, Bell } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import GlowCard from "@/components/GlowCard";

const features = [
  {
    icon: Shield,
    title: "Secure vault",
    desc: "Your data lives encrypted in your personal dashboard — only you can access it.",
  },
  {
    icon: RefreshCw,
    title: "Always in sync",
    desc: "Update info on the dashboard and the extension picks it up instantly.",
  },
  {
    icon: Layout,
    title: "Smart detection",
    desc: "FillZapp recognizes form fields across thousands of websites automatically.",
  },
  {
    icon: Bell,
    title: "Completion alerts",
    desc: "After auto-fill, a popup tells you exactly which fields were filled and which need attention.",
  },
];

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const headingRotate = useTransform(scrollYProgress, [0, 0.3], [-3, 0]);
  const headingScale = useTransform(scrollYProgress, [0, 0.3], [0.85, 1]);

  return (
    <section ref={sectionRef} id="features" className="py-28 px-6 bg-muted/50 overflow-hidden relative">
      {/* Parallax background element */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/3 blur-3xl" />
      </motion.div>

      <div className="section-container relative z-10">
        <motion.h2
          style={{ rotate: headingRotate, scale: headingScale }}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 14 }}
          className="text-4xl sm:text-6xl font-extrabold font-display tracking-tighter text-center mb-20"
        >
          Why <span className="text-primary">FillZapp</span>?
        </motion.h2>

        <div className="grid sm:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{
                opacity: 0,
                y: 80,
                x: i % 2 === 0 ? -60 : 60,
                rotateZ: i % 2 === 0 ? -3 : 3,
                scale: 0.85,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                x: 0,
                rotateZ: 0,
                scale: 1,
              }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                type: "spring",
                stiffness: 70,
                damping: 16,
                delay: i * 0.1,
              }}
            >
              <GlowCard className="flex gap-5 p-7 rounded-2xl bg-background border border-border h-full">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 250, damping: 10, delay: 0.2 + i * 0.1 }}
                  className="shrink-0 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center"
                >
                  <f.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-display font-bold text-lg mb-1 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
