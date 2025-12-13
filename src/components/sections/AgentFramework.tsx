import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  TrendingUp,
  Ship,
  FileText,
  FlaskConical,
  Database,
  Globe,
  FileSpreadsheet,
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

export function AgentFramework() {
  return (
    <section id="framework" className="py-24 relative overflow-hidden">
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
        <div className="hidden md:flex justify-center mb-8">
          <svg width="200" height="60" className="text-primary">
            <line
              x1="100"
              y1="0"
              x2="20"
              y2="60"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="8 4"
              className="animate-flow"
            />
            <line
              x1="100"
              y1="0"
              x2="100"
              y2="60"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="8 4"
              className="animate-flow"
            />
            <line
              x1="100"
              y1="0"
              x2="180"
              y2="60"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="8 4"
              className="animate-flow"
            />
          </svg>
        </div>

        {/* Worker Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents.map((agent, index) => (
            <AgentCard key={agent.name} agent={agent} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentCard({
  agent,
  index,
}: {
  agent: (typeof agents)[0];
  index: number;
}) {
  const Icon = agent.icon;

  return (
    <Card
      variant="glass"
      className="group hover:border-primary/50 cursor-pointer animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-5">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-6 h-6 text-background" />
        </div>
        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {agent.name}
        </h3>
        <p className="text-sm text-muted-foreground">{agent.description}</p>
      </CardContent>
    </Card>
  );
}
