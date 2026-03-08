import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

interface GlowButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const GlowButton = ({ children, className = "", onClick, type }: GlowButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const glow = useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, hsla(168, 80%, 42%, 0.2), transparent 80%)`;

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: glow }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default GlowButton;
