import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Calendar,
  Target,
  Sparkles,
  Download,
  Filter,
  ChevronDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const marketData = [
  { year: "2020", market: 2.8, growth: 5.2 },
  { year: "2021", market: 3.1, growth: 6.1 },
  { year: "2022", market: 3.5, growth: 7.3 },
  { year: "2023", market: 3.9, growth: 8.1 },
  { year: "2024", market: 4.2, growth: 8.3 },
  { year: "2025", market: 4.6, growth: 8.5 },
  { year: "2026", market: 5.1, growth: 8.7 },
  { year: "2027", market: 5.6, growth: 8.9 },
  { year: "2028", market: 6.2, growth: 9.1 },
  { year: "2029", market: 6.8, growth: 9.3 },
  { year: "2030", market: 7.5, growth: 9.5 },
];

const patentExpiryData = [
  { year: "2024", patents: 12, value: 2.1 },
  { year: "2025", patents: 8, value: 1.4 },
  { year: "2026", patents: 23, value: 4.2 },
  { year: "2027", patents: 31, value: 5.8 },
  { year: "2028", patents: 18, value: 3.2 },
  { year: "2029", patents: 14, value: 2.6 },
  { year: "2030", patents: 9, value: 1.8 },
];

const trialVsBurdenData = [
  { indication: "Obesity", trials: 47, burden: 650 },
  { indication: "NASH", trials: 23, burden: 280 },
  { indication: "Diabetes", trials: 156, burden: 530 },
  { indication: "Cardio", trials: 89, burden: 420 },
  { indication: "Neuro", trials: 34, burden: 180 },
];

const competitorShareData = [
  { name: "Company A", value: 28, color: "#00d4aa" },
  { name: "Company B", value: 22, color: "#00b4d8" },
  { name: "Company C", value: 18, color: "#9333ea" },
  { name: "Company D", value: 12, color: "#f59e0b" },
  { name: "Others", value: 20, color: "#6b7280" },
];

const opportunityData = [
  { name: "High Opportunity", value: 35, fill: "#10b981" },
  { name: "Medium Opportunity", value: 45, fill: "#f59e0b" },
  { name: "Low Opportunity", value: 20, fill: "#6b7280" },
];

const topOpportunities = [
  {
    molecule: "Compound A-7823",
    indication: "NASH",
    score: 92,
    competition: "Low",
    patentStatus: "Clear",
  },
  {
    molecule: "Compound B-4521",
    indication: "Obesity",
    score: 87,
    competition: "Medium",
    patentStatus: "Licensing Required",
  },
  {
    molecule: "Compound C-9102",
    indication: "Metabolic",
    score: 84,
    competition: "Low",
    patentStatus: "Clear",
  },
  {
    molecule: "Compound D-3847",
    indication: "Cardio",
    score: 79,
    competition: "High",
    patentStatus: "Clear",
  },
];

