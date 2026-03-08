import { Shield, RefreshCw, Layout, Bell } from "lucide-react";

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
  return (
    <section id="features" className="py-28 px-6 bg-muted/50">
      <div className="section-container">
        <h2 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tighter text-center mb-20">
          Why <span className="text-primary">FillZapp</span>?
        </h2>

        <div className="grid sm:grid-cols-2 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-5 p-7 rounded-2xl bg-background border border-border hover:border-primary/30 transition-all"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg mb-1 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
