import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Send,
  Sparkles,
  FlaskConical,
  Globe,
  Target,
  FileOutput,
  Loader2,
  Bot,
  Brain,
  ChevronDown,
  Lightbulb,
  Zap,
} from "lucide-react";

const therapyAreas = [
  "Oncology",
  "Cardiovascular",
  "Neurology",
  "Immunology",
  "Rare Diseases",
  "Metabolic",
  "Infectious Disease",
  "Respiratory",
];

const geographies = [
  "Global",
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East",
];

const outputTypes = [
  { value: "opportunity", label: "Opportunity Analysis", icon: <Target className="w-4 h-4" /> },
  { value: "competition", label: "Competitive Intelligence", icon: <Globe className="w-4 h-4" /> },
  { value: "risk", label: "Risk Assessment", icon: <FlaskConical className="w-4 h-4" /> },
];

const sampleQueries = [
  "Find repurposing opportunities for Metformin in oncology indications",
  "Analyze GLP-1 agonist landscape for NASH treatment",
  "Evaluate JAK inhibitor patents expiring in the next 3 years",
  "Identify rare disease molecules with orphan drug potential",
];

export default function QueryBuilder() {
  const navigate = useNavigate();
  const [queryMode, setQueryMode] = useState<"chat" | "structured">("chat");
  const [chatInput, setChatInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Structured query state
  const [molecule, setMolecule] = useState("");
  const [therapyArea, setTherapyArea] = useState("");
  const [geography, setGeography] = useState("Global");
  const [outputType, setOutputType] = useState("opportunity");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate processing
    await new Promise((r) => setTimeout(r, 1000));
    
    // Navigate to agent monitor
    navigate("/dashboard/agents", { 
      state: { 
        query: queryMode === "chat" ? chatInput : {
          molecule,
          therapyArea,
          geography,
          outputType,
        }
      }
    });
  };

  const handleSampleQuery = (query: string) => {
    setChatInput(query);
    setQueryMode("chat");
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Research</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Start New Research Query
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Use natural language or structured inputs to define your research parameters.
          Our AI agents will orchestrate a comprehensive analysis.
        </p>
      </div>

      {/* Query Mode Toggle */}
      <div className="flex justify-center gap-2 mb-6">
        <Button
          variant={queryMode === "chat" ? "glow" : "glass"}
          onClick={() => setQueryMode("chat")}
          className="gap-2"
        >
          <Bot className="w-4 h-4" />
          Natural Language
        </Button>
        <Button
          variant={queryMode === "structured" ? "glow" : "glass"}
          onClick={() => setQueryMode("structured")}
          className="gap-2"
        >
          <FileOutput className="w-4 h-4" />
          Structured Query
        </Button>
      </div>

      {/* Chat Mode */}
      {queryMode === "chat" && (
        <Card variant="glass" className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <Input
                variant="glass"
                placeholder="Describe your research question in natural language..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="pl-12 pr-12 py-6 text-base"
              />
              <Button
                type="submit"
                variant="glow"
                size="icon"
                disabled={!chatInput.trim() || isSubmitting}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </form>

          {/* Sample Queries */}
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Try these example queries:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sampleQueries.map((query) => (
                <button
                  key={query}
                  onClick={() => handleSampleQuery(query)}
                  className="text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/50 text-sm text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-primary/30"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Structured Mode */}
      {queryMode === "structured" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Molecule / MoA */}
            <Card variant="glass" className="p-5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                <FlaskConical className="w-4 h-4 text-primary" />
                Molecule / Mechanism of Action
              </label>
              <Input
                variant="glass"
                placeholder="e.g., Metformin, GLP-1 agonist, JAK inhibitor..."
                value={molecule}
                onChange={(e) => setMolecule(e.target.value)}
              />
            </Card>

            {/* Therapy Area */}
            <Card variant="glass" className="p-5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                <Target className="w-4 h-4 text-primary" />
                Therapy Area
              </label>
              <div className="relative">
                <select
                  value={therapyArea}
                  onChange={(e) => setTherapyArea(e.target.value)}
                  className="w-full h-10 px-4 pr-10 rounded-lg bg-muted/50 border border-border/50 text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select therapy area...</option>
                  {therapyAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </Card>

            {/* Geography */}
            <Card variant="glass" className="p-5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                <Globe className="w-4 h-4 text-primary" />
                Geography
              </label>
              <div className="relative">
                <select
                  value={geography}
                  onChange={(e) => setGeography(e.target.value)}
                  className="w-full h-10 px-4 pr-10 rounded-lg bg-muted/50 border border-border/50 text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {geographies.map((geo) => (
                    <option key={geo} value={geo}>
                      {geo}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </Card>

            {/* Output Type */}
            <Card variant="glass" className="p-5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                <FileOutput className="w-4 h-4 text-primary" />
                Output Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {outputTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setOutputType(type.value)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      outputType === type.value
                        ? "bg-primary/20 border border-primary/50 text-primary"
                        : "bg-muted/30 border border-transparent text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex justify-center mb-1">{type.icon}</div>
                    <p className="text-xs font-medium">{type.label.split(" ")[0]}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="glow"
              size="xl"
              disabled={(!molecule && !therapyArea) || isSubmitting}
              className="gap-2 min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Launch Research
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card variant="glass" className="p-4 text-center">
          <div className="w-10 h-10 mx-auto rounded-lg bg-primary/20 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">8 AI Agents</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Working in parallel to analyze your query
          </p>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <div className="w-10 h-10 mx-auto rounded-lg bg-cyan-500/20 flex items-center justify-center mb-3">
            <Search className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">47+ Data Sources</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Comprehensive coverage across databases
          </p>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <div className="w-10 h-10 mx-auto rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
            <FileOutput className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">Multiple Formats</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Export as PDF, Excel, or PowerPoint
          </p>
        </Card>
      </div>
    </div>
  );
}
