import { Database, ScanSearch, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
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
    title: "Extension detects forms",
    description:
      'Browse the web normally. When FillZapp spots a form, it shows an "Auto Fill" button — no action needed until you want it.',
  },
  {
    icon: CheckCircle2,
    title: "One-click fill",
    description:
      "Click Auto Fill. Known fields are instantly completed. A popup tells you what's done and highlights remaining fields.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
} as const;

const headingVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 12, duration: 0.8 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9, rotateX: 8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 14 },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -45 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 12, delay: 0.15 },
  },
};

const HowItWorks = () => {
  return (
    <section id="how" className="py-28 px-6 overflow-hidden">
      <div className="section-container">
        <motion.h2
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl sm:text-6xl font-extrabold font-display tracking-tighter text-center mb-4"
        >
          How it <span className="text-primary">works</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-center mb-20 max-w-xl mx-auto text-lg"
        >
          Three simple steps to never fill a form manually again.
        </motion.p>

        <motion.div
          className="grid md:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {steps.map((step, i) => (
            <motion.div key={step.title} variants={cardVariants}>
              <GlowCard className="rounded-2xl border border-border bg-background p-8 h-full">
                <motion.div
                  variants={iconVariants}
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
