import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  GitBranch,
  Search,
  Combine,
  FileOutput,
  ChevronRight,
} from "lucide-react";

const steps = [
  {
    number: 1,
    icon: MessageSquare,
    title: "User Input",
    description: 'User inputs a prompt: "Find repurposing opportunities for Molecule X"',
    color: "from-cyan-500 to-blue-500",
  },
  {
    number: 2,
    icon: GitBranch,
    title: "Task Decomposition",
    description: "Master Agent decomposes query and delegates to Worker Agents",
    color: "from-violet-500 to-purple-500",
  },
  {
    number: 3,
    icon: Search,
    title: "Data Gathering",
    description: "Worker Agents gather and analyze data from multiple sources",
    sources: [
      { label: "Market", source: "IQVIA" },
      { label: "Trade", source: "EXIM" },
      { label: "Patents", source: "USPTO" },
      { label: "Trials", source: "ClinicalTrials.gov" },
      { label: "Internal", source: "Summarized insights" },
      { label: "Web", source: "Research papers" },
    ],
    color: "from-emerald-500 to-teal-500",
  },
  {
    number: 4,
    icon: Combine,
    title: "Synthesis",
    description: "Master Agent synthesizes results into a unified analysis",
    color: "from-amber-500 to-orange-500",
  },
  {
    number: 5,
    icon: FileOutput,
    title: "Report Generation",
    description: "Report Generator Agent outputs a downloadable PDF with tables, charts, and insights",
    color: "from-rose-500 to-pink-500",
  },
];

export function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="workflow" className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            From Molecule Discovery to Innovative Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A streamlined 5-step process that transforms complex pharma research
            into actionable insights
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Steps List */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <WorkflowStepCard
                key={step.number}
                step={step}
                isActive={activeStep === index}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>

          {/* Active Step Detail */}
          <div className="lg:sticky lg:top-24">
            <Card variant="glow" className="overflow-hidden">
              <div
                className={`h-2 bg-gradient-to-r ${steps[activeStep].color}`}
              />
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center`}
                  >
                    {(() => {
                      const Icon = steps[activeStep].icon;
                      return <Icon className="w-8 h-8 text-background" />;
                    })()}
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Step {steps[activeStep].number}
                    </span>
                    <h3 className="text-2xl font-bold text-foreground">
                      {steps[activeStep].title}
                    </h3>
                  </div>
                </div>

                <p className="text-muted-foreground text-lg mb-6">
                  {steps[activeStep].description}
                </p>

                {/* Data Sources (for step 3) */}
                {steps[activeStep].sources && (
                  <div className="grid grid-cols-2 gap-3">
                    {steps[activeStep].sources.map((source) => (
                      <div
                        key={source.label}
                        className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50"
                      >
                        <ChevronRight className="w-4 h-4 text-primary" />
                        <div>
                          <span className="font-medium text-foreground">
                            {source.label}
                          </span>
                          <span className="text-sm text-muted-foreground ml-1">
                            → {source.source}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkflowStepCard({
  step,
  isActive,
  onClick,
}: {
  step: (typeof steps)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = step.icon;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
        isActive
          ? "bg-primary/10 border border-primary/30 shadow-lg"
          : "bg-card/50 border border-transparent hover:bg-card hover:border-border"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
          isActive
            ? `bg-gradient-to-br ${step.color}`
            : "bg-secondary"
        }`}
      >
        <Icon className={`w-6 h-6 ${isActive ? "text-background" : "text-muted-foreground"}`} />
      </div>
      <div className="flex-1">
        <span className="text-sm text-muted-foreground">Step {step.number}</span>
        <h3
          className={`font-semibold transition-colors ${
            isActive ? "text-primary" : "text-foreground"
          }`}
        >
          {step.title}
        </h3>
      </div>
      <ChevronRight
        className={`w-5 h-5 transition-all ${
          isActive ? "text-primary translate-x-1" : "text-muted-foreground"
        }`}
      />
    </div>
  );
}
