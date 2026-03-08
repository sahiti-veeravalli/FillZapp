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
    <section className="py-28 px-6 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-bold font-display text-center mb-16">
          Why <span className="gradient-text">FillZapp</span>?
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex gap-5 p-6 rounded-2xl glass hover:border-primary/20 transition-all">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg mb-1">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
