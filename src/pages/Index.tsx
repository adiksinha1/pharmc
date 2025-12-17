import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { WorkflowSection } from "@/components/sections/WorkflowSection";
import { DemoSection } from "@/components/sections/DemoSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import { ChatbotWidget } from "@/components/ChatbotWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <WorkflowSection />
        <DemoSection />
        <BenefitsSection />
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
};

export default Index;