export default function VisualInsights() {
  const [activeTab, setActiveTab] = useState("market");
  const chartsContainerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: "market", label: "Market", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "patents", label: "Patents", icon: <Calendar className="w-4 h-4" /> },
    { id: "clinical", label: "Clinical", icon: <Activity className="w-4 h-4" /> },
    { id: "opportunities", label: "Opportunities", icon: <Target className="w-4 h-4" /> },
  ];

  const handleExportPDF = async () => {
    if (!chartsContainerRef.current) return;

    try {
      const canvas = await html2canvas(chartsContainerRef.current, {
        backgroundColor: "rgba(10, 10, 20, 1)",
        scale: 2,
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? "portrait" : "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      let heightLeft = imgHeight;
      let position = 0;

      // Add title page
      pdf.setFontSize(24);
      pdf.setTextColor(0, 212, 170);
      pdf.text("Visual Insights Report", pageWidth / 2, 30, { align: "center" });

      pdf.setFontSize(12);
      pdf.setTextColor(156, 163, 175);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 40, {
        align: "center",
      });

      pdf.addPage();

      // Add charts
      const imgData = canvas.toDataURL("image/png");
      while (heightLeft >= 0) {
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
        position = heightLeft - imgHeight;
        if (heightLeft > 0) {
          pdf.addPage();
        }
      }

      pdf.save("visual-insights-report.pdf");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Error exporting PDF. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Visual Insights
          </h1>
          <p className="text-muted-foreground mt-1">
            Interactive data visualizations from AI analysis
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="glass" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button variant="glow" className="gap-2" onClick={handleExportPDF}>
            <Download className="w-4 h-4" />
            Export Charts
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "glow" : "glass"}
            onClick={() => setActiveTab(tab.id)}
            className="gap-2"
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Charts Container for Export */}
      <div ref={chartsContainerRef} className="bg-background p-8 rounded-lg">

      {/* Market Tab */}
      {activeTab === "market" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Size & Growth */}
          <Card variant="glass" className="p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Market Size & Growth Projection
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData}>
                  <defs>
                    <linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="year" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 11%)",
                      border: "1px solid hsl(222, 30%, 20%)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="market"
                    stroke="#00d4aa"
                    strokeWidth={2}
                    fill="url(#marketGradient)"
                    name="Market Size ($B)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">$4.2B</p>
                <p className="text-xs text-muted-foreground">2024 Market</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">$7.5B</p>
                <p className="text-xs text-muted-foreground">2030 Forecast</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400">8.3%</p>
                <p className="text-xs text-muted-foreground">CAGR</p>
              </div>
            </div>
          </Card>

          {/* Competitor Market Share */}
          <Card variant="glass" className="p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Competitor Market Share
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={competitorShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {competitorShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 11%)",
                      border: "1px solid hsl(222, 30%, 20%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span style={{ color: "#9ca3af", fontSize: "12px" }}>{value}</span>
                    )}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Patents Tab */}
      {activeTab === "patents" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="glass" className="p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Patent Expiry Timeline
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patentExpiryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="year" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 11%)",
                      border: "1px solid hsl(222, 30%, 20%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="patents" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Patents Expiring" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <p className="text-sm text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <strong>Key Insight:</strong> 2027 shows highest patent cliff opportunity (31 patents, $5.8B value)
              </p>
            </div>
          </Card>

          <Card variant="glass" className="p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Patent Value by Year ($B)
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={patentExpiryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="year" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 11%)",
                      border: "1px solid hsl(222, 30%, 20%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#00d4aa"
                    strokeWidth={3}
                    dot={{ fill: "#00d4aa", strokeWidth: 2, r: 5 }}
                    name="Market Value ($B)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Clinical Tab */}
      {activeTab === "clinical" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="glass" className="p-5 lg:col-span-2">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Clinical Trials vs Patient Burden by Indication
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trialVsBurdenData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                  <YAxis dataKey="indication" type="category" stroke="#9ca3af" fontSize={12} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 11%)",
                      border: "1px solid hsl(222, 30%, 20%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="trials" fill="#00d4aa" name="Active Trials" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="burden" fill="#9333ea" name="Patient Burden (K)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-sm text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <strong>Opportunity:</strong> NASH shows high patient burden (280K) with relatively low trial activity (23 trials) - potential white space
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Opportunities Tab */}
      {activeTab === "opportunities" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card variant="glass" className="p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Opportunity Distribution
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={opportunityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {opportunityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card variant="glow" className="p-5 lg:col-span-2">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Top Repurposing Opportunities
              </h3>
              <div className="space-y-3">
                {topOpportunities.map((opp, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{opp.molecule}</p>
                      <p className="text-xs text-muted-foreground">{opp.indication}</p>
                    </div>
                    <div className="text-center px-3">
                      <p className="text-lg font-bold text-primary">{opp.score}</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                    <div className="text-center px-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          opp.competition === "Low"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : opp.competition === "Medium"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-rose-500/20 text-rose-400"
                        }`}
                      >
                        {opp.competition}
                      </span>
                    </div>
                    <div className="text-center px-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          opp.patentStatus === "Clear"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {opp.patentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
