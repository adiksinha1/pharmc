import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  TrendingUp,
  Shield,
  Users,
  FileSearch,
  Database,
  Globe,
  FlaskConical,
  Sparkles,
  CheckCircle2,
  Loader2,
  Clock,
  ArrowRight,
  Zap,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Agent {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  dataSource: string;
  description: string;
  status: "idle" | "running" | "completed" | "error";
  progress: number;
  insights: string[];
  estimatedTime: number;
}

const initialAgents: Agent[] = [
  {
    id: "market",
    name: "Market Intelligence",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    dataSource: "IQVIA, Evaluate Pharma",
    description: "Analyzing market size, growth trends, and competitive landscape",
    status: "idle",
    progress: 0,
    insights: [
      "Global market size: $4.2B (2024)",
      "CAGR: 8.3% through 2030",
      "Top 3 competitors control 62% share",
    ],
    estimatedTime: 45,
  },
  {
    id: "patent",
    name: "Patent Landscape",
    icon: <FileSearch className="w-5 h-5" />,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    dataSource: "USPTO, EPO, WIPO",
    description: "Searching patent databases for IP opportunities and risks",
    status: "idle",
    progress: 0,
    insights: [
      "234 active patents identified",
      "Key patents expiring 2026-2028",
      "White space in delivery mechanisms",
    ],
    estimatedTime: 60,
  },
  {
    id: "clinical",
    name: "Clinical Trials",
    icon: <Users className="w-5 h-5" />,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    dataSource: "ClinicalTrials.gov, EudraCT",
    description: "Reviewing ongoing trials and historical outcomes",
    status: "idle",
    progress: 0,
    insights: [
      "47 active trials in indication",
      "Phase 3 success rate: 68%",
      "Median trial duration: 24 months",
    ],
    estimatedTime: 40,
  },
  {
    id: "exim",
    name: "EXIM Trade Analysis",
    icon: <Globe className="w-5 h-5" />,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
    dataSource: "UN Comtrade, FDA Import Data",
    description: "Analyzing import/export trends and supply chain data",
    status: "idle",
    progress: 0,
    insights: [
      "Primary API source: India (45%)",
      "Import volume up 23% YoY",
      "Supply chain risk: Moderate",
    ],
    estimatedTime: 35,
  },
  {
    id: "regulatory",
    name: "Regulatory Intelligence",
    icon: <Shield className="w-5 h-5" />,
    color: "text-rose-400",
    bgColor: "bg-rose-500/20",
    dataSource: "FDA, EMA, PMDA",
    description: "Checking regulatory pathways and approval requirements",
    status: "idle",
    progress: 0,
    insights: [
      "505(b)(2) pathway available",
      "Priority Review eligible",
      "No safety concerns flagged",
    ],
    estimatedTime: 50,
  },
  {
    id: "scientific",
    name: "Scientific Literature",
    icon: <FlaskConical className="w-5 h-5" />,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    dataSource: "PubMed, Elsevier, Nature",
    description: "Mining research papers for mechanism insights",
    status: "idle",
    progress: 0,
    insights: [
      "1,247 relevant publications",
      "Novel MOA discovered in 2023",
      "Strong efficacy signals",
    ],
    estimatedTime: 55,
  },
  {
    id: "internal",
    name: "Internal Knowledge",
    icon: <Database className="w-5 h-5" />,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/20",
    dataSource: "Internal R&D Database",
    description: "Searching proprietary research and past projects",
    status: "idle",
    progress: 0,
    insights: [
      "3 related internal programs",
      "Previous candidate: Phase 2",
      "Synergy with Project Alpha",
    ],
    estimatedTime: 25,
  },
  {
    id: "web",
    name: "Web Intelligence",
    icon: <Globe className="w-5 h-5" />,
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    dataSource: "News, Social, Industry Reports",
    description: "Monitoring real-time news and social signals",
    status: "idle",
    progress: 0,
    insights: [
      "Competitor announcement Q2",
      "KOL sentiment: Positive",
      "Investor interest rising",
    ],
    estimatedTime: 30,
  },
];

