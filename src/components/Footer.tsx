import { Zap, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Footer = () => (
  <footer className="w-full h-full flex flex-col items-center justify-center px-6">
    <div className="section-container text-center">
      {/* Contact heading */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-6xl font-extrabold font-display tracking-tighter mb-6"
      >
        Get in <span className="text-primary">touch</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto"
      >
        Have questions or feedback? We'd love to hear from you.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
      >
        <a
          href="mailto:hello@fillzapp.com"
          className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-border bg-background hover:border-primary/30 transition-all"
        >
          <Mail className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">hello@fillzapp.com</span>
        </a>
        <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-border bg-background">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Hyderabad, India</span>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="border-t border-border pt-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 font-display font-extrabold text-lg tracking-tight">
          <Zap className="w-5 h-5 text-primary" />
          FillZapp
        </div>
        <p className="text-muted-foreground text-sm">© 2026 FillZapp. All rights reserved.</p>
        <p className="text-muted-foreground text-sm mt-2">
          Built by{" "}
          <span
            style={{ fontFamily: "'Dancing Script', cursive" }}
            className="text-foreground text-base"
          >
            Sahiti Veeravalli
          </span>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
