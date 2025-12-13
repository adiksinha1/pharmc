import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Clock,
  FileSpreadsheet,
  Presentation,
  Sparkles,
  CheckCircle2,
  Brain,
  TrendingUp,
  Shield,
  Users,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  FileDown,
} from "lucide-react";

interface ReportSection {
  title: string;
  icon: React.ReactNode;
  preview: string;
  expanded?: boolean;
}

const reportSections: ReportSection[] = [
  {
    title: "Executive Summary",
    icon: <Brain className="w-4 h-4" />,
    preview: "This analysis identifies 4 high-potential repurposing opportunities for GLP-1 agonist molecules, with Compound A-7823 showing the strongest commercial viability (Score: 92/100). The global market opportunity is estimated at $4.2B with 8.3% CAGR through 2030. Regulatory pathways are favorable with 505(b)(2) route available for all candidates.",
  },
  {
    title: "Market Intelligence",
    icon: <TrendingUp className="w-4 h-4" />,
    preview: "The target market demonstrates robust growth fundamentals with $4.2B current valuation expanding to projected $7.5B by 2030. Competitive intensity remains moderate with top 3 players controlling 62% share. Pricing power is strong in specialty segments with average treatment costs of $15,000-$45,000 annually.",
  },
  {
    title: "Patent Landscape",
    icon: <FileText className="w-4 h-4" />,
    preview: "Analysis of 234 active patents reveals significant white space in novel delivery mechanisms and combination therapies. Key patent cliff in 2027 (31 patents, $5.8B value) creates repurposing window. Freedom-to-operate is clear for 3 of 4 identified candidates.",
  },
  {
    title: "Clinical Evidence",
    icon: <Users className="w-4 h-4" />,
    preview: "Review of 47 active trials indicates strong efficacy signals with 68% Phase 3 success rate for the class. Unmet need identified in NASH indication with high patient burden (280K) but low trial activity (23 trials). Safety profile is well-established with manageable GI side effects.",
  },
  {
    title: "Regulatory Strategy",
    icon: <Shield className="w-4 h-4" />,
    preview: "505(b)(2) pathway available for all candidates, reducing development timeline by 2-3 years. Fast Track and Breakthrough Therapy designations possible for NASH indication. No significant regulatory hurdles identified. Estimated approval timeline: 3-4 years from IND filing.",
  },
  {
    title: "Risk Assessment",
    icon: <AlertTriangle className="w-4 h-4" />,
    preview: "Overall risk profile: Moderate. Key risks include competitive entrants (2 Phase 3 assets from major pharma), supply chain concentration in India (45% of API), and pricing pressure from payer negotiations. Mitigation strategies outlined for each risk category.",
  },
];

const previousReports = [
  {
    title: "GLP-1 Agonist Repurposing Analysis",
    date: "2024-01-15",
    status: "completed",
    insights: 24,
  },
  {
    title: "CAR-T Patent Landscape Report",
    date: "2024-01-12",
    status: "completed",
    insights: 18,
  },
  {
    title: "Rare Disease Market Assessment",
    date: "2024-01-10",
    status: "completed",
    insights: 31,
  },
  {
    title: "Biosimilar Regulatory Pathway",
    date: "2024-01-08",
    status: "completed",
    insights: 15,
  },
];

export default function Reports() {
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleExport = async (format: string) => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsGenerating(false);
    // In a real app, this would trigger file download
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate and export comprehensive research reports
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="glass" className="gap-2" onClick={() => handleExport("pdf")}>
            <FileDown className="w-4 h-4" />
            PDF
          </Button>
          <Button variant="glass" className="gap-2" onClick={() => handleExport("xlsx")}>
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </Button>
          <Button variant="glow" className="gap-2" onClick={() => handleExport("pptx")}>
            <Presentation className="w-4 h-4" />
            PowerPoint
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Report Preview */}
        <Card variant="glass" className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Live Report Preview
            </h2>
            <span className="text-xs text-muted-foreground">
              Last updated: Just now
            </span>
          </div>

          {/* Report Header in Preview */}
          <div className="p-6 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Generated Report</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Pharmaceutical Repurposing Opportunity Analysis
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Comprehensive multi-agent research findings for GLP-1 agonist candidates
            </p>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                8 AI agents analyzed
              </div>
            </div>
          </div>

          {/* Report Sections */}
          <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
            {reportSections.map((section, index) => (
              <div
                key={index}
                className="border border-border/50 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    {section.icon}
                  </div>
                  <span className="flex-1 font-medium text-foreground">
                    {section.title}
                  </span>
                  {expandedSections.includes(index) ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                {expandedSections.includes(index) && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3 mx-4 mb-2">
                    {section.preview}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Export Options */}
          <Card variant="glow" className="p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Export Options
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => handleExport("pdf")}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                  <FileDown className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">PDF Report</p>
                  <p className="text-xs text-muted-foreground">
                    Full formatted document
                  </p>
                </div>
              </button>
              <button
                onClick={() => handleExport("xlsx")}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">Excel Data</p>
                  <p className="text-xs text-muted-foreground">
                    Raw data and tables
                  </p>
                </div>
              </button>
              <button
                onClick={() => handleExport("pptx")}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <Presentation className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">PowerPoint</p>
                  <p className="text-xs text-muted-foreground">
                    Executive presentation
                  </p>
                </div>
              </button>
            </div>
          </Card>

          {/* Previous Reports */}
          <Card variant="glass" className="p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Previous Reports
            </h3>
            <div className="space-y-3">
              {previousReports.map((report, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-foreground text-sm line-clamp-1">
                      {report.title}
                    </p>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{report.date}</span>
                    <span>•</span>
                    <span>{report.insights} insights</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card variant="glass" className="p-5">
            <h3 className="font-semibold text-foreground mb-4">Report Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <p className="text-2xl font-bold text-primary">6</p>
                <p className="text-xs text-muted-foreground">Sections</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <p className="text-2xl font-bold text-primary">24</p>
                <p className="text-xs text-muted-foreground">Insights</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <p className="text-2xl font-bold text-primary">8</p>
                <p className="text-xs text-muted-foreground">Charts</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <p className="text-2xl font-bold text-primary">47</p>
                <p className="text-xs text-muted-foreground">Sources</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
