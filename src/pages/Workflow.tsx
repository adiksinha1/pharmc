import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Brain,
  BarChart3,
  FileText,
  CheckCircle2,
  Zap,
} from "lucide-react";

const workflowSteps = [
  {
    icon: Search,
    title: "Define Your Research Query",
    description: "Start by specifying your research question or pharmaceutical focus area. Our system helps you structure complex queries.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Brain,
    title: "Deploy AI Agents",
    description: "Multiple specialized AI agents are deployed simultaneously to research different aspects of your query across various sources.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: BarChart3,
    title: "Data Aggregation & Analysis",
    description: "Agents collect and analyze data from market intelligence, patent databases, clinical trials, and regulatory sources.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: FileText,
    title: "Generate Comprehensive Reports",
    description: "Synthesized insights are compiled into detailed reports with visualizations, recommendations, and actionable intelligence.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: CheckCircle2,
    title: "Quality Validation",
    description: "All findings are cross-referenced and validated against multiple sources to ensure accuracy and reliability.",
    color: "from-rose-500 to-red-500",
  },
  {
    icon: Zap,
    title: "Real-Time Monitoring",
    description: "Track agent progress in real-time with our Agent Monitor dashboard and receive instant notifications on key findings.",
    color: "from-indigo-500 to-violet-500",
  },
];

const benefits = [
  {
    title: "Speed",
    description: "Complete research workflows in hours instead of weeks",
  },
  {
    title: "Accuracy",
    description: "Multi-source validation ensures reliable insights",
  },
  {
    title: "Scalability",
    description: "Handle complex research projects at any scale",
  },
  {
    title: "Transparency",
    description: "Track every agent's work and understand the reasoning",
  },
];

export default function Workflow() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="relative z-10 pt-24">
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                Research Workflow
              </h1>
              <p className="text-xl text-muted-foreground">
                Understand how our AI-powered agents collaborate to deliver comprehensive pharmaceutical research insights
              </p>
            </div>
          </div>
        </section>

        {/* Workflow Steps */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-foreground mb-16 text-center">
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    {/* Step number */}
                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>

                    <Card className="h-full hover:border-primary/50 transition-all hover:shadow-lg">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-primary/5 rounded-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl font-bold text-foreground mb-16 text-center">
              Key Benefits
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Agent Roles */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-foreground mb-16 text-center">
              Specialized AI Agents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:border-emerald-500/50">
                <CardHeader>
                  <CardTitle className="text-lg">Market Intelligence</CardTitle>
                  <CardDescription>IQVIA, Evaluate Pharma</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Analyzes market size, growth trends, and competitive landscape
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:border-amber-500/50">
                <CardHeader>
                  <CardTitle className="text-lg">Patent Landscape</CardTitle>
                  <CardDescription>USPTO, EPO, WIPO</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Searches patent databases for IP opportunities and risks
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:border-purple-500/50">
                <CardHeader>
                  <CardTitle className="text-lg">Clinical Trials</CardTitle>
                  <CardDescription>ClinicalTrials.gov, EudraCT</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Reviews ongoing trials and historical outcomes
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:border-cyan-500/50">
                <CardHeader>
                  <CardTitle className="text-lg">EXIM Trade Analysis</CardTitle>
                  <CardDescription>UN Comtrade, FDA Import Data</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Analyzes import/export trends and supply chain data
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Start Your Research?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Access our full pharmaceutical research platform with AI agents, real-time monitoring, and comprehensive reporting.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/framework">
                <Button size="lg" className="group">
                  View Framework
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline">
                  See Demo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
