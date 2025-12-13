import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Database,
  Users,
  TrendingUp,
  Activity,
  Search,
  ArrowRight,
  Sparkles,
  Zap,
  FileText,
  Brain,
  FlaskConical,
  Shield,
  Globe,
} from "lucide-react";

const metrics = [
  {
    label: "Time Saved",
    value: "85%",
    subtext: "vs. traditional research",
    icon: <Clock className="w-5 h-5" />,
    trend: "+12%",
    color: "text-emerald-400",
  },
  {
    label: "Data Sources",
    value: "47+",
    subtext: "integrated databases",
    icon: <Database className="w-5 h-5" />,
    trend: "+5",
    color: "text-cyan-400",
  },
  {
    label: "Active Agents",
    value: "8",
    subtext: "AI workers online",
    icon: <Users className="w-5 h-5" />,
    trend: "100%",
    color: "text-primary",
  },
  {
    label: "Insights Generated",
    value: "2,847",
    subtext: "this month",
    icon: <TrendingUp className="w-5 h-5" />,
    trend: "+23%",
    color: "text-amber-400",
  },
];

const recentQueries = [
  {
    query: "GLP-1 agonist repurposing for NASH treatment",
    status: "completed",
    time: "2 hours ago",
    insights: 12,
  },
  {
    query: "Patent landscape for CAR-T cell therapies",
    status: "completed",
    time: "5 hours ago",
    insights: 8,
  },
  {
    query: "Market analysis for rare disease treatments",
    status: "processing",
    time: "Just now",
    insights: 3,
  },
];

const quickActions = [
  {
    icon: <Search className="w-5 h-5" />,
    label: "New Research Query",
    description: "Start a new AI-powered research",
    path: "/dashboard/query",
    color: "bg-primary/20 text-primary",
  },
  {
    icon: <Activity className="w-5 h-5" />,
    label: "Monitor Agents",
    description: "View real-time agent activity",
    path: "/dashboard/agents",
    color: "bg-cyan-500/20 text-cyan-400",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    label: "Generate Report",
    description: "Create executive summary",
    path: "/dashboard/reports",
    color: "bg-amber-500/20 text-amber-400",
  },
];

const agentStatus = [
  { name: "Scientific Agent", status: "active", icon: <FlaskConical className="w-4 h-4" /> },
  { name: "Market Agent", status: "active", icon: <TrendingUp className="w-4 h-4" /> },
  { name: "Regulatory Agent", status: "idle", icon: <Shield className="w-4 h-4" /> },
  { name: "Clinical Agent", status: "active", icon: <Users className="w-4 h-4" /> },
  { name: "IP Agent", status: "processing", icon: <FileText className="w-4 h-4" /> },
  { name: "Web Agent", status: "idle", icon: <Globe className="w-4 h-4" /> },
];

export default function DashboardHome() {
  const { user } = (() => {
    try {
      return useAuth();
    } catch (e) {
      return { user: null } as any;
    }
  })();
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            {user ? `Welcome back, ${user.name}` : "Welcome back"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Your AI research platform is ready. 8 agents standing by.
          </p>
        </div>
        <Link to="/dashboard/query">
          <Button variant="glow" size="lg" className="gap-2">
            <Zap className="w-5 h-5" />
            Start New Research
          </Button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card
            key={metric.label}
            variant="glass"
            className="p-5 hover:scale-[1.02] transition-transform duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl bg-muted/50 ${metric.color}`}>
                {metric.icon}
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                {metric.trend}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-foreground">{metric.value}</h3>
              <p className="text-sm text-muted-foreground mt-1">{metric.label}</p>
              <p className="text-xs text-muted-foreground/70">{metric.subtext}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card variant="glass" className="p-5 lg:col-span-1">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
              >
                <div className={`p-2.5 rounded-lg ${action.color}`}>
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{action.label}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {action.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Queries */}
        <Card variant="glass" className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Recent Research Queries
            </h2>
            <Link to="/dashboard/reports">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentQueries.map((query, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="p-2.5 rounded-lg bg-primary/20">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {query.query}
                  </p>
                  <p className="text-xs text-muted-foreground">{query.time}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {query.insights} insights
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      query.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {query.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Agent Status Grid */}
      <Card variant="glass" className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Agent Status Overview
          </h2>
          <Link to="/dashboard/agents">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              View Details
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {agentStatus.map((agent) => (
            <div
              key={agent.name}
              className="p-4 rounded-xl bg-muted/30 text-center hover:bg-muted/50 transition-colors"
            >
              <div
                className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2 ${
                  agent.status === "active"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : agent.status === "processing"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {agent.icon}
              </div>
              <p className="text-xs font-medium text-foreground truncate">{agent.name}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    agent.status === "active"
                      ? "bg-emerald-400"
                      : agent.status === "processing"
                      ? "bg-amber-400 animate-pulse"
                      : "bg-muted-foreground"
                  }`}
                />
                <span className="text-xs text-muted-foreground capitalize">
                  {agent.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Workflow Preview */}
      <Card variant="glass" className="p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-cyan-500/5" />
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Research Workflow
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Manual Review</p>
                <p className="text-xs text-muted-foreground">2-3 Months</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-px w-12 bg-gradient-to-r from-rose-500/50 to-primary hidden md:block" />
              <ArrowRight className="w-6 h-6 text-primary mx-2" />
              <div className="h-px w-12 bg-gradient-to-r from-primary to-cyan-500/50 hidden md:block" />
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/30 glow-effect">
              <div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Agentic AI Research</p>
                <p className="text-xs text-primary">Under 1 Week</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="h-px w-12 bg-gradient-to-r from-primary to-emerald-500/50 hidden md:block" />
              <ArrowRight className="w-6 h-6 text-emerald-400 mx-2" />
              <div className="h-px w-12 bg-emerald-500/50 hidden md:block" />
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Product Discovery</p>
                <p className="text-xs text-emerald-400">Actionable Insights</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
