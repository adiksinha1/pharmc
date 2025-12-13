import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  FileSearch,
  Users,
  Globe,
  Shield,
  FlaskConical,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Star,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface InsightItem {
  title: string;
  detail: string;
  source: string;
  confidence: "high" | "medium" | "low";
  isOpportunity?: boolean;
  isRisk?: boolean;
}

const tabsData: Record<string, { icon: React.ReactNode; color: string; insights: InsightItem[] }> = {
  market: {
    icon: <TrendingUp className="w-4 h-4" />,
    color: "text-emerald-400",
    insights: [
      {
        title: "Global market projected to reach $7.5B by 2030",
        detail: "The GLP-1 agonist market demonstrates robust growth with 8.3% CAGR. Key drivers include rising obesity prevalence and expanding indications beyond diabetes.",
        source: "IQVIA Market Report Q4 2023",
        confidence: "high",
        isOpportunity: true,
      },
      {
        title: "NASH indication represents $4.2B untapped opportunity",
        detail: "Non-alcoholic steatohepatitis remains significantly underserved with no approved therapies. GLP-1 agonists show promising Phase 2 data for this indication.",
        source: "Evaluate Pharma Analysis",
        confidence: "high",
        isOpportunity: true,
      },
      {
        title: "Top 3 competitors control 62% market share",
        detail: "Novo Nordisk (28%), Eli Lilly (22%), and Sanofi (12%) dominate the current landscape. However, patent expirations in 2026-2028 will open opportunities.",
        source: "Company Annual Reports",
        confidence: "high",
      },
      {
        title: "Pricing pressure increasing in EU markets",
        detail: "Reference pricing and HTA assessments are leading to 15-20% price erosion in European markets. US pricing remains stable.",
        source: "Payer Intelligence Database",
        confidence: "medium",
        isRisk: true,
      },
    ],
  },
  patents: {
    icon: <FileSearch className="w-4 h-4" />,
    color: "text-amber-400",
    insights: [
      {
        title: "234 active patents identified in target space",
        detail: "Comprehensive patent landscape analysis reveals concentrated IP in formulation patents, with opportunities in novel delivery mechanisms and combination products.",
        source: "USPTO, EPO, WIPO Databases",
        confidence: "high",
      },
      {
        title: "Major patent cliff in 2027 ($5.8B value)",
        detail: "31 patents expiring in 2027 covering key molecules including semaglutide analogs. This creates a significant window for biosimilar and repurposed product entry.",
        source: "Patent Analytics Report",
        confidence: "high",
        isOpportunity: true,
      },
      {
        title: "White space identified in oral delivery systems",
        detail: "Limited patent protection for novel oral delivery formulations. Opportunity for differentiation through enhanced bioavailability technologies.",
        source: "IP Landscape Analysis",
        confidence: "medium",
        isOpportunity: true,
      },
      {
        title: "Freedom-to-operate confirmed for Compound A-7823",
        detail: "Comprehensive FTO analysis confirms no blocking patents for lead candidate. Recommended to proceed with development planning.",
        source: "Legal IP Review",
        confidence: "high",
      },
    ],
  },
  clinical: {
    icon: <Users className="w-4 h-4" />,
    color: "text-purple-400",
    insights: [
      {
        title: "47 active clinical trials in target indications",
        detail: "Current pipeline includes 12 Phase 3, 23 Phase 2, and 12 Phase 1 trials. Obesity and NASH are the most active areas of investigation.",
        source: "ClinicalTrials.gov",
        confidence: "high",
      },
      {
        title: "Phase 3 success rate of 68% for GLP-1 class",
        detail: "Historical analysis shows favorable regulatory outcomes. Key success factors include robust efficacy endpoints and manageable safety profiles.",
        source: "FDA Approval Database",
        confidence: "high",
      },
      {
        title: "Median trial duration: 24 months",
        detail: "Phase 2/3 trials typically require 18-30 months for primary endpoint readout. Accelerated pathways may reduce timeline by 6-12 months.",
        source: "Trial Duration Analysis",
        confidence: "medium",
      },
      {
        title: "Competitor Phase 3 readout expected Q3 2024",
        detail: "Novo Nordisk's next-generation GLP-1 candidate expected to report topline results, which may impact competitive landscape.",
        source: "Company Press Releases",
        confidence: "high",
        isRisk: true,
      },
    ],
  },
  exim: {
    icon: <Globe className="w-4 h-4" />,
    color: "text-cyan-400",
    insights: [
      {
        title: "Primary API sourcing from India (45%)",
        detail: "Active pharmaceutical ingredient supply is concentrated in India, with China accounting for 28%. Diversification recommended for supply chain resilience.",
        source: "UN Comtrade Database",
        confidence: "high",
      },
      {
        title: "Import volume increased 23% YoY",
        detail: "Strong demand signals from increasing import volumes across major markets. US imports up 31%, EU up 18%.",
        source: "FDA Import Data",
        confidence: "high",
        isOpportunity: true,
      },
      {
        title: "Supply chain risk rated: Moderate",
        detail: "Single-source suppliers for 2 key intermediates. Recommended to qualify secondary suppliers before commercial scale-up.",
        source: "Supply Chain Intelligence",
        confidence: "medium",
        isRisk: true,
      },
    ],
  },
  regulatory: {
    icon: <Shield className="w-4 h-4" />,
    color: "text-rose-400",
    insights: [
      {
        title: "505(b)(2) pathway available",
        detail: "Regulatory strategy confirms eligibility for 505(b)(2) submission, leveraging existing safety data for accelerated development timeline.",
        source: "FDA Guidance Documents",
        confidence: "high",
        isOpportunity: true,
      },
      {
        title: "Priority Review designation possible",
        detail: "NASH indication may qualify for Priority Review given unmet medical need. This would reduce review timeline from 10 months to 6 months.",
        source: "Regulatory Intelligence",
        confidence: "medium",
        isOpportunity: true,
      },
      {
        title: "No significant safety concerns flagged",
        detail: "Review of FDA adverse event database shows manageable safety profile for the class. GI side effects are dose-dependent and generally transient.",
        source: "FDA FAERS Database",
        confidence: "high",
      },
    ],
  },
  scientific: {
    icon: <FlaskConical className="w-4 h-4" />,
    color: "text-blue-400",
    insights: [
      {
        title: "1,247 relevant publications analyzed",
        detail: "Comprehensive literature review identified key mechanism-of-action insights and supporting efficacy data from preclinical and clinical studies.",
        source: "PubMed, Elsevier, Nature",
        confidence: "high",
      },
      {
        title: "Novel dual-agonist mechanism discovered in 2023",
        detail: "Recent publications describe synergistic effects of GLP-1/GIP dual agonism with superior weight loss outcomes compared to GLP-1 alone.",
        source: "Nature Medicine 2023",
        confidence: "high",
        isOpportunity: true,
      },
      {
        title: "Strong efficacy signals in liver fibrosis",
        detail: "Emerging evidence supports GLP-1 effects on hepatic steatosis and fibrosis, supporting NASH indication development.",
        source: "Hepatology Journal",
        confidence: "medium",
      },
    ],
  },
};

