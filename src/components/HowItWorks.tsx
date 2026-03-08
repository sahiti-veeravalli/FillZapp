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

const HowItWorks = () => {
  return (
    <section id="how" className="py-28 px-6">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl font-extrabold font-display tracking-tighter text-center mb-4"
        >
          How it <span className="text-primary">works</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground text-center mb-20 max-w-xl mx-auto text-lg"
        >
          Three simple steps to never fill a form manually again.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <GlowCard className="rounded-2xl border border-border bg-background p-8">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
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
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