export default function AgentMonitor() {
  const location = useLocation();
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [isRunning, setIsRunning] = useState(false);
  const [masterStatus, setMasterStatus] = useState<"idle" | "orchestrating" | "prioritizing" | "complete">("idle");

  // Auto-start if navigated with query
  useEffect(() => {
    if (location.state?.query) {
      startOrchestration();
    }
  }, [location.state]);

  const startOrchestration = async () => {
    setIsRunning(true);
    setMasterStatus("orchestrating");

    // Reset all agents
    setAgents((prev) =>
      prev.map((agent) => ({ ...agent, status: "idle", progress: 0 }))
    );

    // Simulate agents starting with staggered delays
    for (let i = 0; i < agents.length; i++) {
      await new Promise((r) => setTimeout(r, 300));
      setAgents((prev) =>
        prev.map((agent, idx) =>
          idx === i ? { ...agent, status: "running" } : agent
        )
      );

      // Simulate progress
      simulateAgentProgress(i);
    }

    // Wait for all to complete
    await new Promise((r) => setTimeout(r, 4000));
    setMasterStatus("prioritizing");
    await new Promise((r) => setTimeout(r, 1500));
    setMasterStatus("complete");
    setIsRunning(false);
  };

  const simulateAgentProgress = async (agentIndex: number) => {
    const totalSteps = 10;
    const stepDelay = Math.random() * 300 + 200;

    for (let step = 1; step <= totalSteps; step++) {
      await new Promise((r) => setTimeout(r, stepDelay));
      setAgents((prev) =>
        prev.map((agent, idx) =>
          idx === agentIndex
            ? {
                ...agent,
                progress: step * 10,
                status: step === totalSteps ? "completed" : "running",
              }
            : agent
        )
      );
    }
  };

  const completedCount = agents.filter((a) => a.status === "completed").length;
  const runningCount = agents.filter((a) => a.status === "running").length;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            Agent Monitor
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time visualization of AI agent orchestration
          </p>
        </div>
        <div className="flex gap-3">
          {masterStatus === "complete" && (
            <Link to="/dashboard/insights">
              <Button variant="glow" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                View Insights
              </Button>
            </Link>
          )}
          <Button
            variant={isRunning ? "glass" : "glow"}
            onClick={startOrchestration}
            disabled={isRunning}
            className="gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                {masterStatus === "complete" ? "Run Again" : "Start Demo"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Master Orchestrator */}
      <Card
        variant={masterStatus !== "idle" ? "glow" : "glass"}
        className="p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-cyan-500/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div
            className={`p-4 rounded-2xl ${
              masterStatus === "idle"
                ? "bg-muted"
                : masterStatus === "complete"
                ? "bg-emerald-500/20"
                : "bg-primary/20"
            }`}
          >
            <Brain
              className={`w-8 h-8 ${
                masterStatus === "idle"
                  ? "text-muted-foreground"
                  : masterStatus === "complete"
                  ? "text-emerald-400"
                  : "text-primary animate-pulse"
              }`}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">
              Master Orchestrator AI
            </h2>
            <p className="text-muted-foreground text-sm">
              {masterStatus === "idle" && "Ready to coordinate research agents"}
              {masterStatus === "orchestrating" && "Coordinating worker agents..."}
              {masterStatus === "prioritizing" && "Prioritizing and ranking insights..."}
              {masterStatus === "complete" && "Analysis complete! Insights ready for review."}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{runningCount}</p>
              <p className="text-xs text-muted-foreground">Running</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">{completedCount}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{agents.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Agent Flow Visualization */}
      <div className="relative">
        {/* Connection Lines SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block"
          style={{ minHeight: "400px" }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(173, 80%, 40%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(173, 80%, 40%)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Lines from master to agents - simplified */}
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1="50%"
              y1="80"
              x2={`${15 + i * 23}%`}
              y2="200"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              className={isRunning ? "animate-flow" : ""}
            />
          ))}
          {[4, 5, 6, 7].map((i) => (
            <line
              key={i}
              x1="50%"
              y1="80"
              x2={`${15 + (i - 4) * 23}%`}
              y2="420"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              className={isRunning ? "animate-flow" : ""}
            />
          ))}
        </svg>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 mt-4">
          {agents.map((agent, index) => (
            <Card
              key={agent.id}
              variant={agent.status === "completed" ? "glow" : "glass"}
              className={`p-4 transition-all duration-500 ${
                agent.status === "running" ? "scale-[1.02] ring-2 ring-primary/50" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Agent Header */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={`p-2.5 rounded-xl ${agent.bgColor} ${agent.color} ${
                    agent.status === "running" ? "animate-pulse" : ""
                  }`}
                >
                  {agent.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm truncate">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {agent.dataSource}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {agent.status === "idle" && (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                  {agent.status === "running" && (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  )}
                  {agent.status === "completed" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {agent.status === "error" && (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 rounded-full bg-muted/50 mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    agent.status === "completed"
                      ? "bg-emerald-400"
                      : "bg-primary"
                  }`}
                  style={{ width: `${agent.progress}%` }}
                />
              </div>

              {/* Status Text */}
              <p className="text-xs text-muted-foreground mb-2">
                {agent.status === "idle" && "Waiting to start..."}
                {agent.status === "running" && agent.description}
                {agent.status === "completed" && "Analysis complete"}
              </p>

              {/* Insights Preview (when completed) */}
              {agent.status === "completed" && (
                <div className="space-y-1.5 pt-2 border-t border-border/50">
                  {agent.insights.slice(0, 2).map((insight, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <Sparkles className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Completion Summary */}
      {masterStatus === "complete" && (
        <Card variant="glass" className="p-6 animate-scale-in">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Research Complete
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                All 8 agents have completed their analysis. {agents.reduce((acc, a) => acc + a.insights.length, 0)} insights generated.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/dashboard/insights">
                <Button variant="glow" className="gap-2">
                  View Visual Insights
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/dashboard/reports">
                <Button variant="glass" className="gap-2">
                  Generate Report
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
