import { Zap } from "lucide-react";

const Footer = () => (
  <footer className="py-12 px-6 border-t border-border">
    <div className="section-container flex flex-col items-center gap-6">
      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
        <div className="flex items-center gap-2 font-display font-extrabold text-lg tracking-tight">
          <Zap className="w-5 h-5 text-primary" />
          FillZapp
        </div>
        <p className="text-muted-foreground text-sm">© 2026 FillZapp. All rights reserved.</p>
      </div>
      <div className="pt-4 border-t border-border w-full flex justify-center">
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-base sm:text-lg italic tracking-wide">
          developed by{" "}
          <span className="text-primary font-bold not-italic">Sahiti</span>{" "}
          <span className="text-foreground font-bold not-italic">Veeravalli</span>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
