import { Database, ScanSearch, CheckCircle2 } from "lucide-react";
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
        <h2 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tighter text-center mb-4">
          How it <span className="text-primary">works</span>
        </h2>
        <p className="text-muted-foreground text-center mb-20 max-w-xl mx-auto text-lg">
          Three simple steps to never fill a form manually again.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <GlowCard
              key={step.title}
              className="rounded-2xl border border-border bg-background p-8"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
