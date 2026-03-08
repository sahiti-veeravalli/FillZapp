import { Shield, RefreshCw, Layout, Bell } from "lucide-react";
import { motion } from "framer-motion";
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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12, duration: 0.8 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 14,
    },
  },
};

const iconBounce = {
  hidden: { scale: 0, rotate: -30 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 250, damping: 10, delay: 0.1 },
  },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-28 px-6 bg-muted/50 overflow-hidden">
      <div className="section-container">
        <motion.h2
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl sm:text-6xl font-extrabold font-display tracking-tighter text-center mb-20"
        >
          Why <span className="text-primary">FillZapp</span>?
        </motion.h2>

        <motion.div
          className="grid sm:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={cardVariants}>
              <GlowCard className="flex gap-5 p-7 rounded-2xl bg-background border border-border h-full">
                <motion.div
                  variants={iconBounce}
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
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
