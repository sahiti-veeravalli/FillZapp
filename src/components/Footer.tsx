import { Zap } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "How It Works", href: "#how-it-works" },
  ],
  connect: [
    { label: "Twitter", href: "#" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sahiti-veeravalli/" },
    { label: "GitHub", href: "#" },
  ],
};

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    {/* Main footer */}
    <div className="section-container py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight">
            <Zap className="w-6 h-6" />
            FillZapp
          </div>
          <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-xs">
            Smart autofill platform that eliminates repetitive form filling. Save time and work smarter with intelligent automation.
          </p>
        </div>

        {/* Stay Updated */}
        <div className="space-y-4">
          <h4 className="font-display font-bold text-sm tracking-widest uppercase opacity-80">Stay Updated</h4>
          <form className="flex border-b border-primary-foreground/30 pb-1" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent text-primary-foreground placeholder:text-primary-foreground/50 text-sm outline-none"
            />
            <button type="submit" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              →
            </button>
          </form>
          <p className="text-primary-foreground/50 text-xs">
            By subscribing, you agree to our Privacy Policy.
          </p>
        </div>

        {/* Product */}
        <div className="space-y-4">
          <h4 className="font-display font-bold text-sm tracking-widest uppercase opacity-80">Product</h4>
          <ul className="space-y-2.5">
            {footerLinks.product.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div className="space-y-4">
          <h4 className="font-display font-bold text-sm tracking-widest uppercase opacity-80">Connect</h4>
          <ul className="space-y-2.5">
            {footerLinks.connect.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* Divider */}
    <div className="section-container">
      <div className="border-t border-primary-foreground/15" />
    </div>

    {/* Big brand text */}
    <div className="section-container py-12 text-center overflow-hidden">
      <h2 className="font-display font-extrabold text-6xl sm:text-8xl lg:text-[10rem] tracking-tighter text-primary-foreground/10 select-none leading-none">
        FILLZAPP
      </h2>
    </div>

    {/* Bottom bar */}
    <div className="section-container pb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-primary-foreground/50 text-xs">
        <p>© 2026 FillZapp. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          developed by{" "}
          <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-primary-foreground/80 font-bold italic text-sm">Sahiti</span>{" "}
          <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-primary-foreground font-bold italic text-sm">Veeravalli</span>
          <a href="https://www.linkedin.com/in/sahiti-veeravalli/" target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 72 72">
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
