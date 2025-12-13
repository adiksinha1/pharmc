import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Send,
  Loader2,
  TrendingUp,
  FileText,
  FlaskConical,
  Sparkles,
  CheckCircle,
} from "lucide-react";

const mockQueries = [
  "Which respiratory diseases show low competition but high demand in India?",
  "Find repurposing opportunities for Metformin",
  "Analyze patent landscape for JAK inhibitors",
  "Show clinical trial activity for autoimmune conditions",
];

interface AgentResult {
  agent: string;
  source: string;
  status: "loading" | "complete";
  output: string;
  icon: typeof TrendingUp;
}

const mockResults: AgentResult[] = [
  {
    agent: "IQVIA Insights",
    source: "IQVIA Database",
    status: "complete",
    output: "Market size: $2.3B | Growth: 12% CAGR | Competition: Low-Medium",
    icon: TrendingUp,
  },
  {
    agent: "Patent Landscape",
    source: "USPTO Clone",
    status: "complete",
    output: "3 active patents | 2 expiring 2025 | FTO available for 4 indications",
    icon: FileText,
  },
  {
    agent: "Clinical Trials",
    source: "ClinicalTrials.gov",
    status: "complete",
    output: "12 ongoing trials | 5 Phase III | 3 targeting respiratory conditions",
    icon: FlaskConical,
  },
];

export function DemoSection() {
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<AgentResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsProcessing(true);
    setShowResults(true);
    setResults([]);

    // Simulate agent processing
    for (let i = 0; i < mockResults.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setResults((prev) => [...prev, { ...mockResults[i], status: "loading" }]);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setResults((prev) =>
        prev.map((r, idx) =>
          idx === i ? { ...r, status: "complete" } : r
        )
      );
    }

    setIsProcessing(false);
  };

  const handleQuickQuery = (q: string) => {
    setQuery(q);
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Live Demo
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Mock Data Integration & System Simulation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the power of agentic AI with our interactive demo.
            Try a sample query and watch the agents work together.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Query Input */}
          <Card variant="glass" className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    variant="glass"
                    inputSize="lg"
                    placeholder="Enter your research query..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    variant="glow"
                    size="lg"
                    disabled={isProcessing || !query.trim()}
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    Analyze
                  </Button>
                </div>

                {/* Quick Queries */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground py-1">
                    Try:
                  </span>
                  {mockQueries.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickQuery(q)}
                      className="px-3 py-1 text-sm bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-full transition-colors border border-border/50 hover:border-border"
                    >
                      {q.length > 40 ? q.slice(0, 40) + "..." : q}
                    </button>
                  ))}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {showResults && (
            <div className="space-y-4 animate-slide-up">
              {/* Processing Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {isProcessing ? "Processing Query..." : "Analysis Complete"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isProcessing
                      ? "Agents are gathering and analyzing data"
                      : `Found insights from ${results.length} data sources`}
                  </p>
                </div>
              </div>

              {/* Agent Results */}
              <div className="space-y-3">
                {results.map((result, idx) => (
                  <AgentResultCard key={idx} result={result} index={idx} />
                ))}
              </div>

              {/* Summary Card */}
              {!isProcessing && results.length > 0 && (
                <Card variant="glow" className="mt-6 animate-scale-in">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2">
                          Opportunity Summary
                        </h4>
                        <p className="text-muted-foreground mb-4">
                          Based on the analysis, there are significant repurposing
                          opportunities in the respiratory segment with low
                          competition and favorable patent landscape. Recommended
                          to proceed with detailed feasibility assessment.
                        </p>
                        <div className="flex gap-3">
                          <Button variant="glow" size="sm">
                            Download Report (PDF)
                          </Button>
                          <Button variant="glass" size="sm">
                            Export to Excel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function AgentResultCard({
  result,
  index,
}: {
  result: AgentResult;
  index: number;
}) {
  const Icon = result.icon;

  return (
    <Card
      variant="glass"
      className="animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-foreground">{result.agent}</span>
              <span className="text-xs text-muted-foreground">
                → {result.source}
              </span>
            </div>
            {result.status === "loading" ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analyzing data...</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{result.output}</p>
            )}
          </div>
          {result.status === "complete" && (
            <CheckCircle className="w-5 h-5 text-primary" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
