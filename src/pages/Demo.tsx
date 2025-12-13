import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Loader2,
  Brain,
  FileSearch,
  TrendingUp,
  Shield,
  FlaskConical,
  Users,
  Database,
  Sparkles,
  Zap,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant" | "agent";
  content: string;
  agentName?: string;
  agentIcon?: React.ReactNode;
  timestamp: Date;
}

interface Agent {
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const agents: Agent[] = [
  { name: "Scientific Agent", icon: <FlaskConical className="w-4 h-4" />, color: "text-cyan-400", description: "Analyzing research papers..." },
  { name: "Market Agent", icon: <TrendingUp className="w-4 h-4" />, color: "text-emerald-400", description: "Evaluating market trends..." },
  { name: "Regulatory Agent", icon: <Shield className="w-4 h-4" />, color: "text-amber-400", description: "Checking FDA guidelines..." },
  { name: "Clinical Agent", icon: <Users className="w-4 h-4" />, color: "text-purple-400", description: "Reviewing clinical trials..." },
  { name: "IP Agent", icon: <FileSearch className="w-4 h-4" />, color: "text-rose-400", description: "Searching patent databases..." },
  { name: "Data Agent", icon: <Database className="w-4 h-4" />, color: "text-blue-400", description: "Processing molecular data..." },
];

const sampleQueries = [
  "Find GLP-1 agonist candidates for obesity treatment",
  "Analyze CRISPR patent landscape for gene therapy",
  "Evaluate market potential for rare disease drugs",
  "Review FDA approval pathway for biosimilars",
];

const mockResponses: Record<string, string> = {
  "glp-1": `## GLP-1 Agonist Analysis for Obesity Treatment

### Key Findings:

**Promising Candidates Identified:**
1. **Compound A-7823** - Novel dual GLP-1/GIP agonist with 23% greater weight reduction vs. semaglutide in preclinical trials
2. **Compound B-4521** - Oral formulation with enhanced bioavailability (42% improvement)
3. **Compound C-9102** - Once-monthly injectable with sustained release profile

**Market Opportunity:**
- Global obesity drug market projected to reach $54B by 2030
- GLP-1 class represents 68% market share
- Unmet need in oral formulations and combination therapies

**Regulatory Pathway:**
- FDA Fast Track designation likely for dual agonists
- Phase 2 data requirements: N≥500, 52-week duration
- Key endpoints: ≥5% weight loss, cardiovascular safety

**Recommended Next Steps:**
1. Prioritize Compound A-7823 for lead optimization
2. Initiate IND-enabling studies within 6 months
3. Engage FDA for pre-IND meeting`,
  "crispr": `## CRISPR Patent Landscape Analysis

### Patent Distribution:
- **Total Active Patents:** 12,847
- **Key Jurisdictions:** US (45%), EU (28%), China (18%)
- **Freedom to Operate:** Moderate complexity

### Major Patent Holders:
1. Broad Institute - 234 core patents
2. UC Berkeley - 189 foundational patents
3. Caribou Biosciences - 156 therapeutic patents

### White Space Opportunities:
- Base editing for liver diseases
- In vivo delivery systems
- Off-target prediction algorithms

### Risk Assessment:**
- Licensing costs estimated at 3-5% royalty
- Cross-licensing agreements recommended`,
  "market": `## Rare Disease Drug Market Analysis

### Market Overview:
- Current market size: $178B (2024)
- CAGR: 11.2% through 2030
- Orphan drug approvals: 89 in 2023

### Top Therapeutic Areas:
1. Oncology rare diseases - 34%
2. Neurological disorders - 22%
3. Metabolic diseases - 18%

### Pricing Analysis:
- Average annual treatment cost: $150,000-$500,000
- Payer acceptance improving with outcomes-based contracts

### Recommendation:
Focus on ultra-rare diseases (<1:50,000 prevalence) with clear endpoints`,
  "fda": `## FDA Biosimilar Approval Pathway

### Key Requirements:

**Analytical Studies:**
- Extensive structural characterization
- Functional assays (binding, potency)
- Reference product comparison

**Nonclinical Studies:**
- Animal PK/PD studies
- Toxicology assessment (case-by-case)

**Clinical Studies:**
- PK/PD equivalence study
- Immunogenicity assessment
- At least one clinical efficacy trial

### Timeline Estimate:
- Development: 5-8 years
- Approval: 10-12 months post-submission
- Cost: $100-250M (vs. $1B+ for originator)

### Interchangeability Pathway:
- Requires switching studies
- Additional 12-18 months
- Market advantage for pharmacy substitution`,
};

export default function Demo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to the Agentic AI Pharma Platform. I'm the **Master Orchestrator AI**, coordinating 6 specialized agents to accelerate your pharmaceutical research. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAgents, setActiveAgents] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const simulateAgentProcessing = async (query: string) => {
    setIsProcessing(true);
    
    // Simulate agents activating one by one
    for (let i = 0; i < agents.length; i++) {
      setActiveAgents((prev) => [...prev, i]);
      await new Promise((r) => setTimeout(r, 400));
    }

