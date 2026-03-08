import CursorParticles from "@/components/CursorParticles";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import UseCasesSection from "@/components/UseCasesSection";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <CursorParticles />
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <UseCasesSection />
      <CTASection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
