import { Briefcase, ShoppingCart, Landmark, GraduationCap, HeartPulse, Plane } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import GlowCard from "@/components/GlowCard";

const useCases = [
  {
    icon: Briefcase,
    title: "Job Applications",
    badge: "Save 2+ hours/day",
    desc: "Apply to 50+ jobs in a single session. Auto-fill name, email, phone, LinkedIn, and upload your resume.",
  },
  {
    icon: ShoppingCart,
    title: "Online Shopping",
    badge: "30 sec checkouts",
    desc: "Fill shipping, billing, and contact info at lightning speed. No more retyping your address on every site.",
  },
  {
    icon: Landmark,
    title: "Government Portals",
    badge: "Zero errors",
    desc: "Handle visa, tax, and registration forms without the headache. Complex forms, filled in seconds.",
  },
  {
    icon: GraduationCap,
    title: "College Applications",
    badge: "10x faster apps",
    desc: "Apply to multiple colleges with consistent, accurate data. Education history auto-filled perfectly.",
  },
  {
    icon: HeartPulse,
    title: "Healthcare Forms",
    badge: "No more clipboards",
    desc: "Patient intake, insurance info, and medical history—auto-filled before your appointment even starts.",
  },
  {
    icon: Plane,
    title: "Travel Bookings",
    badge: "Fly faster",
    desc: "Passport details, frequent flyer numbers, and contact info filled across every booking site instantly.",
  },
];

const UseCasesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerX = useTransform(scrollYProgress, [0, 0.3], [-100, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section ref={sectionRef} id="use-cases" className="py-28 px-6 overflow-hidden">
      <div className="section-container">
        <motion.div
          style={{ x: headerX, opacity: headerOpacity }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tighter">
            Built for <span className="text-primary">every scenario</span>
          </h2>
          <h2 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tighter">
            Built for <span className="text-primary">every scenario</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg max-w-xl mx-auto">
            From job hunting to online shopping, FillZapp handles it all.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc, i) => {
            // Stagger from different directions based on column
            const col = i % 3;
            const initialX = col === 0 ? -80 : col === 2 ? 80 : 0;
            const initialY = col === 1 ? 80 : 60;

            return (
              <motion.div
                key={uc.title}
                initial={{
                  opacity: 0,
                  y: initialY,
                  x: initialX,
                  scale: 0.8,
                  rotateY: col === 0 ? 10 : col === 2 ? -10 : 0,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  x: 0,
                  scale: 1,
                  rotateY: 0,
                }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  type: "spring",
                  stiffness: 60,
                  damping: 14,
                  delay: i * 0.08,
                }}
              >
                <GlowCard className="flex gap-5 p-7 rounded-2xl bg-background border border-border h-full">
                  <motion.div
                    initial={{ scale: 0, rotate: 90 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 + i * 0.08 }}
                    className="shrink-0 w-14 h-14 rounded-xl bg-secondary flex items-center justify-center"
                  >
                    <uc.icon className="w-6 h-6 text-muted-foreground" />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-display font-bold text-lg tracking-tight">
                        {uc.title}
                      </h3>
                      <motion.span
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileInView={{ scaleX: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/10 origin-left"
                      >
                        {uc.badge}
                      </motion.span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {uc.desc}
                    </p>
                  </div>
                </GlowCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
