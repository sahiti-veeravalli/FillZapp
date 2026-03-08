import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import BackgroundParticles from "@/components/BackgroundParticles";

const GlowInput = ({ id, type = "text", placeholder }: { id: string; type?: string; placeholder: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const glow = useMotionTemplate`radial-gradient(180px circle at ${mouseX}px ${mouseY}px, hsla(168, 80%, 42%, 0.15), transparent 80%)`;

  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} className="relative group">
      <motion.div
        className="pointer-events-none absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, hsla(168, 80%, 42%, 0.3), hsla(168, 80%, 42%, 0.1))`,
          filter: "blur(1px)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: glow }}
      />
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="relative z-10 flex h-10 w-full rounded-xl border border-border bg-card/80 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50 transition-all duration-200 shadow-[0_0_0_0_hsla(168,80%,42%,0)] focus-visible:shadow-[0_0_15px_-3px_hsla(168,80%,42%,0.25)]"
      />
    </motion.div>
  );
};

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardMouseX = useMotionValue(0);
  const cardMouseY = useMotionValue(0);
  const btnRef = useRef<HTMLDivElement>(null);
  const btnMouseX = useMotionValue(0);
  const btnMouseY = useMotionValue(0);

  const handleCardMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardMouseX.set(e.clientX - rect.left);
    cardMouseY.set(e.clientY - rect.top);
  };

  const handleBtnMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    btnMouseX.set(e.clientX - rect.left);
    btnMouseY.set(e.clientY - rect.top);
  };

  const cardGlow = useMotionTemplate`radial-gradient(400px circle at ${cardMouseX}px ${cardMouseY}px, hsla(168, 80%, 42%, 0.05), transparent 80%)`;
  const btnGlow = useMotionTemplate`radial-gradient(200px circle at ${btnMouseX}px ${btnMouseY}px, hsla(168, 80%, 60%, 0.25), transparent 80%)`;

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <BackgroundParticles />

      <div className="section-container pt-8 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 font-display font-extrabold text-2xl tracking-tight mb-2">
              <Zap className="w-6 h-6 text-primary" />
              FillZapp
            </div>
            <p className="text-muted-foreground text-sm">
              {isSignUp ? "Create your account" : "Welcome back"}
            </p>
          </div>

          <motion.div
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            className="relative border border-border rounded-2xl p-6 shadow-lg space-y-5 overflow-hidden bg-card/60 backdrop-blur-md"
          >
            {/* Card glow overlay */}
            <motion.div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: cardGlow }} />

            <div className="relative z-10 space-y-5">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <GlowInput id="name" placeholder="Jane Doe" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <GlowInput id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <GlowInput id="password" type="password" placeholder="••••••••" />
              </div>

              {/* Glowing button */}
              <motion.div
                ref={btnRef}
                onMouseMove={handleBtnMouseMove}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative group cursor-pointer"
              >
                <div className="absolute -inset-[1px] rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
                <motion.div className="pointer-events-none absolute inset-0 rounded-full" style={{ background: btnGlow }} />
                <button className="relative z-10 w-full h-10 font-display font-semibold rounded-full bg-foreground text-background hover:bg-foreground/90 inline-flex items-center justify-center text-sm shadow-[0_0_20px_-5px_hsla(168,80%,42%,0.15)] hover:shadow-[0_0_25px_-3px_hsla(168,80%,42%,0.3)] transition-shadow duration-300">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </button>
              </motion.div>

              <p className="text-center text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary font-medium hover:underline"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
