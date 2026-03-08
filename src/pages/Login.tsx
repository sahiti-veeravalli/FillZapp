import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import GlowInput from "@/components/GlowInput";
import GlowButton from "@/components/GlowButton";
import CursorParticles from "@/components/CursorParticles";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardMouseX = useMotionValue(0);
  const cardMouseY = useMotionValue(0);

  const handleCardMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardMouseX.set(e.clientX - rect.left);
    cardMouseY.set(e.clientY - rect.top);
  };

  const cardGlow = useMotionTemplate`radial-gradient(400px circle at ${cardMouseX}px ${cardMouseY}px, hsla(168, 80%, 42%, 0.06), transparent 80%)`;

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <CursorParticles />
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
            className="relative bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5 overflow-hidden"
            style={{ background: cardGlow }}
          >
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

            <GlowButton className="w-full h-10 font-display font-semibold rounded-full bg-foreground text-background hover:bg-foreground/90 inline-flex items-center justify-center text-sm">
              {isSignUp ? "Sign Up" : "Sign In"}
            </GlowButton>

            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary font-medium hover:underline"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
