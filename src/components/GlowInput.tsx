import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

interface GlowInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const GlowInput = ({ className = "", ...props }: GlowInputProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const glowBg = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, hsla(168, 80%, 42%, 0.12), transparent 80%)`;
  const glowBorder = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, hsla(168, 80%, 42%, 0.4), transparent 80%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative rounded-xl"
    >
      {/* Glow border overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl"
        style={{ background: glowBorder, opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      {/* Glow background */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{ background: glowBg, opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <input
        {...props}
        className={`relative z-10 flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      />
    </motion.div>
  );
};

export default GlowInput;
