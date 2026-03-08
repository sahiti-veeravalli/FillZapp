import { Database, ScanSearch, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Database,
    title: "Store your data",
    description: "Add your personal info, addresses, payment details, and more to your secure FillZapp dashboard. Update anytime.",
  },
  {
    icon: ScanSearch,
    title: "Extension detects forms",
    description: "Browse the web normally. When FillZapp spots a form, it shows an \"Auto Fill\" button — no action needed until you want it.",
  },
  {
    icon: CheckCircle2,
    title: "One-click fill",
    description: "Click Auto Fill. Known fields are instantly completed. A confirmation popup tells you what's done and highlights remaining fields for you.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-bold font-display text-center mb-4">
          How it <span className="gradient-text">works</span>
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
          Three simple steps to never fill a form manually again.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="glass rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 group"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-xs font-semibold text-primary mb-2 font-display">STEP {i + 1}</div>
              <h3 className="text-xl font-bold font-display mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
