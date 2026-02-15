import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import SecurityLayers from "@/components/landing/SecurityLayers";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="security">
        <SecurityLayers />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
