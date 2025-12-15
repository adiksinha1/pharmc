import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { WorkflowSection } from "@/components/sections/WorkflowSection";
import { DemoSection } from "@/components/sections/DemoSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/effects/ParticleBackground";

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
    </div>
  );
};

export default Index;
