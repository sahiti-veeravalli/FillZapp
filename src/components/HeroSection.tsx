import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="pt-40 pb-24 px-6">
      <div className="section-container text-center">
        {/* Massive headline — Jitter style */}
        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-extrabold font-display tracking-tighter leading-[0.9] mb-8 text-balance">
          Fill forms in
          <br />
          <span className="text-primary">one click</span>
        </h1>

        {/* CTA */}
        <div className="flex justify-center mb-12">
          <Button size="lg" className="text-base px-8 py-6 rounded-full font-display font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Sub-copy */}
        <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed text-balance">
          FillZapp stores your info securely and auto-fills any web form instantly.
          No more retyping your name, email, address, or payment details — ever again.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
