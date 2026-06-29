import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppLayout } from "~/components/AppLayout";
import { useConfigurables } from "~/modules/configurables";
import { useState } from "react";
import { invokeLLM } from "@qb/agentic";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getUserFromRequest(request)) return redirect("/auth/login");
  return null;
}

const ENGAGEMENTS = [
  { client: "Meridian Capital Group", type: "Full Audit + Roadmap", status: "In Progress", value: "$48,000", stage: "Deliverables", progress: 65 },
  { client: "Anchor Point Labs", type: "SOP Development", status: "In Progress", value: "$12,500", stage: "Review", progress: 80 },
  { client: "Cascade Health Systems", type: "AI Infrastructure Blueprint", status: "Completed", value: "$97,000", stage: "Closed", progress: 100 },
  { client: "Nova Logistics Co.", type: "Execution Plan", status: "Scoping", value: "$8,400", stage: "Discovery", progress: 15 },
];

export default function ConsultingPage() {
  const { config, loading } = useConfigurables();
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);
  const priceRange = loading ? "$97 – $100K+" : (config?.consultingPriceRange ?? "$97 – $100K+");

  async function generateConsultingOutput() {
    if (!prompt.trim()) return;
    setGenerating(true);
    setOutput("");
    try {
      const result = await invokeLLM({
        message: prompt,
        systemPrompt: "You are Omega-Praxis, an elite enterprise consulting AI. You create precise, executive-grade audits, roadmaps, and SOPs. Be structured, authoritative, and actionable. Format output with clear sections.",
        schema: {
          type: "object",
          properties: { output: { type: "string" } },
          required: ["output"],
        },
      });
      setOutput((result as any)?.output ?? "Analysis complete. Review deliverables below.");
    } catch {
      setOutput("Omega-Praxis AI is being configured. Connect your AI key in Settings to enable live generation.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Omega-Praxis</p>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Consulting Engine</h1>
            <p className="text-sm text-muted-foreground mt-1">Autonomous AI consulting — audits, roadmaps, SOPs, execution plans · {priceRange}</p>
          </div>
          <a
            href="/consulting/new"
            className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex-shrink-0"
          >
            + New Engagement
          </a>
        </div>

        {/* AI Generator */}
        <div className="governor-praxis-bg rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Omega-Praxis · Live</p>
          <h2 className="text-sm font-bold text-foreground mb-3">Generate Consulting Output</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the client situation, business challenge, or engagement scope... e.g. 'Create a 90-day AI infrastructure roadmap for a 50-person SaaS company scaling to enterprise'"
            rows={3}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <button
            onClick={generateConsultingOutput}
            disabled={generating || !prompt.trim()}
            className="mt-3 bg-primary text-primary-foreground font-bold px-5 py-2 rounded-lg text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate with Omega-Praxis"}
          </button>
          {output && (
            <div className="mt-4 bg-background border border-border rounded-lg p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Output</p>
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">{output}</pre>
            </div>
          )}
        </div>

        {/* Active engagements */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Active Engagements</h2>
            <span className="text-xs text-muted-foreground">{ENGAGEMENTS.length} total</span>
          </div>
          <div className="divide-y divide-border">
            {ENGAGEMENTS.map((eng, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-foreground">{eng.client}</p>
                    <p className="text-xs text-muted-foreground">{eng.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-primary">{eng.value}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      eng.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" :
                      eng.status === "In Progress" ? "bg-primary/10 text-primary" :
                      "bg-muted text-muted-foreground"
                    }`}>{eng.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${eng.progress}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{eng.stage}</span>
                  <span className="text-xs text-muted-foreground">{eng.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverable types */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Business Audit", price: "From $97", desc: "Full operational assessment" },
            { label: "AI Roadmap", price: "From $2,500", desc: "90-day strategic blueprint" },
            { label: "SOP Package", price: "From $5,000", desc: "Standard operating procedures" },
            { label: "App Builder", price: "$8,000", desc: "Custom AI app development" },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 hover:border-primary transition-colors cursor-pointer">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
              <p className="text-lg font-black text-primary">{item.price}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
