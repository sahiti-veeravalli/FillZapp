import { Zap, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

const Navbar = () => {
  const { theme, toggle } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="section-container flex items-center justify-between h-16">
        <div className="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight relative">
          <span className="relative">
            <span className="absolute inset-0 animate-pulse-glow blur-md rounded-full bg-primary/40" />
            <Zap className="w-5 h-5 text-primary relative z-10 drop-shadow-[0_0_6px_hsla(168,80%,42%,0.6)]" />
          </span>
          FillZapp
        </div>

        <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#use-cases" className="hover:text-foreground transition-colors">Use Cases</a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggle} className="rounded-full">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Link to="/login"><Button size="sm" className="font-display font-semibold rounded-full px-5 bg-foreground text-background hover:bg-foreground/90">Log in</Button></Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
