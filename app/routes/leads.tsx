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

const LEADS = [
  { name: "Marcus Bell", company: "TechForge Inc.", channel: "LinkedIn DM", score: 94, status: "Hot", stage: "Demo Scheduled" },
  { name: "Priya Sharma", company: "Elevate Partners", channel: "Email", score: 81, status: "Warm", stage: "Proposal Sent" },
  { name: "James Whitmore", company: "Cascade Digital", channel: "Cold Email", score: 73, status: "Warm", stage: "Contacted" },
  { name: "Aaliyah Chen", company: "Pinnacle Group", channel: "Voice", score: 67, status: "Neutral", stage: "Follow-up" },
  { name: "David Torres", company: "Summit Analytics", channel: "DM", score: 58, status: "Neutral", stage: "Contacted" },
  { name: "Rachel Kim", company: "CorePath LLC", channel: "Email", score: 41, status: "Cold", stage: "Prospected" },
];

export default function LeadsPage() {
  const { config, loading } = useConfigurables();
  const [targetPrompt, setTargetPrompt] = useState("");
  const [araiOutput, setAraiOutput] = useState("");
  const [generating, setGenerating] = useState(false);

  const acquisitionName = loading ? "ARAI" : (config?.governorNames?.acquisition ?? "ARAI");

  async function generateLeadStrategy() {
    if (!targetPrompt.trim()) return;
    setGenerating(true);
    setAraiOutput("");
    try {
      const result = await invokeLLM({
        message: targetPrompt,
        systemPrompt: "You are ARAI, the Acquisition Intelligence governor. You create precise multi-channel outreach strategies, ICP definitions, messaging sequences, and revenue expansion playbooks. Be data-driven and action-oriented.",
        schema: {
          type: "object",
          properties: { output: { type: "string" } },
          required: ["output"],
        },
      });
      setAraiOutput((result as any)?.output ?? "Strategy generated. Review below.");
    } catch {
      setAraiOutput("ARAI is being configured. Connect your AI key in Settings to enable live generation.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{acquisitionName}</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Lead Engine</h1>
          <p className="text-sm text-muted-foreground mt-1">Multi-channel AI outreach — email, SMS, DM, voice — powered by {acquisitionName}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Pipeline Value", value: "$186K", sub: "+18% this month" },
            { label: "Leads Qualified", value: "143", sub: "This quarter" },
            { label: "Outreach Sent", value: "2,847", sub: "Across all channels" },
            { label: "Conversion Rate", value: "8.4%", sub: "+2.1% vs last qtr" },
          ].map((stat, i) => (
            <div key={i} className="governor-arai-bg rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-rose-400">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* ARAI generator */}
        <div className="governor-arai-bg rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{acquisitionName} · Acquisition Intelligence</p>
          <h2 className="text-sm font-bold text-foreground mb-3">Generate Outreach Strategy</h2>
          <textarea
            value={targetPrompt}
            onChange={(e) => setTargetPrompt(e.target.value)}
            placeholder={`Describe your ideal client and campaign goal... e.g. 'Create a 5-touch email sequence targeting CFOs at Series B SaaS companies to sell our AI consulting package'`}
            rows={3}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <button
            onClick={generateLeadStrategy}
            disabled={generating || !targetPrompt.trim()}
            className="mt-3 bg-rose-500 text-white font-bold px-5 py-2 rounded-lg text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {generating ? "Generating..." : `Generate with ${acquisitionName}`}
          </button>
          {araiOutput && (
            <div className="mt-4 bg-background border border-border rounded-lg p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Strategy Output</p>
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">{araiOutput}</pre>
            </div>
          )}
        </div>

        {/* Lead pipeline */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Lead Pipeline</h2>
            <span className="text-xs text-muted-foreground">{LEADS.length} leads</span>
          </div>
          <div className="divide-y divide-border">
            {LEADS.map((lead, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-foreground">{lead.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.company} · via {lead.channel}</p>
                </div>
                <div className="hidden md:block text-xs text-muted-foreground">
                  {lead.stage}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${lead.score}%`,
                        backgroundColor: lead.score >= 80 ? "#EF4444" : lead.score >= 60 ? "#F59E0B" : "#94A3B8",
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-foreground w-8">{lead.score}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  lead.status === "Hot" ? "bg-rose-500/10 text-rose-400" :
                  lead.status === "Warm" ? "bg-primary/10 text-primary" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Channel breakdown */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { channel: "Email", sent: 1240, replies: 87, rate: "7.0%" },
            { channel: "LinkedIn DM", sent: 843, replies: 94, rate: "11.2%" },
            { channel: "SMS", sent: 512, replies: 38, rate: "7.4%" },
            { channel: "Voice", sent: 252, replies: 24, rate: "9.5%" },
          ].map((c, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{c.channel}</p>
              <p className="text-lg font-black text-rose-400">{c.rate}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.sent.toLocaleString()} sent · {c.replies} replies</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
