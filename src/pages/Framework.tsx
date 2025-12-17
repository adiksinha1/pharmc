import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Brain,
  TrendingUp,
  Ship,
  FileText,
  FlaskConical,
  Database,
  Globe,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react";

const agents = [
  {
    icon: TrendingUp,
    name: "IQVIA Insights Agent",
    description: "Market size, growth, and competition data analysis",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Ship,
    name: "EXIM Trends Agent",
    description: "Import/export and sourcing dependency trends",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: FileText,
    name: "Patent Landscape Agent",
    description: "Active patents, expiry, and FTO insights",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: FlaskConical,
    name: "Clinical Trials Agent",
    description: "Ongoing trials by indication or MoA",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Database,
    name: "Internal Knowledge Agent",
    description: "Summarizes internal reports and decks",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Globe,
    name: "Web Intelligence Agent",
    description: "Guidelines, publications, patient forums",
    color: "from-sky-500 to-indigo-500",
  },
  {
    icon: FileSpreadsheet,
    name: "Report Generator Agent",
    description: "Produces formatted PDF/Excel summaries",
    color: "from-lime-500 to-green-500",
  },
];

const Framework = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      
      <main className="relative z-10 pt-24">
        <section className="py-24 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                CrewAI / LangGraph Framework
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Agentic AI Framework
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A sophisticated multi-agent system where specialized AI agents collaborate
                to deliver comprehensive pharma research insights
              </p>
            </div>

            {/* Master Agent */}
            <div className="max-w-2xl mx-auto mb-12">
              <Card variant="glow" className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <CardContent className="p-8 relative">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <Brain className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">Master Agent</h3>
                      <p className="text-muted-foreground">
                        Orchestrates user queries, delegates subtasks, and synthesizes
                        final outputs
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Connecting Lines */}
            <div className="relative max-w-5xl mx-auto mb-12">
              <svg className="w-full h-32 absolute top-0 left-0">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="rgb(var(--primary))" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path
                  d="M 50% 0 L 14% 100, M 50% 0 L 36% 100, M 50% 0 L 50% 100, M 50% 0 L 64% 100, M 50% 0 L 86% 100"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              </svg>
            </div>

            {/* Agent Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {agents.map((agent, index) => {
                const Icon = agent.icon;
                return (
                  <Card
                    key={index}
                    variant="glow"
                    className="group hover:scale-105 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {agent.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <Link to="/signup">
                <Button size="lg" className="group">
                  Get Started with AI Agents
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Framework;
