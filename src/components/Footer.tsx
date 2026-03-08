import { Zap } from "lucide-react";

const Footer = () => (
  <footer className="py-12 px-6 border-t border-border">
    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 font-display font-bold text-lg">
        <Zap className="w-5 h-5 text-primary" />
        FillZapp
      </div>
      <p className="text-muted-foreground text-sm">© 2026 FillZapp. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
