import { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Zap, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import BackgroundParticles from "@/components/BackgroundParticles";

const GlowInput = ({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  suffix,
}: {
  id: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: React.ReactNode;
}) => {
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
      <div className="relative z-10 flex items-center">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-10 w-full rounded-xl border border-border bg-card/80 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50 transition-all duration-200 shadow-[0_0_0_0_hsla(168,80%,42%,0)] focus-visible:shadow-[0_0_15px_-3px_hsla(168,80%,42%,0.25)]"
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            {suffix}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PasswordInput = ({
  id,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) => {
  const [show, setShow] = useState(false);
  return (
    <GlowInput
      id={id}
      type={show ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      suffix={
        <button type="button" onClick={() => setShow(!show)} tabIndex={-1}>
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
    />
  );
};

const Login = () => {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validate = () => {
    const errs: Record<string, string> = {};

    if (isSignUp) {
      if (!fullName.trim()) errs.fullName = "Full name is required";
      if (fullName.trim().length > 100) errs.fullName = "Name must be under 100 characters";
      if (!phone.trim()) errs.phone = "Phone number is required";
      else if (!/^\+?[0-9\s\-()]{7,15}$/.test(phone.trim())) errs.phone = "Enter a valid phone number";
    }

    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = "Enter a valid email";

    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters";

    if (isSignUp) {
      if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
      else if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: Firebase auth integration
    console.log(isSignUp ? "Sign up" : "Sign in", { fullName, email, phone, password });
  };

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-destructive text-xs mt-1">{errors[field]}</p> : null;

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
            className="relative border border-border rounded-2xl p-6 shadow-lg overflow-hidden bg-card/60 backdrop-blur-md"
          >
            <motion.div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: cardGlow }} />

            <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <GlowInput id="name" placeholder="Jane Doe" value={fullName} onChange={setFullName} />
                    <FieldError field="fullName" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <GlowInput id="phone" type="tel" placeholder="+91 98765 43210" value={phone} onChange={setPhone} />
                    <FieldError field="phone" />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <GlowInput id="email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
                <FieldError field="email" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <PasswordInput id="password" placeholder="••••••••" value={password} onChange={setPassword} />
                <FieldError field="password" />
              </div>

              {isSignUp && (
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <PasswordInput id="confirmPassword" placeholder="••••••••" value={confirmPassword} onChange={setConfirmPassword} />
                  <FieldError field="confirmPassword" />
                </div>
              )}

              {!isSignUp && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              <motion.div
                ref={btnRef}
                onMouseMove={handleBtnMouseMove}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative group cursor-pointer pt-1"
              >
                <div className="absolute -inset-[1px] rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
                <motion.div className="pointer-events-none absolute inset-0 rounded-full" style={{ background: btnGlow }} />
                <button
                  type="submit"
                  className="relative z-10 w-full h-10 font-display font-semibold rounded-full bg-foreground text-background hover:bg-foreground/90 inline-flex items-center justify-center text-sm shadow-[0_0_20px_-5px_hsla(168,80%,42%,0.15)] hover:shadow-[0_0_25px_-3px_hsla(168,80%,42%,0.3)] transition-shadow duration-300"
                >
                  {isSignUp ? "Create Account" : "Sign In"}
                </button>
              </motion.div>

              <p className="text-center text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrors({});
                  }}
                  className="text-primary font-medium hover:underline"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
