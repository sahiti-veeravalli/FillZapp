import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="section-container pt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
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

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Jane Doe" className="rounded-xl" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="rounded-xl" />
            </div>

            <Button className="w-full font-display font-semibold rounded-full bg-foreground text-background hover:bg-foreground/90">
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>

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
      </div>
    </div>
  );
};

export default Login;
