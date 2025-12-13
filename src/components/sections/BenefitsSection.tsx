import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Lightbulb,
  Target,
  Cpu,
  FileCheck,
  ArrowRight,
} from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Time Savings",
    description: "Research cycle reduced from 3 months to under 1 week",
    stat: "12x Faster",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Lightbulb,
    title: "Enhanced Innovation",
    description: "Identifies untapped repurposing and formulation opportunities",
    stat: "85% More Insights",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Target,
    title: "Improved Accuracy",
    description: "Cross-verification across multiple reliable data sources",
    stat: "99% Verified",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Cpu,
    title: "Scalability",
    description: "Extensible framework for new therapy areas and datasets",
    stat: "Unlimited Scale",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: FileCheck,
    title: "Ready Deliverables",
    description: "Automated, ready-to-share PDF/Excel reports for decision-making",
    stat: "One-Click Export",
    color: "from-rose-500 to-pink-500",
  },
];

const comparison = [
  { metric: "Research Duration", manual: "3 months", ai: "Under 1 week" },
  { metric: "Data Sources", manual: "3-5 sources", ai: "7+ integrated sources" },
  { metric: "Accuracy", manual: "Variable", ai: "Cross-verified" },
  { metric: "Report Generation", manual: "Manual", ai: "Automated" },
  { metric: "Cost per Study", manual: "High", ai: "80% Lower" },
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Transforming Pharma Research Efficiency
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the power of AI-driven research automation and unlock
            unprecedented efficiency in drug discovery
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {benefits.map((benefit, index) => (
            <BenefitCard key={benefit.title} benefit={benefit} index={index} />
          ))}
        </div>

        {/* Comparison Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            Manual vs AI-Driven Research
          </h3>

          <Card variant="glass" className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-3 bg-secondary/50 p-4 border-b border-border/50">
                <div className="font-semibold text-foreground">Comparison</div>
                <div className="font-semibold text-muted-foreground text-center">
                  Manual Research
                </div>
                <div className="font-semibold text-primary text-center">
                  AI-Driven Research
                </div>
              </div>

              {comparison.map((row, idx) => (
                <div
                  key={row.metric}
                  className={`grid grid-cols-3 p-4 items-center ${
                    idx !== comparison.length - 1 ? "border-b border-border/30" : ""
                  }`}
                >
                  <div className="text-foreground font-medium">{row.metric}</div>
                  <div className="text-center text-muted-foreground">
                    {row.manual}
                  </div>
                  <div className="text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                      {row.ai}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Card variant="glow" className="max-w-2xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ready to Transform Your Research?
              </h3>
              <p className="text-muted-foreground mb-8">
                Join leading pharmaceutical companies already leveraging our
                Agentic AI platform for faster, smarter drug discovery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="glow" size="xl">
                  Schedule Demo
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="glass" size="xl">
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  benefit,
  index,
}: {
  benefit: (typeof benefits)[0];
  index: number;
}) {
  const Icon = benefit.icon;

  return (
    <Card
      variant="elevated"
      className="group animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-7 h-7 text-background" />
        </div>

        <div className="text-sm font-semibold text-primary mb-2">
          {benefit.stat}
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {benefit.title}
        </h3>

        <p className="text-muted-foreground">{benefit.description}</p>
      </CardContent>
    </Card>
  );
}