const tabs = [
  { id: "market", label: "Market" },
  { id: "patents", label: "Patents" },
  { id: "clinical", label: "Clinical Trials" },
  { id: "exim", label: "Trade (EXIM)" },
  { id: "regulatory", label: "Regulatory" },
  { id: "scientific", label: "Scientific" },
];

export default function ResultsView() {
  const [activeTab, setActiveTab] = useState("market");
  const [expandedItems, setExpandedItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const currentData = tabsData[activeTab];
  const opportunityCount = currentData.insights.filter((i) => i.isOpportunity).length;
  const riskCount = currentData.insights.filter((i) => i.isRisk).length;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            Research Results
          </h1>
          <p className="text-muted-foreground mt-1">
            Detailed insights organized by category
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "glow" : "glass"}
            onClick={() => {
              setActiveTab(tab.id);
              setExpandedItems([0]);
            }}
            className="gap-2 flex-shrink-0"
          >
            <span className={tabsData[tab.id].color}>{tabsData[tab.id].icon}</span>
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="glass" className="p-4">
          <p className="text-2xl font-bold text-foreground">{currentData.insights.length}</p>
          <p className="text-sm text-muted-foreground">Total Insights</p>
        </Card>
        <Card variant="glass" className="p-4">
          <p className="text-2xl font-bold text-emerald-400">{opportunityCount}</p>
          <p className="text-sm text-muted-foreground">Opportunities</p>
        </Card>
        <Card variant="glass" className="p-4">
          <p className="text-2xl font-bold text-rose-400">{riskCount}</p>
          <p className="text-sm text-muted-foreground">Risks Flagged</p>
        </Card>
        <Card variant="glass" className="p-4">
          <p className="text-2xl font-bold text-primary">
            {currentData.insights.filter((i) => i.confidence === "high").length}
          </p>
          <p className="text-sm text-muted-foreground">High Confidence</p>
        </Card>
      </div>

      {/* Insights List */}
      <Card variant="glass" className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <span className={currentData.color}>{currentData.icon}</span>
            {tabs.find((t) => t.id === activeTab)?.label} Intelligence
          </h2>
        </div>

        <div className="divide-y divide-border/30">
          {currentData.insights.map((insight, index) => (
            <div key={index} className="hover:bg-muted/20 transition-colors">
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-start gap-4 p-4 text-left"
              >
                <div className="mt-1">
                  {insight.isOpportunity ? (
                    <Star className="w-4 h-4 text-emerald-400" />
                  ) : insight.isRisk ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">
                    {insight.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        insight.confidence === "high"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : insight.confidence === "medium"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {insight.confidence} confidence
                    </span>
                    {insight.isOpportunity && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        Opportunity
                      </span>
                    )}
                    {insight.isRisk && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/20 text-rose-400">
                        Risk
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {expandedItems.includes(index) ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {expandedItems.includes(index) && (
                <div className="px-4 pb-4 ml-8 space-y-3 animate-fade-in">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.detail}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ExternalLink className="w-3 h-3" />
                    <span>Source: {insight.source}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Summary */}
      <Card variant="glow" className="p-6">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Key Takeaways for {tabs.find((t) => t.id === activeTab)?.label}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <h4 className="font-medium text-emerald-400 text-sm mb-2">Top Opportunity</h4>
            <p className="text-sm text-muted-foreground">
              {currentData.insights.find((i) => i.isOpportunity)?.title || "No specific opportunity flagged"}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <h4 className="font-medium text-amber-400 text-sm mb-2">Key Consideration</h4>
            <p className="text-sm text-muted-foreground">
              {currentData.insights.find((i) => i.isRisk)?.title || currentData.insights[currentData.insights.length - 1]?.title}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
