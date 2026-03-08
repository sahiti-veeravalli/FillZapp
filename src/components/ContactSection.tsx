import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
          viewport={{ once: true, margin: "-100px" }}
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5, type: "spring", stiffness: 100 }}
              viewport={{ once: true, margin: "-80px" }}
              className="group flex flex-col items-center gap-3 p-8 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.detail}</p>
            </motion.a>
          ))}
        </div>

        {/* Developer credit */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="flex items-center justify-center gap-3 text-muted-foreground text-base">
            developed by{" "}
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-primary font-bold italic text-2xl">Sahiti</span>{" "}
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-foreground font-bold italic text-2xl">Veeravalli</span>
            <a href="https://www.linkedin.com/in/sahiti-veeravalli/" target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 72 72">
                <rect width="72" height="72" rx="8" fill="#0A66C2"/>
                <path d="M20.5 29.5h6.8v21.7h-6.8V29.5zm3.4-10.8c2.2 0 3.9 1.8 3.9 3.9 0 2.2-1.8 3.9-3.9 3.9-2.2 0-3.9-1.8-3.9-3.9 0-2.2 1.7-3.9 3.9-3.9zM33.4 29.5h6.5v3h.1c.9-1.7 3.1-3.5 6.4-3.5 6.9 0 8.1 4.5 8.1 10.4v12h-6.8V40.9c0-2.5 0-5.6-3.4-5.6-3.4 0-4 2.7-4 5.4v10.5h-6.8V29.5z" fill="#fff"/>
              </svg>
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
