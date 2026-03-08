import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
    <div className="section-container flex items-center justify-between h-16">
      <div className="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight">
        <Zap className="w-5 h-5 text-primary" />
        FillZapp
      </div>

      <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="font-medium">Log in</Button>
        <Button size="sm" className="font-display font-semibold rounded-full px-5 bg-foreground text-background hover:bg-foreground/90">Try for free</Button>
      </div>
    </div>
  </nav>
);

export default Navbar;
