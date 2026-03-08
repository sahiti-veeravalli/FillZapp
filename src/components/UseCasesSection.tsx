import { Briefcase, ShoppingCart, Landmark, GraduationCap, HeartPulse, FileText, Plane, Home, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import GlowCard from "@/components/GlowCard";

const useCases = [
  {
    icon: Briefcase,
    title: "Job Applications",
    badge: "Save 2+ hours/day",
    badgeColor: "text-primary",
    desc: "Apply to 50+ jobs in a single session. Auto-fill name, email, phone, LinkedIn, and upload your resume.",
  },
  {
    icon: ShoppingCart,
    title: "Online Shopping",
    badge: "30 sec checkouts",
    badgeColor: "text-primary",
    desc: "Fill shipping, billing, and contact info at lightning speed. No more retyping your address on every site.",
  },
  {
    icon: Landmark,
    title: "Government Portals",
    badge: "Zero errors",
    badgeColor: "text-primary",
    desc: "Handle visa, tax, and registration forms without the headache. Complex forms, filled in seconds.",
  },
  {
    icon: GraduationCap,
    title: "College Applications",
    badge: "10x faster apps",
    badgeColor: "text-primary",
    desc: "Apply to multiple colleges with consistent, accurate data. Education history auto-filled perfectly.",
  },
  {
    icon: HeartPulse,
    title: "Healthcare Forms",
    badge: "No more clipboards",
    badgeColor: "text-primary",
    desc: "Patient intake, insurance info, and medical history—auto-filled before your appointment even starts.",
  },
  {
    icon: FileText,
    title: "Insurance Claims",
    badge: "Hassle-free",
    badgeColor: "text-primary",
    desc: "File claims faster with pre-filled policy numbers, personal details, and incident information.",
  },
  {
    icon: Plane,
    title: "Travel Bookings",
    badge: "Fly faster",
    badgeColor: "text-primary",
    desc: "Passport details, frequent flyer numbers, and contact info filled across every booking site instantly.",
  },
  {
    icon: Home,
    title: "Rental Applications",
    badge: "Move-in ready",
    badgeColor: "text-primary",
    desc: "Employment history, references, and personal details auto-filled for every apartment application.",
  },
  {
    icon: CreditCard,
    title: "Financial Services",
    badge: "Bank-grade fast",
    badgeColor: "text-primary",
    desc: "Open accounts, apply for loans, and fill KYC forms with your stored financial details in seconds.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 80, damping: 14 },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 12 },
  },
};

const UseCasesSection = () => {
  return (
    <section id="use-cases" className="py-28 px-6 overflow-hidden">
      <div className="section-container">
        <motion.div
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase mb-5">
            Use Cases
          </span>
          <h2 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tighter">
            Built for <span className="text-primary">every scenario</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg max-w-xl mx-auto">
            From job hunting to online shopping, FillZapp handles it all.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {useCases.map((uc) => (
            <motion.div key={uc.title} variants={cardVariants}>
              <GlowCard className="flex gap-5 p-7 rounded-2xl bg-background border border-border h-full">
                <div className="shrink-0 w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                  <uc.icon className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-display font-bold text-lg tracking-tight">
                      {uc.title}
                    </h3>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border border-primary/30 ${uc.badgeColor} bg-primary/10`}>
                      {uc.badge}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {uc.desc}
                  </p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default UseCasesSection;
