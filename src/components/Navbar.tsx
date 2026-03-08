import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  currentSection: number;
  onNavigate: (index: number) => void;
}

const Navbar = ({ currentSection, onNavigate }: NavbarProps) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
    <div className="section-container flex items-center justify-between h-16">
      <button
        onClick={() => onNavigate(0)}
        className="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight"
      >
        <Zap className="w-5 h-5 text-primary" />
        FillZapp
      </button>

      <div className="hidden sm:flex items-center gap-8 text-sm font-medium">
        <button
          onClick={() => onNavigate(1)}
          className={`transition-colors ${currentSection === 1 ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          How it works
        </button>
        <button
          onClick={() => onNavigate(2)}
          className={`transition-colors ${currentSection === 2 ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Features
        </button>
        <button
          onClick={() => onNavigate(3)}
          className={`transition-colors ${currentSection === 3 ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Contact
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="font-medium">Log in</Button>
        <Button size="sm" className="font-display font-semibold rounded-full px-5 bg-foreground text-background hover:bg-foreground/90">
          Try for free
        </Button>
      </div>
    </div>
  </nav>
);

export default Navbar;
