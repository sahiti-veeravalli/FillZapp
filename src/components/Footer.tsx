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
          <a href="https://www.linkedin.com/in/sahiti-veeravalli/" target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 72 72">
              <rect width="72" height="72" rx="8" fill="#0A66C2"/>
              <path d="M20.5 29.5h6.8v21.7h-6.8V29.5zm3.4-10.8c2.2 0 3.9 1.8 3.9 3.9 0 2.2-1.8 3.9-3.9 3.9-2.2 0-3.9-1.8-3.9-3.9 0-2.2 1.7-3.9 3.9-3.9zM33.4 29.5h6.5v3h.1c.9-1.7 3.1-3.5 6.4-3.5 6.9 0 8.1 4.5 8.1 10.4v12h-6.8V40.9c0-2.5 0-5.6-3.4-5.6-3.4 0-4 2.7-4 5.4v10.5h-6.8V29.5z" fill="#fff"/>
            </svg>
          </a>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
