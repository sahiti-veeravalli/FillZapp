import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { useRef } from "react";

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section ref={sectionRef} id="contact" className="py-24 px-6 overflow-hidden">
      <div className="section-container">
        <motion.div
          style={{ y: headingY, opacity: headingOpacity }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Get in touch
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Have questions or want to learn more? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {[
            {
              icon: Mail,
              title: "Email us",
              detail: "hello@fillzapp.com",
              href: "mailto:hello@fillzapp.com",
            },
            {
              icon: MapPin,
              title: "Location",
              detail: "Hyderabad, India",
              href: "#",
            },
          ].map((item, i) => (
            <motion.a
              key={item.title}
              href={item.href}
              initial={{
                opacity: 0,
                y: 60,
                x: i === 0 ? -80 : 80,
                rotateY: i === 0 ? 20 : -20,
                scale: 0.8,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                x: 0,
                rotateY: 0,
                scale: 1,
              }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                type: "spring",
                stiffness: 70,
                damping: 16,
                delay: i * 0.15,
              }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="group flex flex-col items-center gap-3 p-8 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 + i * 0.15 }}
                className="w-12 h-12 rounded-full bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors"
              >
                <item.icon className="w-5 h-5 text-primary" />
              </motion.div>
              <h3 className="font-display font-bold text-foreground">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.detail}</p>
            </motion.a>
          ))}
        </div>

        {/* Developer credit */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 14 }}
          className="mt-12 text-center"
        >
          <p className="flex items-center justify-center gap-4 text-muted-foreground text-2xl">
            developed by{" "}
            <motion.span
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-primary font-bold italic text-6xl"
            >
              Sahiti
            </motion.span>{" "}
            <motion.span
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-foreground font-bold italic text-6xl"
            >
              Veeravalli
            </motion.span>
            <motion.a
              href="https://www.linkedin.com/in/sahiti-veeravalli/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 12 }}
              whileHover={{ scale: 1.15, rotate: 5 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 72 72">
                <rect width="72" height="72" rx="8" fill="#0A66C2"/>
                <path d="M20.5 29.5h6.8v21.7h-6.8V29.5zm3.4-10.8c2.2 0 3.9 1.8 3.9 3.9 0 2.2-1.8 3.9-3.9 3.9-2.2 0-3.9-1.8-3.9-3.9 0-2.2 1.7-3.9 3.9-3.9zM33.4 29.5h6.5v3h.1c.9-1.7 3.1-3.5 6.4-3.5 6.9 0 8.1 4.5 8.1 10.4v12h-6.8V40.9c0-2.5 0-5.6-3.4-5.6-3.4 0-4 2.7-4 5.4v10.5h-6.8V29.5z" fill="#fff"/>
              </svg>
            </motion.a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
