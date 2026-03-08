import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50 mb-8 animate-fade-up">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground font-medium">Chrome Extension + Web Dashboard</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl font-bold font-display tracking-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Fill forms in
          <span className="gradient-text"> one click</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
          FillZapp stores your info securely and auto-fills any web form instantly.
          No more retyping your name, email, address, or payment details — ever again.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Button size="lg" className="text-lg px-8 py-6 glow-primary font-display font-semibold">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6 font-display font-semibold">
            Login
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
