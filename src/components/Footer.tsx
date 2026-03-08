import { Zap, Linkedin } from "lucide-react";

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
        <p className="text-base sm:text-lg tracking-wide text-muted-foreground flex items-center gap-2">
          developed by{" "}
          <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-primary font-bold italic text-xl sm:text-2xl">Sahiti</span>{" "}
          <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-foreground font-bold italic text-xl sm:text-2xl">Veeravalli</span>
          <a href="https://www.linkedin.com/in/sahiti-veeravalli/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors ml-1">
            <Linkedin className="w-5 h-5" />
          </a>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