    // Add agent working messages
    const agentMessages: Message[] = [];
    for (let i = 0; i < 3; i++) {
      const agent = agents[i];
      agentMessages.push({
        id: `agent-${i}-${Date.now()}`,
        role: "agent",
        content: agent.description,
        agentName: agent.name,
        agentIcon: agent.icon,
        timestamp: new Date(),
      });
    }

    setMessages((prev) => [...prev, ...agentMessages]);
    await new Promise((r) => setTimeout(r, 1500));

    // Determine response based on query
    let response = mockResponses["glp-1"];
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes("crispr") || lowerQuery.includes("patent")) {
      response = mockResponses["crispr"];
    } else if (lowerQuery.includes("market") || lowerQuery.includes("rare")) {
      response = mockResponses["market"];
    } else if (lowerQuery.includes("fda") || lowerQuery.includes("biosimilar") || lowerQuery.includes("approval")) {
      response = mockResponses["fda"];
    }

    // Add final response
    setMessages((prev) => [
      ...prev,
      {
        id: `response-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      },
    ]);

    setIsProcessing(false);
    setActiveAgents([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    simulateAgentProcessing(input);
  };

  const handleSampleQuery = (query: string) => {
    if (isProcessing) return;
    setInput(query);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-semibold text-foreground">Master AI Console</span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      <div className="pt-16 flex h-screen">
        {/* Sidebar - Agent Status */}
        <aside className="hidden lg:flex w-72 flex-col border-r border-border/50 bg-card/30">
          <div className="p-4 border-b border-border/50">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              AI Agents Status
            </h2>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {agents.map((agent, index) => (
              <Card
                key={agent.name}
                variant={activeAgents.includes(index) ? "glow" : "glass"}
                className={`p-3 transition-all duration-300 ${
                  activeAgents.includes(index) ? "scale-[1.02]" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg bg-background/50 ${agent.color} ${
                      activeAgents.includes(index) ? "animate-pulse" : ""
                    }`}
                  >
                    {agent.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {activeAgents.includes(index) ? "Processing..." : "Ready"}
                    </p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activeAgents.includes(index)
                        ? "bg-primary animate-pulse"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                </div>
              </Card>
            ))}
          </div>
          
          {/* Quick Stats */}
          <div className="p-4 border-t border-border/50 space-y-3">
            <div className="glass-card p-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Papers Analyzed</span>
              <span className="font-semibold text-primary">12,847</span>
            </div>
            <div className="glass-card p-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Patents Searched</span>
              <span className="font-semibold text-primary">8,234</span>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[70%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3"
                      : message.role === "agent"
                      ? "bg-muted/30 border border-border/50 rounded-xl px-4 py-2"
                      : "glass-card rounded-2xl rounded-bl-md px-4 py-3"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-primary/20">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-primary">Master AI</span>
                    </div>
                  )}
                  {message.role === "agent" && (
                    <div className="flex items-center gap-2">
                      {message.agentIcon}
                      <span className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{message.agentName}:</span> {message.content}
                      </span>
                    </div>
                  )}
                  {message.role === "user" && (
                    <div className="flex items-start gap-2">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  )}
                  {message.role === "assistant" && (
                    <div className="prose prose-sm prose-invert max-w-none">
                      <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                        {message.content.split("\n").map((line, i) => {
                          if (line.startsWith("## ")) {
                            return <h3 key={i} className="text-lg font-semibold text-foreground mt-4 mb-2">{line.replace("## ", "")}</h3>;
                          }
                          if (line.startsWith("### ")) {
                            return <h4 key={i} className="text-base font-medium text-primary mt-3 mb-1">{line.replace("### ", "")}</h4>;
                          }
                          if (line.startsWith("**") && line.endsWith("**")) {
                            return <p key={i} className="font-semibold text-foreground mt-2">{line.replace(/\*\*/g, "")}</p>;
                          }
                          if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
                            return <p key={i} className="ml-4 text-muted-foreground">{line}</p>;
                          }
                          if (line.startsWith("- ")) {
                            return <p key={i} className="ml-4 text-muted-foreground">{line}</p>;
                          }
                          return <p key={i} className="text-muted-foreground">{line}</p>;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start animate-fade-in">
                <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    <span className="text-sm text-muted-foreground">Orchestrating agents...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Sample Queries */}
          {messages.length === 1 && (
            <div className="px-4 md:px-6 pb-4">
              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Try these sample queries:
              </p>
              <div className="flex flex-wrap gap-2">
                {sampleQueries.map((query) => (
                  <Button
                    key={query}
                    variant="glass"
                    size="sm"
                    onClick={() => handleSampleQuery(query)}
                    className="text-xs"
                  >
                    {query}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 md:p-6 border-t border-border/50 bg-card/30">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                variant="glass"
                placeholder="Ask about molecules, patents, markets, or regulations..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isProcessing}
                className="flex-1"
              />
              <Button
                type="submit"
                variant="glow"
                disabled={!input.trim() || isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
