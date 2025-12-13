import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="AI Pharma Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      {/* Animated Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-[100px] animate-pulse-glow delay-500" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Accelerating Pharma Innovation
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up">
            Transform Research with{" "}
            <span className="gradient-text">Agentic AI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up delay-100">
            Automate scientific, market, and regulatory research. Reduce literature
            reviews from 2-3 months to under a week with intelligent AI agents.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 animate-slide-up delay-200">
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-semibold">3 months → 1 week</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-semibold">7 Specialized Agents</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-300">
            <Link to="/dashboard">
              <Button variant="glow" size="xl">
                Try Demo
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="glass" size="xl">
              View Documentation
            </Button>
          </div>
        </div>

        {/* Workflow Preview */}
        <div className="mt-20 animate-slide-up delay-400">
          <div className="glass-card p-6 md:p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <WorkflowStep
                icon="📚"
                title="Manual Review"
                subtitle="2-3 Months"
                isActive={false}
              />
              <div className="hidden md:block w-20 h-[2px] bg-gradient-to-r from-muted to-primary" />
              <WorkflowStep
                icon="🤖"
                title="AI Orchestrated"
                subtitle="Processing"
                isActive={true}
              />
              <div className="hidden md:block w-20 h-[2px] bg-gradient-to-r from-primary to-muted" />
              <WorkflowStep
                icon="🎯"
                title="Product Discovery"
                subtitle="< 1 Week"
                isActive={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function WorkflowStep({
  icon,
  title,
  subtitle,
  isActive,
}: {
  icon: string;
  title: string;
  subtitle: string;
  isActive: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center text-center p-4 rounded-xl transition-all ${
        isActive ? "bg-primary/10 glow-effect scale-105" : ""
      }`}
    >
      <span className="text-3xl mb-2">{icon}</span>
      <span className={`font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
        {title}
      </span>
      <span className="text-sm text-muted-foreground">{subtitle}</span>
    </div>
  );
}
