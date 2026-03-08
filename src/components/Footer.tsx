import logoImg from "@/assets/logo.png";

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

const Doodles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Squiggle top-left */}
    <svg className="absolute top-8 left-[5%] w-28 h-16 text-primary-foreground/[0.18]" viewBox="0 0 120 50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 25 Q20 5, 35 25 T65 25 T95 25 T115 25" />
    </svg>
    {/* Star top-right */}
    <svg className="absolute top-12 right-[8%] w-10 h-10 text-primary-foreground/[0.2]" viewBox="0 0 40 40" fill="currentColor">
      <path d="M20 2l4.5 13.8H39l-11.7 8.5 4.5 13.8L20 29.6 8.3 38.1l4.5-13.8L1 15.8h14.5z" />
    </svg>
    {/* Circle doodle mid-left */}
    <svg className="absolute top-1/3 left-[3%] w-14 h-14 text-primary-foreground/[0.15]" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="25" cy="25" r="20" strokeDasharray="6 8" />
    </svg>
    {/* Arrow doodle mid-right */}
    <svg className="absolute top-1/4 right-[12%] w-20 h-12 text-primary-foreground/[0.18]" viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 20 Q25 5, 45 20 T75 15" />
      <path d="M65 8 L75 15 L65 22" />
    </svg>
    {/* Lightning bolt bottom-left */}
    <svg className="absolute bottom-[20%] left-[10%] w-8 h-14 text-primary-foreground/[0.2]" viewBox="0 0 30 55" fill="currentColor">
      <path d="M18 0L5 25h10L8 55l20-30H17z" />
    </svg>
    {/* Dots cluster center-left */}
    <svg className="absolute top-[55%] left-[25%] w-16 h-16 text-primary-foreground/[0.15]" viewBox="0 0 60 60" fill="currentColor">
      <circle cx="10" cy="10" r="3" /><circle cx="30" cy="8" r="2.5" /><circle cx="50" cy="15" r="3.5" />
      <circle cx="15" cy="35" r="2" /><circle cx="40" cy="40" r="3" /><circle cx="25" cy="55" r="2.5" />
    </svg>
    {/* Spiral bottom-right */}
    <svg className="absolute bottom-[15%] right-[6%] w-16 h-16 text-primary-foreground/[0.18]" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M30 30 C30 25, 35 20, 40 25 C45 30, 40 38, 33 35 C26 32, 24 22, 32 18 C40 14, 48 22, 45 32 C42 42, 28 46, 22 38" />
    </svg>
    {/* Cross/plus top-center */}
    <svg className="absolute top-16 left-[45%] w-8 h-8 text-primary-foreground/[0.2]" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <line x1="15" y1="5" x2="15" y2="25" /><line x1="5" y1="15" x2="25" y2="15" />
    </svg>
    {/* Wavy line bottom */}
    <svg className="absolute bottom-[30%] left-[40%] w-32 h-10 text-primary-foreground/[0.15]" viewBox="0 0 130 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 15 Q20 0, 35 15 T65 15 T95 15 T125 15" />
    </svg>
    {/* Diamond right-center */}
    <svg className="absolute top-[45%] right-[20%] w-10 h-10 text-primary-foreground/[0.18]" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
      <path d="M20 5 L35 20 L20 35 L5 20 Z" />
    </svg>
    {/* Small star bottom-center */}
    <svg className="absolute bottom-[8%] left-[55%] w-7 h-7 text-primary-foreground/[0.22]" viewBox="0 0 30 30" fill="currentColor">
      <path d="M15 2l3.5 10.5H29l-8.5 6.2 3.5 10.5L15 23l-9 6.2 3.5-10.5L1 12.5h10.5z" />
    </svg>
  </div>
);

const Footer = () => (
  <footer className="bg-primary text-primary-foreground relative">
    <Doodles />
    {/* Main footer */}
    <div className="section-container py-16 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight">
            <img src={logoImg} alt="FillZapp" className="w-7 h-7" />
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
      <div className="flex items-center justify-center text-primary-foreground/50 text-xs">
        <p>© 2026 FillZapp. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
